import { useEffect, useRef, useState } from "react";
import "./App.css";
import AnalysisResult from "./components/AnalysisResult";
import BrandHeader from "./components/BrandHeader";
import ErrorToast from "./components/ErrorToast";
import HeatmapResult from "./components/HeatmapResult";
import LoadingStatus from "./components/LoadingStatus";
import VideoUploader from "./components/VideoUploader";
import { getFriendlyErrorMessage } from "./utils/errorMessages";

function App() {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("uploading");
  const [loadingStage, setLoadingStage] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const pollTimeoutRef = useRef(null);
  const requestIdRef = useRef(0);

  const API_URL = import.meta.env.VITE_API_URL;
  const hasAnalysisPanel = loading || !!result;

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, []);

  const selectVideo = (file) => {
    setVideo(file);
    setVideoUrl(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) selectVideo(file);
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file) selectVideo(file);
  };

  const analyze = async () => {
    if (!video) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    setLoading(true);
    setLoadingPhase("uploading");
    setLoadingStage(null);
    setResult(null);
    setError("");

    const formData = new FormData();
    formData.append("file", video);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const responseText = await response.text();
        let detail = "Backend error";

        if (responseText) {
          try {
            const parsed = JSON.parse(responseText);
            detail = parsed.detail || parsed.error || parsed.message || responseText;
          } catch {
            detail = responseText;
          }
        }

        throw new Error(detail);
      }

      const { job_id: jobId } = await response.json();
      if (!jobId) throw new Error("The analysis service did not return a job ID.");
      if (requestIdRef.current !== requestId) return;

      setLoadingPhase("processing");

      const poll = async () => {
        if (requestIdRef.current !== requestId) return;

        try {
          const statusResponse = await fetch(
            `${API_URL}/predict/${encodeURIComponent(jobId)}`,
            {
              headers: {
                "ngrok-skip-browser-warning": "true",
              },
            },
          );

          if (!statusResponse.ok) {
            const responseText = await statusResponse.text();
            let detail = "Unable to check the analysis status.";

            if (responseText) {
              try {
                const parsed = JSON.parse(responseText);
                detail = parsed.detail || parsed.error || parsed.message || responseText;
              } catch {
                detail = responseText;
              }
            }

            throw new Error(detail);
          }

          const statusData = await statusResponse.json();
          if (requestIdRef.current !== requestId) return;

          if (
            !Number.isInteger(statusData.stage) ||
            statusData.stage < 0 ||
            statusData.stage > 9
          ) {
            throw new Error("The analysis service returned an invalid job stage.");
          }

          setLoadingStage(statusData.stage);

          if (statusData.status === "completed") {
            pollTimeoutRef.current = null;
            setResult(statusData.result);
            setLoading(false);
            return;
          }

          if (statusData.status === "failed") {
            throw new Error(statusData.error || "The video could not be analyzed.");
          }

          if (statusData.status !== "processing") {
            throw new Error("The analysis service returned an unknown job status.");
          }

          pollTimeoutRef.current = setTimeout(poll, 5000);
        } catch (err) {
          if (requestIdRef.current !== requestId) return;
          pollTimeoutRef.current = null;
          setLoading(false);
          setError(getFriendlyErrorMessage(err.message));
        }
      };

      pollTimeoutRef.current = setTimeout(poll, 5000);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      pollTimeoutRef.current = null;
      setLoading(false);
      setError(getFriendlyErrorMessage(err.message));
    }
  };

  const reset = () => {
    requestIdRef.current += 1;
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    setVideo(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="app-container">
      <ErrorToast message={error} />

      <div className={`card ${hasAnalysisPanel ? "has-analysis" : ""}`}>
        <BrandHeader />

        <div className="content-shell">
          <div className={`left-panel ${hasAnalysisPanel ? "shifted" : ""}`}>
            <VideoUploader
              videoUrl={videoUrl}
              loading={loading}
              dragActive={dragActive}
              fileInputRef={fileInputRef}
              onFileChange={handleFileChange}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onReset={reset}
            />

            <button
              className="analyze-btn"
              onClick={analyze}
              disabled={loading || !video}
            >
              {loading
                ? loadingPhase === "uploading"
                  ? "Uploading video"
                  : "Analyzing footage"
                : "Analyze Footage"}
            </button>
          </div>

          {hasAnalysisPanel && (
            <aside className="analysis-panel">
              {loading ? (
                <LoadingStatus loadingPhase={loadingPhase} loadingStage={loadingStage} />
              ) : (
                <AnalysisResult result={result} />
              )}
            </aside>
          )}
        </div>

        {!loading && result && <HeatmapResult result={result} />}
      </div>
    </div>
  );
}

export default App;
