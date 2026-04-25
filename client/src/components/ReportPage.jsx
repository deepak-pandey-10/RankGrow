import { useState } from "react";
import { HiOutlineLightningBolt, HiOutlineSearch, HiOutlineChartBar, HiOutlineCode } from "react-icons/hi";
import ScoreCard from "./ScoreCard";
import IssueList from "./IssueList";
import SuggestionCard from "./SuggestionCard";
import AeoEnhancements from "./AeoEnhancements";

export default function ReportPage({ data }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!data) return null;
  const { score, seo, aeo, tech, issues, suggestions, url } = data;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "seo", label: "SEO Engine" },
    { id: "aeo", label: "Answer Engine" },
    { id: "performance", label: "Performance" }
  ];

  // Helper arrays for rendering components
  const filterByType = (array, type) => array.filter(item => item.type === type);

  return (
    <div className="w-full mt-6 animate-fade-in-up pb-20">
      
      {/* Header Info */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
           <h2 className="text-2xl font-bold text-surface-900 tracking-tight">Analysis Report</h2>
           <a href={url} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-700 transition text-[15px] font-medium mt-1 inline-flex items-center gap-1 group">
             {url}
             <svg className="w-4 h-4 text-primary-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
             </svg>
           </a>
         </div>
         
         <div className="flex gap-4">
            <div className="saas-card px-4 py-2 flex items-center gap-4 bg-white">
              <span className="text-[13px] font-semibold text-surface-500 uppercase tracking-wider">Potential Score</span>
              <span className="text-xl font-bold text-success">+{(100 - score) > 0 ? (100 - score) : 0}</span>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-surface-200 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 text-[14px] font-medium transition-colors border-b-2 whitespace-nowrap px-1 ${
              activeTab === t.id 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-surface-500 hover:text-surface-900 border-b-transparent hover:border-surface-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === "overview" && (
        <div className="animate-fade-in-up">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <ScoreCard title="Domain Authority" score={score} icon={HiOutlineChartBar} description="Aggregated Score" />
            <ScoreCard title="Technical" score={tech.score} icon={HiOutlineCode} description="Payload & SSL" />
            <ScoreCard title="Search Engine" score={seo.score} icon={HiOutlineSearch} description="Tag Opt." />
            <ScoreCard title="Answer Engine" score={aeo.score} icon={HiOutlineLightningBolt} description="Snippet Opt." />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12">
               <h3 className="text-lg font-semibold text-surface-900 mb-4 border-b border-surface-200 pb-2">High Priority Resolutions Top-Down</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {suggestions.slice(0,4).map((sug, idx) => (
                    <SuggestionCard key={idx} suggestion={sug} />
                 ))}
               </div>
               {suggestions.length > 4 && (
                 <button onClick={() => setActiveTab('seo')} className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">
                   View {suggestions.length - 4} more resolutions...
                 </button>
               )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SEO */}
      {activeTab === "seo" && (
        <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-5">
             <IssueList issues={filterByType(issues, "seo")} title="SEO Issues Tracker" />
           </div>
           <div className="lg:col-span-7">
              <h3 className="text-[14px] font-semibold tracking-wide text-surface-900 uppercase mb-4">Required Actions</h3>
              <div className="grid grid-cols-1 gap-5">
               {filterByType(suggestions, "seo").length === 0 ? (
                 <div className="saas-card p-6 text-[14px] text-surface-500 bg-surface-50">No critical SEO adjustments needed.</div>
               ) : (
                 filterByType(suggestions, "seo").map((sug, idx) => <SuggestionCard key={idx} suggestion={sug} />)
               )}
             </div>
           </div>
        </div>
      )}

      {/* TAB CONTENT: AEO */}
      {activeTab === "aeo" && (
        <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
             <IssueList issues={filterByType(issues, "aeo")} title="AEO Deficiencies" />
          </div>
          <div className="lg:col-span-7">
             <div className="mb-8">
                <h3 className="text-[14px] font-semibold tracking-wide text-surface-900 uppercase mb-4">AEO Enhancements</h3>
                {aeo.enhancements ? <AeoEnhancements enhancements={aeo.enhancements} /> : <div className="saas-card p-6 text-[14px] text-surface-500 bg-surface-50">Content insufficient for automatic Schema generation.</div>}
             </div>
             
             <h3 className="text-[14px] font-semibold tracking-wide text-surface-900 uppercase mb-4">Required Actions</h3>
             <div className="grid grid-cols-1 gap-5">
               {filterByType(suggestions, "aeo").map((sug, idx) => <SuggestionCard key={idx} suggestion={sug} />)}
             </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Performance */}
      {activeTab === "performance" && (
        <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-5">
             <IssueList issues={filterByType(issues, "tech")} title="Technical Bottlenecks" />
           </div>
           <div className="lg:col-span-7">
              <h3 className="text-[14px] font-semibold tracking-wide text-surface-900 uppercase mb-4">Required Actions</h3>
              <div className="grid grid-cols-1 gap-5">
               {filterByType(suggestions, "tech").length === 0 ? (
                 <div className="saas-card p-6 text-[14px] text-surface-500 bg-surface-50">Technical architecture passes standard core web vitals.</div>
               ) : (
                 filterByType(suggestions, "tech").map((sug, idx) => <SuggestionCard key={idx} suggestion={sug} />)
               )}
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
