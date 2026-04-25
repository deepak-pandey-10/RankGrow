import { HiOutlineSparkles, HiOutlineCode, HiOutlineDocumentText } from "react-icons/hi";

export default function AeoEnhancements({ enhancements }) {
  if (!enhancements) return null;

  const { suggestedQuestions, snippetSuggestions, generatedFaqSchema } = enhancements;

  if (!generatedFaqSchema && suggestedQuestions.length === 0 && snippetSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="saas-card overflow-hidden">
      <div className="p-5 bg-surface-50 border-b border-surface-200">
        <h3 className="text-[15px] font-semibold text-surface-900 flex items-center gap-2">
          <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
          AEO Content Automations
        </h3>
        <p className="text-[13px] text-surface-500 mt-1">
          Algorithmic schemas targeting Voice Search & AI Overviews.
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* 1. Question Transformations */}
        {suggestedQuestions.length > 0 && (
          <div>
            <h4 className="text-[12px] font-semibold text-surface-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <HiOutlineDocumentText className="w-4 h-4" />
              Question Inversions
            </h4>
            <div className="space-y-2">
              {suggestedQuestions.map((q, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3 text-[14px] bg-white p-3 rounded-lg border border-surface-200 shadow-sm">
                  <span className="text-surface-400 line-through shrink-0">{q.original}</span>
                  <span className="hidden md:inline text-surface-300">→</span>
                  <span className="text-surface-900 font-medium">{q.suggested}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Featured Snippet Sweet Spot */}
        {snippetSuggestions.length > 0 && (
          <div>
             <h4 className="text-[12px] font-semibold text-surface-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <HiOutlineSparkles className="w-4 h-4" />
              Snippet Trimming
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {snippetSuggestions.map((snip, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-surface-200 shadow-sm">
                  <div className="text-primary-600 font-bold text-[14px] mb-2">{snip.heading}</div>
                  <p className="text-surface-700 text-[13px] leading-relaxed mb-3">{snip.suggestedAnswer}</p>
                  <div className="inline-block bg-surface-100 text-surface-500 text-[11px] uppercase p-1.5 rounded font-semibold tracking-wider">
                    Word Count: {snip.originalAnswerWordCount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. FAQ Schema Code */}
        {generatedFaqSchema && (
          <div>
             <h4 className="text-[12px] font-semibold text-surface-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <HiOutlineCode className="w-4 h-4" />
              Schema Graph
            </h4>
            <div className="bg-surface-900 p-5 rounded-xl shadow-inner overflow-hidden border border-surface-700">
              <code className="block text-[13px] text-emerald-400 font-mono whitespace-pre overflow-x-auto leading-relaxed">
                {generatedFaqSchema}
              </code>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
