import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await window.puter.auth.signIn();
      if (user) {
        setAuth(user);
        navigate('/');
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-slate-950 text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 border border-slate-800 rounded-3xl bg-slate-900 shadow-2xl text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          AI Resume Analyzer
        </h1>
        <p className="text-slate-400 mb-8">
          Unlock your career potential with serverless AI resume matching.
        </p>
        
        <button 
          onClick={handleLogin}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 mb-8 active:scale-[0.98]"
        >
          Login with Puter.js
        </button>

        <div className="grid grid-cols-3 gap-4 text-xs text-slate-500">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck size={20} className="text-slate-700" />
            <span>Secure</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap size={20} className="text-slate-700" />
            <span>Fast</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe size={20} className="text-slate-700" />
            <span>Serverless</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
