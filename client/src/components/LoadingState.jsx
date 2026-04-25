export default function LoadingState() {
  return (
    <div className="w-full max-w-5xl mx-auto mt-10 animate-fade-in-up" id="loading-state">
      {/* Score cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 flex flex-col items-center gap-5">
            <div className="skeleton h-6 w-28" />
            <div className="skeleton w-32 h-32 rounded-full" />
            <div className="skeleton h-4 w-40" />
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-10 w-24 rounded-lg" />
        ))}
      </div>

      {/* Result items skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="glass-card p-4">
            <div className="flex items-start gap-3">
              <div className="skeleton w-9 h-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="skeleton h-4 w-32" />
                  <div className="skeleton h-4 w-16 rounded-full" />
                </div>
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Animated scanning text */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-3 text-primary-400 text-sm">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" className="opacity-25" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="15 45" strokeLinecap="round" />
          </svg>
          Scanning website and analyzing SEO & AEO factors…
        </div>
      </div>
    </div>
  );
}
