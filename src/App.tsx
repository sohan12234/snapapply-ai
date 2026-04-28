import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useAnalysisStore } from './store/useAnalysisStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Navbar from './components/Navbar';

export default function App() {
  const { isLoggedIn, setAuth } = useAuthStore();
  const { setAnalysis } = useAnalysisStore();

  // Handle Puter initialization and auto-login
  useEffect(() => {
    const initPuter = async () => {
      try {
        if (window.puter?.auth?.isSignedIn()) {
          const user = await window.puter.auth.getUser();
          setAuth(user);
        }
      } catch (err) {
        console.error("Puter initialization failed", err);
      }
    };
    
    // Wait for Puter to be ready (it usually is by script load, but to be safe)
    if (window.puter) {
      initPuter();
    } else {
      window.addEventListener('load', initPuter);
      return () => window.removeEventListener('load', initPuter);
    }
  }, [setAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/login" 
              element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/results" 
              element={<Results />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
