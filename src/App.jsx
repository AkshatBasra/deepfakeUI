import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("progress");
  const [videoUrl, setVideoUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!loading) return undefined;

    const timeout = setTimeout(() => {
      setLoadingStage("almost");
    }, 60000);  // Change Duration of Progress Bar Here

    return () => clearTimeout(timeout);
  }, [loading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setVideo(file);
      setVideoUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const analyze = async () => {
    if (!video) return;

    setLoading(true);
    setLoadingStage("progress");
    setResult(null);

    const formData = new FormData();
    formData.append("file", video);

    try {
      console.log("Doing API Call");
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      console.log("API Call Done");

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Backend error");
      }

      const data = await res.json();
      // Simulate minimal delay for UX if needed, or remove
      setTimeout(() => {
      setResult(data);
      setLoading(false);
      }, 1000);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const reset = () => {
    setVideo(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getPredictionClass = (pred) => {
    return pred === "fake" ? "fake" : "real";
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Deepfake <span className="highlight">Detector</span></h1>

        <div className="upload-section">
          {!videoUrl ? (
            <div
              className={`upload-box ${dragActive ? "active" : ""}`}
              onClick={() => fileInputRef.current.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                {/* Cloud Upload Icon */}
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p>Drag & Drop video file here, or click to browse</p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                hidden
              />
            </div>
          ) : (
            <div className="video-preview-container">
              <video
                src={videoUrl}
                controls
                className="video-preview"
              />
              {!loading && (
                <button className="remove-btn" onClick={reset} title="Remove Video">
                  {/* X Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <button
          className="analyze-btn"
          onClick={analyze}
          disabled={loading || !video}
        >
          {loading ? (
            <>
              {/* <span className="loader"></span> */}
              Analyzing footage
            </>
          ) : (
            <>
              Analyze Footage
            </>
          )}
        </button>

        {loading && (
          <div className={`loading-status ${loadingStage}`} role="status" aria-live="polite">
            {loadingStage === "almost" ? (
              <>
                <span className="loader"></span>
                <span>Almost there...</span>
              </>
            ) : (
              <>
                <div className="progress-track" aria-hidden="true">
                  <div className="progress-fill"></div>
                </div>
                <span>Analyzing selected footage...</span>
              </>
            )}
          </div>
        )}

        {result && (
          <div className={`result-box ${getPredictionClass(result.prediction)}`}>

            <div className="result-header">
              <span className="result-title">Analysis Result</span>
              <span className={`prediction-badge ${getPredictionClass(result.prediction)}`}>
                {result.prediction === "fake" ? (
                  // Alert Icon
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                ) : (
                  // Check Icon
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )}
                {result.prediction.toUpperCase()}
              </span>
            </div>

            <div className="confidence-section">
              <div className="confidence-label">
                <span>Confidence Score</span>
                <span>{((result.prediction === "real" ? 1 - result.confidence : result.confidence) * 100).toFixed(1)}%</span>
              </div>
              <div className="confidence-bar-bg">
                <div
                  className={`confidence-fill ${getPredictionClass(result.prediction)}`}
                  style={{ width: `${(result.prediction === "real" ? 1 - result.confidence : result.confidence) * 100}%` }}
                ></div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
