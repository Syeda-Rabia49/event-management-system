export function Loader({ text = 'Loading…' }) {
  return (
    <div className="loader" role="status">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-error" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function FormField({ label, error, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} className={error ? 'invalid' : ''} />
      {error && <small className="error-text">{error}</small>}
    </label>
  );
}