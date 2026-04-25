import { useState } from "react";
import { HiOutlineSearch, HiOutlineLightningBolt } from "react-icons/hi";

export default function UrlInput({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        
        <div className="relative flex-1 flex items-center bg-[#000000] border border-surface-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 transition-colors">
          <div className="pl-4 pr-3 text-surface-500 flex-shrink-0">
            <span className="text-[13px] font-semibold tracking-wide text-surface-400">URL</span>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-transparent py-3 pr-4 text-[15px] text-white placeholder-surface-600 outline-none"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="btn-primary shrink-0 !py-3 !px-6 h-[50px] shadow-sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" className="opacity-20" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="15 45" strokeLinecap="round" />
              </svg>
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Run Audit</span>
          )}
        </button>
      </form>
      
      <p className="mt-3 text-[13px] text-surface-500 flex items-center gap-2">
        <HiOutlineSearch className="w-4 h-4" />
        Analyze architecture, tags, and response headers.
      </p>
    </div>
  );
}
