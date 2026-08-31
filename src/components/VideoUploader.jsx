function UploadIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function VideoUploader({
  videoUrl,
  loading,
  dragActive,
  fileInputRef,
  onFileChange,
  onDrag,
  onDrop,
  onReset,
}) {
  return (
    <div className="upload-section">
      {!videoUrl ? (
        <div
          className={`upload-box ${dragActive ? "active" : ""}`}
          onClick={() => fileInputRef.current.click()}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          <div className="upload-icon">
            <UploadIcon />
          </div>
          <p>Drag & Drop video file here, or click to browse</p>
          <input
            type="file"
            accept="video/*"
            onChange={onFileChange}
            ref={fileInputRef}
            hidden
          />
        </div>
      ) : (
        <div className="video-preview-container">
          <video src={videoUrl} controls className="video-preview" />
          {!loading && (
            <button className="remove-btn" onClick={onReset} title="Remove Video">
              <RemoveIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoUploader;
