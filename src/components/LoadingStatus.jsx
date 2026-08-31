function LoadingStatus({ loadingPhase, loadingStage }) {
  return (
    <div className="analysis-status" role="status" aria-live="polite">
      <div className={`loading-status ${loadingStage}`}>
        {loadingPhase === "uploading" ? (
          <>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill"></div>
            </div>
            <span>Uploading video...</span>
          </>
        ) : (
          <>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill"></div>
            </div>
            <span>
              {loadingStage === "almost"
                ? "Still analyzing... This may take a few minutes."
                : "Analyzing video... This may take a few minutes."}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default LoadingStatus;
