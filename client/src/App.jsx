import { useState, useEffect } from "react";
import TopNav from "./components/TopNav";
import ReportPage from "./components/ReportPage";
import Loader from "./components/Loader";
import UrlInput from "./components/UrlInput";
import HistoryPage from "./components/HistoryPage";
import SettingsPage from "./components/SettingsPage";
import LoginPage from "./components/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { analyzeUrl } from "./services/api";
import { HiOutlineChartBar, HiOutlineSparkles, HiOutlineLightningBolt } from "react-icons/hi";

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Storage hooks
  const [results, setResults] = useState(() => {
    try {
      const saved = localStorage.getItem("nexus_last_audit");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [history, setHistory] = useState([]);

  // State Routing: 'home', 'report', 'history', 'settings', 'auth'
  const [viewState, setViewState] = useState(results ? 'report' : 'home');

  // Load history when user changes and CLAIM anonymous reports
  useEffect(() => {
    if (user) {
      try {
        const userKey = `nexus_audit_history_${user.email}`;
        const saved = localStorage.getItem(userKey);
        let userHistory = saved ? JSON.parse(saved) : [];

        // CLAIM: If we have anonymous results, merge them into the user's history
        if (results) {
          const alreadyExists = userHistory.find(item => item.url === results.url);
          if (!alreadyExists) {
            userHistory = [results, ...userHistory];
            localStorage.setItem(userKey, JSON.stringify(userHistory));
          }
        }

        setHistory(userHistory);
      } catch (e) {
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  }, [user]);

  const handleClear = () => {
    localStorage.removeItem("nexus_last_audit");
    setResults(null);
    setError(null);
    setViewState('home');
  };

  const handleClearHistory = () => {
    if (user) {
      localStorage.removeItem(`nexus_audit_history_${user.email}`);
      setHistory([]);
    }
  };

  const handleSelectHistoricalReport = (report) => {
    setResults(report);
    localStorage.setItem("nexus_last_audit", JSON.stringify(report));
    setViewState('report');
  };

  const handleAnalyze = async (url) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeUrl(url);
      setResults(data);
      setViewState('report');
      localStorage.setItem("nexus_last_audit", JSON.stringify(data));
      
      setHistory(prev => {
        // Remove duplicate urls manually instead of a set to keep order cleanly
        const filtered = prev.filter(item => item.url !== data.url);
        const updated = [data, ...filtered];
        if (user) {
          localStorage.setItem(`nexus_audit_history_${user.email}`, JSON.stringify(updated));
        }
        return updated;
      });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Could not reach the server. Ensure the backend is active.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    handleClear();
  };

  return (
    <div className="flex h-screen bg-surface-100 overflow-hidden font-sans flex-col">
      <TopNav 
        onAnalyze={handleAnalyze} 
        isLoading={isLoading} 
        currentUrl={viewState === 'report' ? results?.url : null} 
        onClear={handleClear} 
        setView={setViewState}
        viewState={viewState}
        userEmail={user?.email}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative h-full">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px] flex items-center justify-between shadow-sm">
              <div><strong>Audit Failed:</strong> {error}</div>
              <button onClick={() => setError(null)} className="underline text-red-600 hover:text-red-800 font-medium">Dismiss</button>
            </div>
          )}

          {isLoading && <Loader />}
          
          {viewState === 'report' && results && !isLoading && (
            <div className="relative">
              {!user && (
                <div className="mb-8 p-4 bg-primary-900/10 border border-primary-500/20 rounded-2xl flex items-center justify-between animate-fade-in-up">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                      <HiOutlineSparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-surface-900">Want to save this report?</h4>
                      <p className="text-[12px] text-surface-500">Log in to add this audit to your permanent dashboard and track progress over time.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewState('auth')}
                    className="px-6 py-2 rounded-lg bg-primary-600 text-white text-[13px] font-bold hover:bg-primary-500 transition shadow-lg shadow-primary-900/40"
                  >
                    Login to Save
                  </button>
                </div>
              )}
              <ReportPage data={results} />
            </div>
          )}
          
          {viewState === 'history' && !isLoading && (
            <HistoryPage history={history} onSelectReport={handleSelectHistoricalReport} />
          )}

          {viewState === 'settings' && !isLoading && (
            <SettingsPage onClearHistory={handleClearHistory} historyCount={history.length} userEmail={user?.email} />
          )}

          {viewState === 'auth' && !isLoading && (
            <LoginPage onSuccess={() => setViewState('history')} />
          )}

          {/* Extremely User-Friendly Empty Home State */}
          {viewState === 'home' && !isLoading && !error && (
             <div className="h-full flex flex-col items-center justify-center -mt-12 animate-fade-in-up">
               <div className="max-w-3xl w-full text-center">
                 <h1 className="text-4xl md:text-5xl font-extrabold text-surface-900 tracking-tight mb-4">
                   Analyze Your Website's <span className="text-primary-600">Health</span>
                 </h1>
                 <p className="text-surface-600 text-[16px] md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                   Instant insights into Technical SEO, Answer Engine Optimization (AEO), and core web vitals. Just drop your link below.
                 </p>
                 
                 <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />
               </div>
               
               {/* Quick visual trust indicators / features */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl text-center">
                 <div className="p-4">
                   <div className="w-12 h-12 bg-surface-200 rounded-full border border-surface-300 mx-auto flex items-center justify-center text-primary-500 mb-3 shadow-sm">
                     <HiOutlineChartBar className="w-6 h-6" />
                   </div>
                   <h3 className="font-bold text-surface-900">Deep SEO Audits</h3>
                   <p className="text-[13px] text-surface-500 mt-1">Full tag compliance and heading hierarchy checks.</p>
                 </div>
                 <div className="p-4">
                   <div className="w-12 h-12 bg-surface-200 rounded-full border border-surface-300 mx-auto flex items-center justify-center text-primary-500 mb-3 shadow-sm">
                     <HiOutlineSparkles className="w-6 h-6" />
                   </div>
                   <h3 className="font-bold text-surface-900">AEO Ready</h3>
                   <p className="text-[13px] text-surface-500 mt-1">Structures your content for AI search snippets.</p>
                 </div>
                 <div className="p-4">
                   <div className="w-12 h-12 bg-surface-200 rounded-full border border-surface-300 mx-auto flex items-center justify-center text-primary-500 mb-3 shadow-sm">
                     <HiOutlineLightningBolt className="w-6 h-6" />
                   </div>
                   <h3 className="font-bold text-surface-900">Performance Grading</h3>
                   <p className="text-[13px] text-surface-500 mt-1">Live metrics from Google PageSpeed Insights.</p>
                 </div>
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
