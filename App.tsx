
import React, { useState, useEffect } from 'react';
import { Code, Zap, X, Edit3, Trash2, Check, ChevronDown, Layers, Terminal } from 'lucide-react';
import FileUpload from './components/FileUpload';
import VideoScroller from './components/VideoScroller';
import InfinityLogo from './components/Logo';
import { generateVideoStory } from './services/geminiService';
import { generateSnippetCode } from './services/exportService';
import { VideoState, ScrollSection } from './types';

// Pre-defined narratives for samples so they work without an API key
const SAMPLE_DATA: Record<string, ScrollSection[]> = {
  '1': [
    { title: "THE DREAM", description: "A voyage through the mechanical subconscious.", triggerTime: 0.15, alignment: 'center', vibe: 'cinematic' },
    { title: "SYNCHRONY", description: "Parts moving in a beautiful, unintended dance.", triggerTime: 0.35, alignment: 'left', vibe: 'cinematic' },
    { title: "NIGHTFALL", description: "Shadows defining the edges of the digital void.", triggerTime: 0.55, alignment: 'right', vibe: 'cinematic' },
    { title: "SYSTEMS", description: "Every gear turning with absolute purpose.", triggerTime: 0.75, alignment: 'center', vibe: 'cinematic' },
    { title: "INFINITY", description: "The loop continues beyond the frame.", triggerTime: 0.90, alignment: 'center', vibe: 'cinematic' }
  ],
  '2': [
    { title: "NATURES PACE", description: "Finding silence in the heart of the forest.", triggerTime: 0.15, alignment: 'left', vibe: 'minimal' },
    { title: "WILDERNESS", description: "Vast landscapes reclaimed by time itself.", triggerTime: 0.35, alignment: 'center', vibe: 'minimal' },
    { title: "RHYTHM", description: "The organic pulse of a world reborn.", triggerTime: 0.55, alignment: 'right', vibe: 'minimal' },
    { title: "LIGHTBEAMS", description: "Clarity cutting through the ancient leaves.", triggerTime: 0.75, alignment: 'left', vibe: 'minimal' },
    { title: "LEGACY", description: "What remains after the noise fades away.", triggerTime: 0.90, alignment: 'center', vibe: 'minimal' }
  ],
  '3': [
    { title: "CINEMATIC", description: "Every frame captured for maximum impact.", triggerTime: 0.15, alignment: 'center', vibe: 'energetic' },
    { title: "THE ESCAPE", description: "Breaking free from the static of the grid.", triggerTime: 0.35, alignment: 'right', vibe: 'energetic' },
    { title: "VELOCITY", description: "Momentum moving at the speed of thought.", triggerTime: 0.55, alignment: 'left', vibe: 'energetic' },
    { title: "DYNAMICS", description: "The intersection of art and digital power.", triggerTime: 0.75, alignment: 'center', vibe: 'energetic' },
    { title: "FUTURE", description: "Architecting what comes next.", triggerTime: 0.90, alignment: 'center', vibe: 'energetic' }
  ]
};

