
import React, { useState } from 'react';
import { Code, Terminal, Layers, ArrowUpRight, ShieldCheck, Cpu, Globe, Share2, Zap } from 'lucide-react';
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

  const analyzeVideo = async (url: string, title: string, metadata: string) => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    const description = `A cinematic video titled "${title}". Video context: ${metadata}. Create a high-end landing page narrative.`;
    
    try {
      const storySections = await generateVideoStory(description);
      setState({
        url,
        duration: 0,
        sections: storySections,
        isAnalyzing: false,
      });
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleFileSelect = async (file: File) => {
    const url = URL.createObjectURL(file);
    await analyzeVideo(url, file.name, `Local upload, type ${file.type}`);
  };

  const handleSampleSelect = async (url: string, name: string) => {
    await analyzeVideo(url, name, `Sample stock video, professional grade cinematic visuals`);
  };

  const handleReset = () => {
    setState({
      url: null,
      duration: 0,
      sections: [],
      isAnalyzing: false,
    });
  };

  const handleDownloadCode = () => {
    if (!state.sections.length) return;
    const htmlContent = generateStandaloneHTML(state.sections);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aeon-experience.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-indigo-600 selection:text-white antialiased">
      {/* Brand Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 md:px-16 py-12 flex justify-between items-center bg-gradient-to-b from-black/95 via-black/40 to-transparent pointer-events-none">
        <div 
          className="flex items-center gap-10 cursor-pointer group pointer-events-auto"
          onClick={handleReset}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <InfinityLogo size={72} className="text-white relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-5xl tracking-[0.4em] uppercase italic leading-none text-white transition-all group-hover:text-indigo-400 group-hover:tracking-[0.45em]">AEON</span>
            <span className="text-[12px] font-black text-indigo-500 tracking-[0.8em] uppercase mt-4 opacity-60">Studio Core</span>
          </div>
        </div>
        
        {state.url && (
          <button 
            onClick={handleDownloadCode}
            className="group flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full font-black text-[12px] uppercase tracking-[0.25em] hover:bg-indigo-600 hover:text-white transition-all duration-500 active:scale-95 shadow-[0_30px_60px_rgba(0,0,0,0.5)] pointer-events-auto"
          >
            <Code size={18} />
            Export Output
          </button>
        )}
      </nav>

      {!state.url ? (
        <main className="relative min-h-screen flex flex-col items-center px-6 pt-[25vh] pb-32 overflow-hidden">
          {/* Enhanced Luminous Mesh Gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 blur-[200px] rounded-full animate-pulse pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/5 blur-[200px] rounded-full pointer-events-none" />
          
          <div className="text-center mb-32 max-w-7xl relative z-10 w-full">
            <h1 className="text-[clamp(4rem,12vw,11rem)] font-black tracking-[-0.05em] mb-16 leading-[0.9] italic uppercase text-white px-4 relative">
              <span className="block opacity-0 animate-[slide-up_0.8s_ease-out_forwards]">Narrative</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-50 to-indigo-400 opacity-0 animate-[slide-up_1s_ease-out_0.2s_forwards] py-2">Scroll</span>
            </h1>
            
            <p className="text-base md:text-2xl text-white/40 font-light max-w-2xl mx-auto leading-relaxed tracking-[0.05em] uppercase italic border-l-4 border-indigo-600/40 pl-12 text-left">
              Transforming raw cinematic assets into interactive, scroll-synchronized storytelling architectures.
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
          {/* HUD Status */}
          <div className="fixed top-48 right-12 z-[100] flex flex-col gap-6 items-end pointer-events-none">
             <div className="p-8 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col gap-5 min-w-[220px] shadow-[0_40px_80px_rgba(0,0,0,0.8)] pointer-events-auto">
                <div className="flex items-center gap-3 text-[11px] font-black tracking-[0.3em] text-indigo-500 uppercase italic">
                   <Layers size={14} className="opacity-50" />
                   Sync Engine
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div className="flex justify-between items-center text-[10px] tracking-widest font-black uppercase">
                  <span className="text-white/40">Latency</span>
                  <span className="text-emerald-500">Sub-1ms</span>
                </div>
                <div className="flex justify-between items-center text-[10px] tracking-widest font-black uppercase">
                  <span className="text-white/40">Status</span>
                  <span className="text-indigo-400">Ultra High</span>
                </div>
                <button 
                  onClick={handleReset}
                  className="mt-4 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-all flex items-center justify-between group/btn"
                >
                  Detach Core <ArrowUpRight size={12} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
             </div>
          </div>

          <VideoScroller 
            videoUrl={state.url} 
            sections={state.sections} 
          />

          {/* Implementation Blueprint Section */}
          <section className="bg-black py-48 px-8 border-t border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/5 blur-[200px] pointer-events-none" />
             <div className="max-w-7xl mx-auto">
                <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
                   <div className="space-y-6">
                      <span className="text-[12px] font-black text-indigo-500 tracking-[0.8em] uppercase italic">Engineering Guide</span>
                      <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">Integration<br/><span className="text-white/20">Blueprint</span></h2>
                   </div>
                   <p className="text-white/30 text-xl max-w-md font-light italic leading-relaxed uppercase border-l border-white/10 pl-8">
                      Follow these protocols to deploy your cinematic narrative to production servers.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 mb-24">
                   {[
                     { 
                       icon: <Share2 className="text-indigo-500" size={32} />, 
                       title: "01. Export", 
                       desc: "Generate the standalone HTML architecture. This includes the scroll-engine and narrative logic." 
                     },
                     { 
                       icon: <Zap className="text-indigo-500" size={32} />, 
                       title: "02. Optimize", 
                       desc: "Ensure your video uses an intra-frame encoding (All-Keyframes) for instantaneous scrubbing response." 
                     },
                     { 
                       icon: <Globe className="text-indigo-500" size={32} />, 
                       title: "03. Deploy", 
                       desc: "Host on a high-speed CDN and link your video URL in the CONFIG block within the exported HTML." 
                     }
                   ].map((step, i) => (
                     <div key={i} className="group p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] transition-all duration-500">
                        <div className="mb-10 w-20 h-20 bg-black rounded-[1.5rem] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                           {step.icon}
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-widest mb-4">{step.title}</h3>
                        <p className="text-white/40 text-sm font-medium leading-relaxed uppercase tracking-wider">{step.desc}</p>
                     </div>
                   ))}
                </div>

                <div className="mt-24 p-12 bg-indigo-600/10 border border-indigo-500/20 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12">
                   <div className="flex items-center gap-8">
                      <ShieldCheck size={64} className="text-indigo-500 opacity-50" />
                      <div>
                         <p className="text-xl font-black italic uppercase tracking-widest mb-2">Ready for deployment</p>
                         <p className="text-[11px] text-white/30 uppercase tracking-[0.4em]">Engine optimized for Chrome, Safari, & Edge Performance</p>
                      </div>
                   </div>
                   <button 
                     onClick={handleDownloadCode}
                     className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                   >
                     Initialize Export
                   </button>
                </div>
             </div>
          </section>

          <footer className="relative min-h-[80vh] flex flex-col items-center justify-center bg-black overflow-hidden border-t border-white/5">
            <div className="text-center z-10 px-8">
              <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black tracking-[-0.03em] mb-12 leading-none italic uppercase">Sequence Complete.</h2>
              <p className="text-white/20 text-[12px] mb-20 max-w-md mx-auto tracking-[1em] font-black uppercase italic">
                Aeon Infinity Module Termination
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-10">
                <button 
                  onClick={handleDownloadCode}
                  className="group px-24 py-8 bg-white text-black font-black text-sm uppercase tracking-[0.25em] rounded-full hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                >
                  Download Source
                </button>
                <button 
                  onClick={handleReset}
                  className="px-24 py-8 border-2 border-white/10 text-white/40 font-black text-sm uppercase tracking-[0.25em] rounded-full hover:bg-white/5 hover:text-white transition-all active:scale-95"
                >
                  New Module
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

      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default App;
