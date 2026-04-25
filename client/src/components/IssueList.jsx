import { HiOutlineExclamationCircle, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const severityConfig = {
  high: { 
    icon: HiOutlineXCircle, 
    color: "text-danger", 
    bg: "bg-red-50",
    border: "border-red-200", 
    label: "High" 
  },
  medium: { 
    icon: HiOutlineExclamationCircle, 
    color: "text-warning", 
    bg: "bg-amber-50",
    border: "border-amber-200", 
    label: "Medium" 
  },
  low: { 
    icon: HiOutlineCheckCircle, 
    color: "text-success", 
    bg: "bg-emerald-50",
    border: "border-emerald-200", 
    label: "Low" 
  },
};

export default function IssueList({ issues, title = "Issue Ledger" }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="saas-card p-6 flex flex-col items-center justify-center text-center bg-emerald-50/50 border-emerald-200">
        <HiOutlineCheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
        <h3 className="text-sm font-bold text-emerald-800">Scan completed successfully.</h3>
        <p className="text-xs text-emerald-600 mt-1">0 compliance issues detected in this domain scan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 border-b border-surface-200 pb-2">
        <h3 className="text-[14px] font-semibold tracking-wide text-surface-900 uppercase">
          {title}
        </h3>
        <span className="bg-surface-200 text-surface-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
          {issues.length} Identified
        </span>
      </div>
      
      <div className="flex flex-col gap-3">
        {issues.map((issue, idx) => {
          const config = severityConfig[issue.severity] || severityConfig.low;
          const Icon = config.icon;
          
          return (
            <div key={idx} className={`saas-card p-4 flex gap-4 ${config.bg} ${config.border}`}>
              <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${config.color}`} />
              
              <div className="flex-1 flex flex-col gap-1.5">
                 <div className="flex items-center justify-between">
                   <div className="font-semibold text-surface-900 text-[14px] capitalize">
                     {issue.type} Flag: {issue.check.replace(/_/g, ' ')}
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border ${config.border} ${config.color}`}>
                     {config.label} Impact
                   </span>
                 </div>
                 <p className="text-surface-700 text-[13px] leading-relaxed">{issue.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
