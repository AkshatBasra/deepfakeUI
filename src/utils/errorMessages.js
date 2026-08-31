export function getFriendlyErrorMessage(message) {
  const rawMessage = String(message || "").trim();
  const normalized = rawMessage.toLowerCase();

  if (normalized.includes("not found")) {
    return "The analysis service could not find the request. Please refresh and try again.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network") ||
    normalized.includes("load")
  ) {
    return "The analysis service is temporarily unavailable. Please check your connection and try again.";
  }

  if (normalized.includes("timeout")) {
    return "The video took too long to process. Please try again with a smaller file.";
  }

  if (
    normalized.includes("unsupported") ||
    normalized.includes("invalid") ||
    normalized.includes("file")
  ) {
    return "The selected file could not be processed. Please upload a valid video file.";
  }

  if (rawMessage) {
    return `Analysis failed: ${rawMessage}`;
  }

  return "Something went wrong while analyzing the video. Please try again.";
}
