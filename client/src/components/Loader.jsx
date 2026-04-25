export default function Loader() {
  return (
    <div className="w-full mt-6 animate-fade-in-up">
      <div className="flex justify-between items-end mb-6 border-b border-surface-200 pb-4">
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="saas-card p-6 flex flex-col items-start gap-4 h-36">
            <div className="skeleton h-4 w-32" />
            <div className="flex items-center gap-6 mt-auto">
              <div className="skeleton w-16 h-16 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <div className="skeleton h-3 w-16" />
                <div className="skeleton h-2 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-20 mb-10">
        <div className="inline-flex items-center gap-3 text-primary-600 text-[14px] tracking-wide font-medium bg-primary-50 px-6 py-3 border border-primary-100 rounded-full shadow-sm">
          <svg className="animate-spin w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" className="opacity-20" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="15 45" strokeLinecap="round" />
          </svg>
          Executing system scans across technical nodes...
        </div>
      </div>
    </div>
  );
}
