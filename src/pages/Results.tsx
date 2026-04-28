import React, { useState, useEffect } from 'react';
import { useAnalysisStore } from '../store/useAnalysisStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  Lightbulb, 
  Target, 
  ArrowLeft, 
  Printer, 
  Share2, 
  Copy, 
  Check,
  AlertCircle,
  FileText
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import { motion } from 'motion/react';

export default function Results() {
  const { currentAnalysis, setAnalysis } = useAnalysisStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(!currentAnalysis);

  useEffect(() => {
    const reportId = searchParams.get('report');
    if (reportId && !currentAnalysis) {
      setLoading(true);
      window.puter.fs.getSharedObject(reportId)
        .then(async (sharedObject: any) => {
          const content = await sharedObject.read();
          setAnalysis(JSON.parse(content));
          setLoading(false);
        })
        .catch((err: any) => {
          console.error("Could not load shared report", err);
          setLoading(false);
        });
    }
  }, [searchParams, currentAnalysis, setAnalysis]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 animate-pulse">Loading report...</p>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 max-w-lg mx-auto">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-slate-400 mb-8">We couldn't find the requested analysis report.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      const path = `Documents/ATS_Reports/report-${currentAnalysis.id}.json`;
      // Ensure folder exists (Puter handles this mostly)
      await window.puter.fs.write(path, JSON.stringify(currentAnalysis));
      const sharedFile = await window.puter.fs.share(path);
      
      const appUrl = window.location.origin + window.location.pathname;
      const finalLink = `${appUrl}?report=${sharedFile.id}`;
      
      setShareUrl(finalLink);
    } catch (err) {
      console.error("Sharing failed:", err);
      alert("Failed to create share link.");
    }
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (window.puter?.ui?.showNotification) {
        window.puter.ui.showNotification("Link copied to clipboard!");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 no-print">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleShare}
            className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-750"
          >
            <Share2 size={18} className="text-blue-400" />
            Share
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
          >
            <Printer size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {shareUrl && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between no-print"
        >
          <div className="flex flex-col truncate pr-4">
            <span className="text-[10px] uppercase font-black text-blue-500 tracking-widest mb-1">Public Share Link</span>
            <span className="text-sm text-slate-300 truncate">{shareUrl}</span>
          </div>
          <button 
            onClick={copyToClipboard}
            className="shrink-0 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-all text-blue-400"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
            
            <ScoreGauge score={currentAnalysis.overall_score} />
            
            <div className="mt-6 space-y-2">
              <h2 className="text-2xl font-bold">ATS Compatibility</h2>
              <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full" />
            </div>
            
            <p className="text-slate-400 text-sm mt-6 leading-relaxed">
              {currentAnalysis.tone_analysis}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/30"></div>
            <h3 className="text-slate-200 font-bold flex items-center gap-2 mb-6 text-sm uppercase tracking-widest">
              <Target size={16} className="text-blue-500" /> Skill Analysis
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentAnalysis.skill_gap_analysis.map((skill, i) => (
                <span key={i} className="bg-slate-800/50 border border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-300 hover:border-blue-500/30 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-2 space-y-8">
          <header className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex items-center gap-6 shadow-sm">
             <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
               <FileText size={32} className="text-blue-400" />
             </div>
             <div>
               <h1 className="text-2xl font-bold text-white">{currentAnalysis.jobTitle}</h1>
               <p className="text-slate-400 font-medium">{currentAnalysis.company}</p>
             </div>
          </header>

          <Section 
            title="Success Optimization Tips" 
            icon={<CheckCircle2 className="text-emerald-500" />} 
            items={currentAnalysis.ats_tips} 
            color="border-emerald-500/20"
          />
          
          <Section 
            title="Content Refinement Suggestions" 
            icon={<Lightbulb className="text-yellow-500" />} 
            items={currentAnalysis.content_suggestions} 
            color="border-yellow-500/20"
          />
        </div>
      </div>
      
      {/* Print-only footer */}
      <div className="hidden print:block fixed bottom-0 left-0 w-full text-center py-4 border-t text-xs text-slate-400">
        Generated by AI Resume Analyzer (Puter.js Serverless ATS)
      </div>
    </motion.div>
  );
}

function Section({ title, icon, items, color }: { title: string, icon: React.ReactNode, items: string[], color: string }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg transition-transform hover:scale-[1.002]`}>
      <div className={`border-b border-slate-800 bg-slate-950/50 px-8 py-5 flex items-center gap-3`}>
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
          {icon}
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="p-8 space-y-5">
        {items.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="flex gap-4 group"
          >
            <div className={`mt-2 w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-150 transition-transform shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]`} />
            <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
