
import React, { useState, useEffect } from 'react';
import { Code, Layers, ArrowUpRight, Share2, Zap, Globe, ShieldCheck } from 'lucide-react';
import FileUpload from './components/FileUpload';
import VideoScroller from './components/VideoScroller';
import InfinityLogo from './components/Logo';
import { generateVideoStory } from './services/geminiService';
import { generateStandaloneHTML } from './services/exportService';
import { VideoState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<VideoState>({
    url: null,
    duration: 0,
    sections: [],
    isAnalyzing: false,
  });

  useEffect(() => {
    console.log("AEON Engine Initialized. Mode: Narrative Scroll.");
  }, []);

  const analyzeVideo = async (url: string, title: string, metadata: string) => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const description = `A cinematic video titled "${title}". ${metadata}.`;
      const storySections = await generateVideoStory(description);
      setState({ url, duration: 0, sections: storySections, isAnalyzing: false });
    } catch (error) {
      console.error("Analysis Failure:", error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    analyzeVideo(url, file.name, `Local asset: ${file.type}`);
  };

  const handleSampleSelect = (url: string, name: string) => {
    analyzeVideo(url, name, `Sample studio asset.`);
  };

  const handleReset = () => {
    setState({ url: null, duration: 0, sections: [], isAnalyzing: false });
  };

  const handleDownloadCode = () => {
    if (!state.sections.length) return;
    const htmlContent = generateStandaloneHTML(state.sections);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aeon-narrative.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-indigo-600 antialiased font-sans">
      {/* Dynamic Header */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 md:px-16 py-12 flex justify-between items-center pointer-events-none">
        <div 
          className="flex items-center gap-10 cursor-pointer group pointer-events-auto"
          onClick={handleReset}
        >
          <div className="relative">
            <InfinityLogo size={72} className="text-white relative z-10 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-5xl tracking-[0.4em] uppercase italic leading-none text-white">AEON</span>
            <span className="text-[12px] font-black text-indigo-500 tracking-[0.8em] uppercase mt-4 opacity-60">Studio Core</span>
          </div>
        </div>
        
        {state.url && (
          <button 
            onClick={handleDownloadCode}
            className="group flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full font-black text-[12px] uppercase tracking-[0.25em] hover:bg-indigo-600 hover:text-white transition-all pointer-events-auto shadow-2xl"
          >
            <Code size={18} /> Export Source
          </button>
        )}
      </nav>

      {!state.url ? (
        <main className="relative min-h-screen flex flex-col items-center px-6 pt-[25vh] pb-32 overflow-hidden bg-gradient-to-b from-black via-[#050505] to-black">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 blur-[200px] pointer-events-none" />
          
          <div className="text-center mb-32 max-w-7xl relative z-10 w-full">
            <h1 className="text-[clamp(4rem,12vw,11rem)] font-black tracking-[-0.05em] mb-16 leading-[0.9] italic uppercase text-white animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <span className="block">Narrative</span>
              <span className="block text-indigo-400">Scroll</span>
            </h1>
            <p className="text-base md:text-2xl text-white/40 font-light max-w-2xl mx-auto leading-relaxed tracking-[0.05em] uppercase italic border-l-4 border-indigo-600/40 pl-12 text-left">
              Crafting interactive, scroll-synchronized storytelling architectures from raw cinematic assets.
            </p>
          </div>

          <div className="w-full">
            <FileUpload 
              onFileSelect={handleFileSelect} 
              onSampleSelect={handleSampleSelect}
              isAnalyzing={state.isAnalyzing} 
            />
          </div>
        </main>
      ) : (
        <section className="relative">
          {/* Overlay Status HUD */}
          <div className="fixed top-48 right-12 z-[100] pointer-events-none">
             <div className="p-8 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col gap-4 min-w-[200px] pointer-events-auto">
                <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-indigo-500 uppercase italic">
                   <Layers size={14} /> Active Core
                </div>
                <button onClick={handleReset} className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-all flex items-center justify-between">
                  Detach <ArrowUpRight size={12} />
                </button>
             </div>
          </div>

          <VideoScroller videoUrl={state.url} sections={state.sections} />

          {/* Blueprint Guide */}
          <section className="bg-black py-48 px-8 border-t border-white/5 overflow-hidden">
             <div className="max-w-7xl mx-auto">
                <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
                   <div className="space-y-6">
                      <span className="text-[12px] font-black text-indigo-500 tracking-[0.8em] uppercase italic">Deployment Guide</span>
                      <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">Integration<br/><span className="text-white/20">Protocol</span></h2>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
                   {[
                     { icon: <Share2 size={32} />, title: "01. Export", desc: "Generate the standalone engine logic for external hosting." },
                     { icon: <Zap size={32} />, title: "02. Host", desc: "Link your production video URL in the exported CONFIG block." },
                     { icon: <Globe size={32} />, title: "03. Launch", desc: "Embed into any architecture with zero dependencies." }
                   ].map((step, i) => (
                     <div key={i} className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                        <div className="mb-10 w-20 h-20 bg-black border border-white/10 flex items-center justify-center text-indigo-500">{step.icon}</div>
                        <h3 className="text-2xl font-black italic uppercase tracking-widest mb-4">{step.title}</h3>
                        <p className="text-white/40 text-sm font-medium uppercase tracking-wider">{step.desc}</p>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          <footer className="relative min-h-[70vh] flex flex-col items-center justify-center bg-black overflow-hidden border-t border-white/5">
            <div className="text-center z-10 px-8">
              <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black tracking-[-0.03em] mb-12 italic uppercase">Sequence Complete.</h2>
              <p className="text-white/20 text-[12px] mb-20 max-w-md mx-auto tracking-[1em] font-black uppercase italic">
                Aeon Infinity Module Termination
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-10">
                <button onClick={handleDownloadCode} className="px-20 py-8 bg-white text-black font-black text-sm uppercase tracking-[0.25em] rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                  Download Source
                </button>
                <button onClick={handleReset} className="px-20 py-8 border-2 border-white/10 text-white/40 font-black text-sm uppercase tracking-[0.25em] rounded-full hover:bg-white/5 hover:text-white transition-all">
                  Reset System
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-16 flex justify-between w-full px-16 text-[11px] font-black tracking-[1.2em] text-white/10 uppercase italic">
              <span>AEON COLLECTIVE</span>
              <span>EST. 2025</span>
            </div>
          </footer>
        </section>
      )}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
};

export default App;
