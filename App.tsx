
import React, { useState, useEffect } from 'react';
import { Code, Layers, ArrowUpRight, Share2, Zap, Globe } from 'lucide-react';
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
    console.log("AEON Narrative Engine v2.0 - Online");
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
    <div className="min-h-screen bg-black text-white selection:bg-indigo-600 antialiased font-sans">
      {/* Dynamic Header */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 md:px-16 py-8 flex justify-between items-center pointer-events-none">
        <div 
          className="flex items-center gap-6 cursor-pointer group pointer-events-auto"
          onClick={handleReset}
        >
          <InfinityLogo size={56} className="text-white transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-black text-4xl tracking-[0.3em] uppercase italic leading-none text-white">AEON</span>
            <span className="text-[10px] font-black text-indigo-500 tracking-[0.6em] uppercase mt-2 opacity-80">Studio Core</span>
          </div>
        </div>
        
        {state.url && (
          <button 
            onClick={handleDownloadCode}
            className="group flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all pointer-events-auto shadow-2xl"
          >
            <Code size={16} /> Export Output
          </button>
        )}
      </nav>

      {!state.url ? (
        <main className="relative min-h-screen flex flex-col items-center px-6 pt-[20vh] pb-32 overflow-hidden bg-black">
          {/* Luminous Glow Backgrounds */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/20 blur-[150px] opacity-40" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-purple-600/10 blur-[150px] opacity-30" />
          </div>
          
          <div className="text-center mb-24 max-w-7xl relative z-10 w-full">
            <h1 className="text-[clamp(3.5rem,10vw,9rem)] font-black tracking-[-0.04em] mb-12 leading-[0.9] italic uppercase text-white transition-all duration-1000">
              <span className="block">Narrative</span>
              <span className="block text-indigo-500 drop-shadow-[0_0_15px_rgba(79,70,229,0.3)]">Scroll</span>
            </h1>
            <p className="text-base md:text-xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed tracking-[0.05em] uppercase italic border-l-4 border-indigo-600 pl-8 text-left">
              Crafting immersive, scroll-synchronized experiences from cinematic assets.
            </p>
          </div>

          <div className="w-full relative z-10">
            <FileUpload 
              onFileSelect={handleFileSelect} 
              onSampleSelect={handleSampleSelect}
              isAnalyzing={state.isAnalyzing} 
            />
          </div>
        </main>
      ) : (
        <section className="relative z-0">
          <VideoScroller videoUrl={state.url} sections={state.sections} />

          {/* Integration Blueprint Section */}
          <section className="bg-black py-48 px-8 border-t border-white/10 relative z-10">
             <div className="max-w-7xl mx-auto">
                <div className="mb-24 space-y-4">
                  <span className="text-[11px] font-black text-indigo-500 tracking-[0.8em] uppercase italic">Engineering Guide</span>
                  <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-white">Integration<br/><span className="text-white/10">Architecture</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     { icon: <Share2 size={28} />, title: "01. Source", desc: "Export the standalone narrative logic as a single-file architecture." },
                     { icon: <Zap size={28} />, title: "02. Inject", desc: "Swap the video source in the CONFIG block with your hosted asset." },
                     { icon: <Globe size={28} />, title: "03. Launch", desc: "Embed into any production environment with zero dependencies." }
                   ].map((step, i) => (
                     <div key={i} className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] hover:bg-white/[0.06] transition-colors group">
                        <div className="mb-8 w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-indigo-500 rounded-2xl group-hover:border-indigo-500 transition-colors">{step.icon}</div>
                        <h3 className="text-xl font-black italic uppercase tracking-widest mb-3 text-white">{step.title}</h3>
                        <p className="text-white/40 text-[13px] font-medium uppercase tracking-wider leading-relaxed">{step.desc}</p>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          <footer className="relative min-h-[60vh] flex flex-col items-center justify-center bg-black border-t border-white/10 z-10">
            <div className="text-center z-10 px-8">
              <h2 className="text-[clamp(2rem,6vw,5rem)] font-black tracking-[-0.02em] mb-10 italic uppercase text-white">Experience Concluded.</h2>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <button onClick={handleDownloadCode} className="px-16 py-6 bg-white text-black font-black text-[12px] uppercase tracking-[0.2em] rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                  Get Source Code
                </button>
                <button onClick={handleReset} className="px-16 py-6 border-2 border-white/20 text-white/60 font-black text-[12px] uppercase tracking-[0.2em] rounded-full hover:bg-white/5 hover:text-white transition-all">
                  New Narrative
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-12 flex justify-between w-full px-12 text-[10px] font-black tracking-[1em] text-white/20 uppercase italic">
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