const App: React.FC = () => {
  const [state, setState] = useState<VideoState>({
    url: null,
    duration: 0,
    sections: [],
    isAnalyzing: false,
    brandName: "INFINITY",
    sensitivity: 0.15
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = (showExportModal || state.isAnalyzing) ? 'hidden' : 'unset';
  }, [showExportModal, state.isAnalyzing]);

  const handleVideoInit = async (url: string, sourceName: string, sampleId?: string) => {
    const localData = sampleId ? SAMPLE_DATA[sampleId] : null;

    if (localData) {
      setState(prev => ({ 
        ...prev, 
        url, 
        sections: localData, 
        isAnalyzing: false 
      }));
      return;
    }

    setState(prev => ({ ...prev, url, isAnalyzing: true }));
    setError(null);
    try {
      const storySections = await generateVideoStory(`Source: ${sourceName}`, state.brandName);
      setState(prev => ({ ...prev, sections: storySections, isAnalyzing: false }));
    } catch (err: any) {
      const fallbackSections: ScrollSection[] = [
        { title: "RAW INPUT", description: "Direct link established. Manual override active.", triggerTime: 0.20, alignment: 'center', vibe: 'cinematic' },
        { title: "DATA STREAM", description: "Architect your narrative using the editor.", triggerTime: 0.80, alignment: 'center', vibe: 'cinematic' }
      ];
      setState(prev => ({ ...prev, sections: fallbackSections, isAnalyzing: false }));
      setError(`Gemini Key Missing: Local Fallback Active`);
    }
  };

  const handleReset = () => {
    setState({ ...state, url: null, sections: [] });
    setIsEditMode(false);
  };

  if (state.url && !state.isAnalyzing) {
    return (
      <div className="bg-[#050505] text-white min-h-screen selection:bg-indigo-500/50">
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-[100] px-8 py-4 flex justify-between items-center bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-5">
            <InfinityLogo size={32} className="text-indigo-700" />
            <div className="flex flex-col">
              <span className="text-[14px] font-black tracking-widest text-white">AEON_SCROLL</span>
              <span className="text-[9px] font-bold text-indigo-600/80 uppercase tracking-tighter">Sync Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isEditMode ? 'bg-indigo-700 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              {isEditMode ? <Check size={14} /> : <Edit3 size={14} />}
              <span>{isEditMode ? 'Lock Design' : 'Edit Script'}</span>
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-transform active:scale-95"
            >
              <Terminal size={14} /> Deploy
            </button>
            <button onClick={handleReset} className="ml-2 p-2 text-white/40 hover:text-red-500 transition-colors">
              <Trash2 size={20} />
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
          <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300 backdrop-blur-xl">
            <div className="bg-zinc-900 border border-white/20 rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
              <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                    <Code size={16} />
                  </div>
                  <h3 className="text-sm font-black tracking-widest uppercase">Engine Snippet</h3>
                </div>
                <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><X size={20}/></button>
              </div>
              <div className="flex-1 p-8 overflow-y-auto font-mono text-[12px] text-indigo-300/80 bg-black/50 leading-relaxed">
                <pre className="whitespace-pre-wrap">{generateSnippetCode(state.sections, state.url, state.sensitivity)}</pre>
              </div>
              <div className="px-8 py-6 border-t border-white/10 flex justify-end bg-zinc-900">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generateSnippetCode(state.sections, state.url!, state.sensitivity));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`px-10 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                >
                  {copied ? 'Code Copied' : 'Copy Protocol'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <header className="fixed top-12 left-12 z-50 flex items-center gap-8 animate-in fade-in slide-in-from-left-10 duration-1000">
        <InfinityLogo size={48} className="text-indigo-700 drop-shadow-[0_0_15px_rgba(67,56,202,0.15)]" />
        <div className="w-[1px] h-12 bg-white/10" />
        <div className="flex flex-col">
          <span className="text-[16px] font-black tracking-[1em] uppercase text-white leading-none">Aeon</span>
          <span className="text-[9px] font-black tracking-[0.5em] text-white/30 uppercase mt-2">Infinity Engine</span>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <div className="text-center mb-16 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">Cinematic Scroll Pro</span>
          </div>
          
          <h1 className="text-6xl md:text-[9.5rem] font-black tracking-tighter leading-[0.8] text-white">
            NARRATIVE<br />
            <span className="text-indigo-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">STRUCTURE.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-white/50 text-xs md:text-sm font-medium leading-relaxed tracking-wide px-4">
            Transform high-definition video into an immersive, scroll-synchronized 
            experience. Upload your asset and let our engine architect the narrative flow.
          </p>
        </div>

        <div className="w-full bg-zinc-900/40 border border-white/10 p-8 md:p-12 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <FileUpload 
            onFileSelect={(file) => handleVideoInit(URL.createObjectURL(file), file.name)} 
            onSampleSelect={(url, name, id) => handleVideoInit(url, name, id)}
            isAnalyzing={state.isAnalyzing} 
          />
        </div>

        <div className="mt-12 text-center opacity-30">
          <p className="text-[9px] font-bold uppercase tracking-[0.8em]">Scroll to Explore Possibilities</p>
          <ChevronDown size={20} className="mx-auto mt-4 animate-bounce" />
        </div>

        {error && (
          <div className="fixed bottom-8 px-6 py-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 backdrop-blur-2xl">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            {error}
            <button onClick={() => setError(null)} className="hover:text-white transition-colors"><X size={14}/></button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
