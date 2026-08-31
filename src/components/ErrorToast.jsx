function ErrorToast({ message }) {
  if (!message) return null;

  return (
    <div className="error-toast" role="alert">
      <span className="error-icon">!</span>
      <span>{message}</span>
    </div>
  );
}

export default ErrorToast;
