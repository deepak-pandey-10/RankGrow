import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineChartBar } from "react-icons/hi";

export default function LoginPage({ onSuccess }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Auth Request Failed:", err);
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md saas-card p-8 animate-fade-in-up border border-surface-300">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 shadow mb-4">
            <HiOutlineChartBar className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
            {isLogin ? 'Welcome back to RankGrow' : 'Join RankGrow Today'}
          </h1>
          <p className="text-surface-500 text-[14px] mt-2">
            {isLogin ? 'Access your high-performance SEO dashboard.' : 'Initialize your secure RankGrow audit profile.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded text-[13px] text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div className="animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
              <label className="block text-[13px] font-medium text-surface-600 mb-1">Full Name</label>
              <input
                type="text"
                autoComplete="off"
                className="w-full bg-[#000000] border border-surface-300 rounded-lg px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                placeholder="Alex Mercer"
              />
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-surface-600 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#000000] border border-surface-300 rounded-lg px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
             <label className="block text-[13px] font-medium text-surface-600 mb-1">Secure password</label>
             <input
               type="password"
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full bg-[#000000] border border-surface-300 rounded-lg px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
               placeholder="••••••••"
             />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full btn-primary !py-3 !mt-6"
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In to Dashboard' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center text-[13px] text-surface-500 border-t border-surface-300 pt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
          >
            {isLogin ? 'Register now.' : 'Sign in.'}
          </button>
        </div>
      </div>
    </div>
  );
}
