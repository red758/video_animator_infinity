
import React, { useState, useEffect } from 'react';
import { Code, Zap, X, Edit3, Trash2, Check, ChevronDown } from 'lucide-react';
import FileUpload from './components/FileUpload';
import VideoScroller from './components/VideoScroller';
import InfinityLogo from './components/Logo';
import { generateVideoStory } from './services/geminiService';
import { generateSnippetCode } from './services/exportService';
import { VideoState, ScrollSection } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<VideoState>({
    url: null,
    duration: 0,
    sections: [],
    isAnalyzing: false,
    brandName: "INFINITY",
    sensitivity: 0.1
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = (showExportModal || state.isAnalyzing) ? 'hidden' : 'unset';
  }, [showExportModal, state.isAnalyzing]);

  const handleVideoInit = async (url: string, sourceName: string) => {
    setState(prev => ({ ...prev, url, isAnalyzing: true }));
    setError(null);
    try {
      const storySections = await generateVideoStory(`Source: ${sourceName}`, state.brandName);
      setState(prev => ({ ...prev, sections: storySections, isAnalyzing: false }));
    } catch (err: any) {
      setError(`CRITICAL_FAULT: ${err.message}`);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleReset = () => {
    setState({ ...state, url: null, sections: [] });
    setIsEditMode(false);
  };

  if (state.url && !state.isAnalyzing) {
    return (
      <div className="bg-black text-white min-h-screen selection:bg-indigo-500/30">
        <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-5 flex justify-between items-center bg-black/60 backdrop-blur-3xl border-b border-white/5">
          <div className="flex items-center gap-5">
            <InfinityLogo size={20} className="text-white" />
            <div className="w-px h-5 bg-white/10" />
            <span className="text-[9px] font-black tracking-[0.6em] text-indigo-500">AEON_STUDIO_V3</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isEditMode ? 'bg-indigo-600' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {isEditMode ? <Check size={12} /> : <Edit3 size={12} />}
              <span>{isEditMode ? 'Save' : 'Edit'}</span>
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-8 py-2 bg-white text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              <Code size={12} /> Export
            </button>
            <button onClick={handleReset} className="p-2 text-white/20 hover:text-white transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </nav>

        <VideoScroller 
          videoUrl={state.url} 
          sections={state.sections} 
          isEditMode={isEditMode}
          onUpdateSection={(idx, updated) => {
            const next = [...state.sections];
            next[idx] = updated;
            setState(prev => ({ ...prev, sections: next }));
          }}
        />

        {showExportModal && (
          <div className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div>
                  <h3 className="text-xs font-black tracking-[0.5em] uppercase text-indigo-500">System Source</h3>
                  <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/20 mt-1">Production Isolation Build</p>
                </div>
                <button onClick={() => setShowExportModal(false)} className="p-3 hover:bg-white/5 rounded-full text-white/40 transition-colors"><X size={20}/></button>
              </div>
              <div className="flex-1 p-8 overflow-y-auto font-mono text-[10px] text-white/40 bg-black/40 custom-scrollbar leading-relaxed">
                <pre className="whitespace-pre-wrap">{generateSnippetCode(state.sections, state.url, state.sensitivity)}</pre>
              </div>
              <div className="px-10 py-6 border-t border-white/5 flex justify-end bg-black">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generateSnippetCode(state.sections, state.url!, state.sensitivity));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`px-14 py-4 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${copied ? 'bg-emerald-600' : 'bg-white text-black hover:scale-105'}`}
                >
                  {copied ? 'Copied Successfully' : 'Copy Isolated Code'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <header className="fixed top-10 left-10 z-50 flex items-center gap-5 animate-in fade-in duration-700">
        <InfinityLogo size={24} className="text-white" />
        <div className="w-px h-6 bg-white/20" />
        <span className="text-[10px] font-black tracking-[0.8em] uppercase text-white/40">AEON</span>
      </header>

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="text-center mb-16 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[1.5em] text-indigo-500/60">Creative Protocol Alpha</p>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8] text-white drop-shadow-2xl">
            NARRATIVE<br />
            <span className="text-neutral-900 drop-shadow-none">SCROLLER.</span>
          </h1>
        </div>

        <div className="w-full">
          <FileUpload 
            onFileSelect={(file) => handleVideoInit(URL.createObjectURL(file), file.name)} 
            onSampleSelect={(url, name) => handleVideoInit(url, name)}
            isAnalyzing={state.isAnalyzing} 
          />
        </div>

        <div className="mt-12 opacity-5 flex flex-col items-center gap-2">
           <span className="text-[7px] font-black tracking-[1em] uppercase">Begin Scroll</span>
           <ChevronDown size={20} className="animate-bounce" />
        </div>

        {error && (
          <div className="fixed bottom-10 p-5 bg-red-900/20 border border-red-500/20 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-6 backdrop-blur-3xl shadow-2xl">
            <Zap size={14} /> {error}
            <button onClick={() => setError(null)} className="opacity-50 hover:opacity-100"><X size={14}/></button>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default App;
