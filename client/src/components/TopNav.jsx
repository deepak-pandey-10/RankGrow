import { useState } from "react";
import { HiOutlineSearch, HiOutlineRefresh, HiChartBar, HiOutlineArrowLeft } from "react-icons/hi";

export default function TopNav({ onAnalyze, isLoading, currentUrl, onClear, setView, viewState, userEmail, onLogout }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onAnalyze(url.trim());
      setUrl("");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 sticky top-0 shadow-sm shadow-surface-900/5">

      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-4">
        
        {/* Contextual Back Arrow */}
        {viewState && viewState !== 'home' && (
          <button 
            onClick={onClear}
            className="w-8 h-8 rounded-md flex items-center justify-center mr-1 text-surface-500 hover:text-surface-900 focus:outline-none transition group"
            title="Return to Dashboard Home"
          >
            <HiOutlineArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        {/* Brand */}
        <div className="flex items-center gap-2 mr-4 cursor-pointer" onClick={onClear || (() => window.location.reload())}>
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-600 shadow-sm">
            <HiChartBar className="w-5 h-5" />
          </div>
          <span className="font-bold text-[18px] tracking-tight text-surface-900 hidden sm:block">
            Rank<span className="text-primary-500">Grow</span>
          </span>
        </div>

        {/* Dynamic Breadcrumb */}
        {currentUrl && (
          <div className="hidden lg:flex items-center text-[14px] text-surface-500 gap-2 font-medium bg-surface-50 px-3 py-1.5 rounded-md border border-surface-200">
            <span>Audit Report</span>
            <span>/</span>
            <span className="text-surface-900 font-bold">{currentUrl}</span>
          </div>
        )}
      </div>

      {/* Quick Audit Bar (Only show if not on home screen) */}
      {currentUrl && (
        <form onSubmit={handleSubmit} className="relative flex-1 max-w-sm mx-4">
          <div className="relative flex items-center border border-surface-200 rounded-lg bg-surface-50 overflow-hidden focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
            <div className="pl-3 text-surface-400">
              {isLoading ? <HiOutlineRefresh className="w-4 h-4 animate-spin" /> : <HiOutlineSearch className="w-4 h-4" />}
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Audit another domain..."
              disabled={isLoading}
              className="w-full bg-transparent py-2.5 px-3 text-[14px] text-surface-900 placeholder-surface-400 outline-none"
              spellCheck="false"
            />
          </div>
        </form>
      )}

      {/* Links / Profile */}
      <div className="flex items-center gap-6 text-[13px] font-semibold text-surface-600">
         {userEmail ? (
           <>
             <button onClick={() => setView && setView('history')} className="hover:text-surface-900 transition tracking-wide hidden sm:block">History</button>
             <button onClick={() => setView && setView('settings')} className="hover:text-surface-900 transition tracking-wide hidden sm:block">Settings</button>
             
             <div className="flex items-center gap-4 border-l border-surface-200 pl-6 ml-2">
               <div className="w-8 h-8 rounded-full bg-surface-200 border border-surface-300 shadow-sm flex items-center justify-center text-surface-900 text-[11px] font-bold uppercase" title={userEmail}>
                 {userEmail.substring(0, 2)}
               </div>
               <button onClick={onLogout} className="text-[12px] text-surface-500 hover:text-red-500 transition font-medium tracking-wide">Logout</button>
             </div>
           </>
         ) : (
           <button 
             onClick={() => setView && setView('auth')}
             className="px-5 py-2.5 rounded-lg bg-primary-600 text-[#ffffff] hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/20 active:scale-95"
           >
             Sign In
           </button>
         )}
      </div>
    </header>
  );
}
