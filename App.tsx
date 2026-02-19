import React, { useState } from 'react';
import { Code, X, Edit3, Trash2, Check, Terminal, ChevronDown, Monitor, FileText, Smartphone, Layout } from 'lucide-react';
import FileUpload from './components/FileUpload';
import VideoScroller from './components/VideoScroller';
import InfinityLogo from './components/Logo';
import { generateVideoStory } from './services/geminiService';
import { generateSnippetCode } from './services/exportService';
import { VideoState, ScrollSection } from './types';

const SAMPLE_DATA: Record<string, ScrollSection[]> = {
  '1': [
    { title: "THE DREAM", description: "A voyage through the mechanical subconscious.", triggerTime: 0.15, alignment: 'center', vibe: 'cinematic' },
    { title: "SYNCHRONY", description: "Parts moving in a beautiful, unintended dance.", triggerTime: 0.35, alignment: 'left', vibe: 'cinematic' },
    { title: "NIGHTFALL", description: "Shadows defining the edges of the digital void.", triggerTime: 0.55, alignment: 'right', vibe: 'cinematic' },
    { title: "SYSTEMS", description: "Every gear turning with absolute purpose.", triggerTime: 0.75, alignment: 'center', vibe: 'cinematic' },
    { title: "INFINITY", description: "The loop continues beyond the frame.", triggerTime: 0.90, alignment: 'center', vibe: 'cinematic' }
  ]
};

