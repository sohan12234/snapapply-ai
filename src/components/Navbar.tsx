import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, FileText, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { logout, user, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  if (!isLoggedIn) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md no-print">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <FileText size={20} className="text-white" />
          </div>
          <span>Puter<span className="text-blue-500">ATS</span></span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 hidden md:flex">
            <User size={16} />
            <span>{user?.username || 'Authenticated'}</span>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
