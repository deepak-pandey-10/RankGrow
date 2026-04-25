import { HiOutlineTrash, HiOutlineExclamationCircle, HiOutlineCog } from "react-icons/hi";

export default function SettingsPage({ onClearHistory, historyCount, userEmail }) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6 animate-fade-in-up">
      <div className="mb-8 border-b border-surface-200 pb-4">
        <h2 className="text-2xl font-bold text-surface-900 tracking-tight flex items-center gap-2">
          <HiOutlineCog className="w-6 h-6 text-primary-500" />
          System Settings
        </h2>
        <p className="text-[14px] text-surface-500 mt-1">Manage application preferences and local caching protocols.</p>
      </div>

      <div className="space-y-6">
        
        {/* Storage Management Panel */}
        <div className="saas-card overflow-hidden">
           <div className="p-5 border-b border-surface-300 bg-surface-50 flex items-center justify-between">
             <h3 className="text-[15px] font-semibold text-surface-900 tracking-wide">Data Governance ({userEmail})</h3>
             <span className="text-[12px] bg-[#000000] border border-surface-300 text-surface-600 px-2 py-1 rounded font-mono">
                {historyCount} saved records
             </span>
           </div>
           
           <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
             <div>
                <h4 className="text-[14px] font-medium text-surface-900 mb-1">Clear Local Audit Memory</h4>
                <p className="text-[13px] text-surface-500 max-w-sm">
                  Purge all historical domains and cached reports permanently from your browser's persistent storage.
                </p>
             </div>
             
             <button 
               onClick={onClearHistory}
               disabled={historyCount === 0}
               className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-red-500 font-semibold text-[13px] hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <HiOutlineTrash className="w-4 h-4" />
               Purge Memory
             </button>
           </div>
        </div>

        {/* Read Only Panel */}
        <div className="saas-card p-6 bg-[rgba(59,130,246,0.05)] border-[rgba(59,130,246,0.2)]">
           <div className="flex items-start gap-4">
              <HiOutlineExclamationCircle className="w-6 h-6 text-primary-500 shrink-0" />
              <div>
                <h4 className="text-[14px] font-semibold text-primary-400 mb-1">Architecture Note</h4>
                <p className="text-[13px] text-surface-600 leading-relaxed">
                  RankGrow operates structurally on Local Execution Memory. The data models generated from your API calls are saved directly into your browser's LocalStorage schema (IndexedDB). No external Postgres or MongoDB clusters are persisting your audit results centrally.
                </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
