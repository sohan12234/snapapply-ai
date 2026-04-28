import React, { useState, useEffect } from 'react';
import { Upload, Briefcase, Building2, AlignLeft, Send, Loader2, History, Trash2, ExternalLink } from 'lucide-react';
import { analyzeResume } from '../lib/analysis';
import { useAnalysisStore } from '../store/useAnalysisStore';
import { useNavigate } from 'react-router-dom';
import { ResumeAnalysis } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);
  
  const { history, setHistory, setAnalysis, addHistory } = useAnalysisStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await window.puter.kv.get('analysis_history');
        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };
    loadHistory();
  }, [setHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a resume (PDF or TXT)");
    
    setLoading(true);
    try {
      // 1. Read file content
      // PDFs usually need more extraction logic, but for simplicity we treat as text or use Puter's text extraction if available
      // Here we read as text or use a Reader for demo purposes
      const reader = new FileReader();
      const fileText = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string || "");
        reader.readAsText(file);
      });

      // 2. Run AI Analysis
      const results = await analyzeResume(formData.description, fileText);
      
      if (results) {
        const newAnalysis: ResumeAnalysis = {
          ...results,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          company: formData.company,
          jobTitle: formData.title
        };

        // 3. Save to History
        const updatedHistory = [newAnalysis, ...history];
        await window.puter.kv.set('analysis_history', JSON.stringify(updatedHistory));
        addHistory(newAnalysis);
        
        // 4. Navigate to Results
        setAnalysis(newAnalysis);
        navigate('/results');
      }
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    await window.puter.kv.set('analysis_history', JSON.stringify(updatedHistory));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold mb-2">Analyze Resume</h1>
        <p className="text-slate-400">Match your profile against any job description in seconds.</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-slate-300">
                  <Building2 size={16} className="text-blue-500" /> Company Name
                </label>
                <input 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-slate-300">
                  <Briefcase size={16} className="text-blue-500" /> Job Title
                </label>
                <input 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="e.g. Software Engineer"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-slate-300">
                <AlignLeft size={16} className="text-blue-500" /> Job Description
              </label>
              <textarea 
                required
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none placeholder:text-slate-700"
                placeholder="Paste the requirements here..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                <Upload size={16} className="text-blue-500" /> Resume (PDF or TXT)
              </label>
              <div className="relative border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/50 flex flex-col items-center justify-center p-10 hover:border-blue-500/50 transition-colors group cursor-pointer">
                <input 
                  type="file" 
                  accept=".pdf,.txt"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-4 group-hover:scale-110 group-hover:border-blue-500/30 transition-all">
                  <Upload className="text-blue-400" size={32} />
                </div>
                <p className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                  {file ? file.name : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-slate-600 mt-2">Maximum file size 5MB</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              {loading ? "Analyzing Profile..." : "Start Analysis"}
            </button>
          </form>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <History size={20} className="text-blue-500" />
            <h2 className="text-xl font-bold">History</h2>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {history.length === 0 ? (
                <div className="text-center py-10 text-slate-600 border border-dashed border-slate-800 rounded-3xl">
                  No previous analyses yet.
                </div>
              ) : (
                history.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={() => { setAnalysis(item); navigate('/results'); }}
                    className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <div className="pr-8">
                        <h3 className="font-bold group-hover:text-blue-400 transition-colors line-clamp-1">{item.jobTitle}</h3>
                        <p className="text-xs text-slate-500">{item.company}</p>
                      </div>
                      <div className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-blue-400">
                        {item.overall_score}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 relative z-10">
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <button 
                         onClick={(e) => deleteHistoryItem(e, item.id)}
                         className="p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all rounded-full" />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
