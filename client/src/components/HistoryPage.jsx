import { HiOutlineClock, HiOutlineLink, HiOutlineExternalLink, HiOutlineChartBar } from "react-icons/hi";

export default function HistoryPage({ history, onSelectReport }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
        <HiOutlineClock className="w-16 h-16 text-surface-500 mb-4" />
        <h2 className="text-xl font-semibold text-surface-900 mb-2 tracking-tight">No Audit History</h2>
        <p className="text-surface-600 text-[14px]">You haven't run any domain analysis yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 animate-fade-in-up">
      <div className="mb-8 border-b border-surface-200 pb-4">
        <h2 className="text-2xl font-bold text-surface-900 tracking-tight flex items-center gap-2">
          <HiOutlineClock className="w-6 h-6 text-primary-500" />
          Audit Ledger
        </h2>
        <p className="text-[14px] text-surface-500 mt-1">Review previously completed analysis reports.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.map((record, index) => {
          const score = record.score;
          let scoreStatus = "text-danger border-danger";
          if (score >= 80) scoreStatus = "text-success border-success";
          else if (score >= 60) scoreStatus = "text-warning border-warning";

          const date = new Date(record.analyzedAt).toLocaleDateString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });

          return (
            <div 
              key={index} 
              onClick={() => onSelectReport(record)}
              className="saas-card saas-card-interactive p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-surface-900 font-semibold text-[16px]">
                  <HiOutlineLink className="w-4 h-4 text-surface-500" />
                  {record.url}
                </div>
                <div className="text-[12px] text-surface-600 flex items-center gap-3 font-mono">
                  <span>{date}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 md:mt-0">
                 {/* Mini Metrics */}
                 <div className="hidden md:flex items-center gap-8 text-[12px] font-medium text-surface-500 text-center">
                    <div>
                      <div className="text-surface-900 font-bold text-[14px]">{record.seo.score}</div>
                      <div>SEO</div>
                    </div>
                    <div>
                      <div className="text-surface-900 font-bold text-[14px]">{record.aeo.score}</div>
                      <div>AEO</div>
                    </div>
                    <div>
                      <div className="text-surface-900 font-bold text-[14px]">{record.tech.score}</div>
                      <div>Tech</div>
                    </div>
                 </div>

                 {/* Overall Score Badge */}
                 <div className={`w-12 h-12 rounded-lg border-2 ${scoreStatus} flex items-center justify-center font-bold text-[16px] bg-[#000000]`}>
                   {score}
                 </div>
                 
                 <HiOutlineExternalLink className="w-5 h-5 text-surface-600 group-hover:text-primary-400 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
