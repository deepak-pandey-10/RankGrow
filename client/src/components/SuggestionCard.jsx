import { HiOutlineLightBulb } from "react-icons/hi";

const severityBadge = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
};

export default function SuggestionCard({ suggestion }) {
  const badgeClass = severityBadge[suggestion.severity] || severityBadge.low;

  return (
    <div className="saas-card overflow-hidden">
      {/* Header */}
      <div className="bg-surface-50 p-4 border-b border-surface-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <div className="p-1.5 bg-white border border-surface-200 rounded shadow-sm text-primary-500">
             <HiOutlineLightBulb className="w-4 h-4" />
           </div>
           <h4 className="text-[15px] font-semibold text-surface-900 capitalize">
             {suggestion.check.replace(/_/g, ' ')}
           </h4>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${badgeClass}`}>
          {suggestion.severity} Priority
        </span>
      </div>

      <div className="p-5 flex flex-col md:flex-row gap-6">
        
        {/* Left Column: Context & Action */}
        <div className="flex-1 space-y-5">
          <div>
            <h5 className="text-[11px] font-semibold text-surface-500 uppercase tracking-widest mb-1.5">Context</h5>
            <p className="text-[14px] text-surface-700 leading-relaxed">{suggestion.problem}</p>
          </div>

          <div>
            <h5 className="text-[11px] font-semibold text-surface-500 uppercase tracking-widest mb-1.5">Prescribed Action</h5>
            <p className="text-[14px] font-medium text-surface-900 leading-relaxed">{suggestion.fix}</p>
          </div>
        </div>

        {/* Right Column: Code / Example Block */}
        {suggestion.example && suggestion.example.trim() !== "N/A" && (
          <div className="w-full md:w-2/5 shrink-0 bg-surface-900 rounded-lg p-4 border border-surface-700 shadow-inner">
            <span className="block text-[10px] font-mono text-surface-400 uppercase tracking-widest mb-3">Example Implementation</span>
            <code className="text-[12px] text-emerald-400 font-mono block whitespace-pre-wrap break-words leading-relaxed">
              {suggestion.example}
            </code>
          </div>
        )}

      </div>
    </div>
  );
}
