function PredictionIcon({ prediction }) {
  if (prediction === "fake") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function AnalysisResult({ result }) {
  const predictionClass = result.prediction === "fake" ? "fake" : "real";
  const confidence = (result.prediction === "real"
    ? 1 - result.confidence
    : result.confidence) * 100;

  return (
    <div className={`result-box ${predictionClass}`}>
      <div className="result-header">
        <span className="result-title">Analysis Result</span>
        <span className={`prediction-badge ${predictionClass}`}>
          <PredictionIcon prediction={result.prediction} />
          {result.prediction.toUpperCase()}
        </span>
      </div>

      <div className="confidence-section">
        <div className="confidence-label">
          <span>Confidence Score</span>
          <span>{confidence.toFixed(1)}%</span>
        </div>
        <div className="confidence-bar-bg">
          <div
            className={`confidence-fill ${predictionClass}`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>

    </div>
  );
}

export default AnalysisResult;