const App: React.FC = () => {
  const [state, setState] = useState<VideoState>({
    url: null,
    duration: 0,
    sections: [],
    isAnalyzing: false,
    brandName: "INFINITY",
    sensitivity: 0.15, // Snappier default for better performance
    scrollDepth: 6,
    startOffset: 0.05,
    endOffset: 0.05,
    layoutMode: 'section',
    viewportAnchor: 0.1,
    widthMode: 'full',
    maxWidth: '1200px',
    topSpacer: 0,
    bottomSpacer: 100
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVideoInit = async (url: string, sourceName: string, sampleId?: string) => {
    const localData = sampleId ? SAMPLE_DATA[sampleId] : null;
    if (localData) {
      setState(prev => ({ ...prev, url, sections: localData, isAnalyzing: false }));
      return;
    }
    setState(prev => ({ ...prev, url, isAnalyzing: true }));
    try {
      const storySections = await generateVideoStory(`Source: ${sourceName}`, state.brandName);
      setState(prev => ({ ...prev, sections: storySections, isAnalyzing: false }));
    } catch (err) {
      setState(prev => ({ ...prev, sections: [], isAnalyzing: false }));
    }
  };

  if (state.url && !state.isAnalyzing) {
    return (
      <div className="bg-black text-white min-h-screen">
        {/* Persistent Toolbar - Mode Selection Visible Immediately */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[200] px-6 py-3 flex flex-wrap justify-between items-center bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl gap-4">
          <div className="flex items-center gap-4">
            <InfinityLogo size={28} className="text-indigo-500" />
            <div className="hidden sm:flex flex-col border-l border-white/10 pl-4">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">AEON ENGINE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            {/* Strategy Toggles - Always Available */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
              <button 
                onClick={() => setState(s => ({...s, layoutMode: 'section'}))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${state.layoutMode === 'section' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
              >
                <FileText size={12} /> <span className="hidden md:inline">In-Page Section</span>
              </button>
              <button 
                onClick={() => setState(s => ({...s, layoutMode: 'background'}))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${state.layoutMode === 'background' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
              >
                <Monitor size={12} /> <span className="hidden md:inline">Global Backdrop</span>
              </button>
            </div>

            <div className="w-[1px] h-8 bg-white/10 hidden md:block" />

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isEditMode ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
              >
                {isEditMode ? <Check size={14} /> : <Edit3 size={14} />}
                <span className="hidden sm:inline">{isEditMode ? 'Done' : 'Edit Text'}</span>
              </button>
              
              <button 
                onClick={() => setShowExportModal(true)} 
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Terminal size={14} /> <span className="hidden sm:inline">Get Code</span>
              </button>

              <button onClick={() => setState({ ...state, url: null })} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </nav>

        {/* The Core Engine */}
        <div className="w-full">
          <VideoScroller 
            videoUrl={state.url!} 
            sections={state.sections} 
            isEditMode={isEditMode}
            layoutMode={state.layoutMode}
            scrollDepth={state.scrollDepth}
            sensitivity={state.sensitivity}
            onUpdateSection={(idx, updated) => {
              const next = [...state.sections];
              next[idx] = updated;
              setState(prev => ({ ...prev, sections: next }));
            }}
          />
        </div>

        {/* Code Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-6 animate-in fade-in duration-300 backdrop-blur-3xl overflow-y-auto">
            <div className="bg-[#050507] border border-white/5 rounded-[3rem] w-full max-w-6xl my-auto flex flex-col overflow-hidden shadow-2xl relative">
              <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-5">
                  <Layout size={24} className="text-indigo-500" />
                  <div className="flex flex-col">
                    <h3 className="text-xl font-black tracking-tight uppercase text-white leading-none">Export Configuration</h3>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mt-2">Active Mode: {state.layoutMode.toUpperCase()}</span>
                  </div>
                </div>
                <button onClick={() => setShowExportModal(false)} className="p-4 hover:bg-white/10 rounded-full text-white/40"><X size={24}/></button>
              </div>
              <div className="p-10 md:p-14 overflow-y-auto font-mono text-[12px] md:text-[14px] text-white/40 bg-[#020203] leading-relaxed scrollbar-none border-b border-white/5 min-h-[400px]">
                <pre className="whitespace-pre-wrap">{generateSnippetCode(state.sections, state.url!, state.sensitivity, state.scrollDepth, state.startOffset, state.endOffset, state.viewportAnchor, state.widthMode, state.maxWidth, state.layoutMode)}</pre>
              </div>
              <div className="p-10 flex flex-col md:flex-row gap-8 justify-between items-center bg-black/40">
                <div className="flex items-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-widest">
                  <Smartphone className="w-6 h-6" />
                  <span>Production-ready adaptive logic included.</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generateSnippetCode(state.sections, state.url!, state.sensitivity, state.scrollDepth, state.startOffset, state.endOffset, state.viewportAnchor, state.widthMode, state.maxWidth, state.layoutMode));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`w-full md:w-auto px-16 py-6 rounded-3xl font-black uppercase text-[14px] tracking-[0.2em] transition-all transform active:scale-95 ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl'}`}
                >
                  {copied ? 'Copied Successfully' : 'Copy Final Snippet'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center p-6 pt-12 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 rounded-full blur-[200px]" />
      </div>

      <header className="w-full max-w-7xl flex items-center justify-between z-50 mb-20 md:mb-32">
        <div className="flex items-center gap-6">
          <InfinityLogo size={48} className="text-indigo-500" />
          <div className="flex flex-col">
            <span className="text-[20px] md:text-[24px] font-black tracking-[0.4em] uppercase text-white leading-tight">AEON</span>
            <span className="text-[10px] md:text-[12px] font-bold tracking-[0.2em] text-white/40 uppercase">INFINITY ENGINE</span>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        <div className="text-center mb-24 md:mb-32 space-y-12">
          <h1 className="text-6xl md:text-[10rem] font-black tracking-[-0.05em] leading-[0.85] text-white">
            NARRATIVE<br />
            <span className="bg-gradient-to-br from-blue-400 via-violet-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_0_120px_rgba(139,92,246,0.5)] animate-pulse-slow">STRUCTURE.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/30 text-sm md:text-lg font-medium leading-relaxed tracking-wider px-6">
            Architect premium scroll-synchronized video experiences for your brand. 
            Import your cinematic source to begin.
          </p>
        </div>
        
        <div className="w-full">
          <FileUpload 
            onFileSelect={(file) => handleVideoInit(URL.createObjectURL(file), file.name)} 
            onSampleSelect={(url, name, id) => handleVideoInit(url, name, id)} 
            isAnalyzing={state.isAnalyzing} 
          />
        </div>

        <footer className="mt-32 mb-20 flex flex-col items-center gap-8 text-white/10">
           <span className="text-[10px] font-black uppercase tracking-[0.8em]">Scroll to Discover</span>
           <ChevronDown size={20} className="animate-bounce" />
        </footer>
      </main>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { filter: drop-shadow(0 0 100px rgba(139,92,246,0.3)); }
          50% { filter: drop-shadow(0 0 140px rgba(139,92,246,0.6)); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;