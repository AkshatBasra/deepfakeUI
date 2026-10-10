const STAGE_LABELS = {
  0: "Queued",
  1: "Validating your Video",
  2: "Extracting Frame",
  3: "Looking for Faces",
  4: "Face alignment and cropping",
  5: "Preprocessing Image",
  6: "Model inference",
  7: "Explanation/heatmap generation",
  8: "Completed",
  9: "Failed",
};

function LoadingStatus({ loadingPhase, loadingStage }) {
  const isDeterminate =
    loadingPhase === "processing" && Number.isInteger(loadingStage);
  const progress = isDeterminate ? Math.min(loadingStage / 8, 1) * 100 : undefined;
  const stageLabel = isDeterminate ? STAGE_LABELS[loadingStage] : null;
  const progressText = isDeterminate
    ? `${Math.round(progress)}% (${loadingStage}/8) - ${stageLabel}`
    : null;

  return (
    <div className="analysis-status" role="status" aria-live="polite">
      <div className="loading-status">
        {loadingPhase === "uploading" ? (
          <>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill"></div>
            </div>
            <span>Uploading video...</span>
          </>
        ) : (
          <>
            <div
              className="progress-track"
              aria-label="Analysis progress"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={isDeterminate ? progress : undefined}
            >
              <div
                className={`progress-fill${isDeterminate ? " determinate" : ""}`}
                style={isDeterminate ? { width: `${progress}%` } : undefined}
              ></div>
            </div>
            <span>
              Analyzing video
              {progressText ? `... ${progressText}` : "..."} 
              {/* This may take a few minutes. */}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default LoadingStatus;
