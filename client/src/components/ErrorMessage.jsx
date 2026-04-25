import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-10 animate-fade-in-up" id="error-message">
      <div className="glass-card border border-danger/20 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-danger/10">
            <HiOutlineExclamationCircle className="w-8 h-8 text-danger" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Analysis Failed</h3>
        <p className="text-sm text-surface-200/60 mb-6 max-w-md mx-auto">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-glow text-sm" id="retry-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
