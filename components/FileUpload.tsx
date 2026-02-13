
import React from 'react';
import { Upload, Mountain, Rocket, Building2, ChevronRight } from 'lucide-react';
import InfinityLogo from './Logo';

const SAMPLES = [
  { 
    id: 'cosmos', 
    name: 'VOID', 
    url: 'deep_space.mp4',
    icon: <Rocket size={48} />,
    color: 'from-indigo-900/60',
    description: 'Deep Space Cinematic Narrative'
  },
  { 
    id: 'summit', 
    name: 'Particle', 
    url: 'particle_video.mp4',
    icon: <Mountain size={48} />,
    color: 'from-emerald-900/60',
    description: 'High Alpine Vista Experience'
  },
  { 
    id: 'neon', 
    name: 'bubble', 
    url: 'bubble.mp4',
    icon: <Building2 size={48} />,
    color: 'from-rose-900/60',
    description: 'Urban Kinetic Energy Loop'
  }
];

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: (url: string, name: string) => void;
  isAnalyzing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onSampleSelect, isAnalyzing }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) onFileSelect(file);
  };

  return (
    <div className="max-w-7xl w-full mx-auto space-y-32 relative z-20 px-4">
      <div className="relative group p-1 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
        <div className="p-10 md:p-16 flex flex-col items-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-white/90">Mount Ingest</h2>
          </div>

          <label className={`w-full group relative cursor-pointer block p-12 md:p-20 border border-white/10 rounded-[3.5rem] transition-all duration-700 overflow-hidden text-center ${
            isAnalyzing ? 'bg-indigo-600/5' : 'bg-white/[0.01] hover:bg-white/[0.03]'
          }`}>
            <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" disabled={isAnalyzing} />
            
            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-[1.5rem] bg-black border border-white/10 flex items-center justify-center text-white/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-700 relative z-10 shadow-2xl">
                  <Upload size={32} />
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-black tracking-widest uppercase italic text-white/80">Select Local Asset</p>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">Hardware Link // Local File</p>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-black text-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-500 uppercase tracking-[0.3em] italic">
                Initialize Synthesis <ChevronRight size={14} />
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/40 animate-[scan_5s_infinite_linear]" />
            </div>
          </label>
        </div>
      </div>

      {isAnalyzing && (
        <div className="flex flex-col items-center gap-10">
           <InfinityLogo size={80} className="text-indigo-500 animate-pulse" />
           <div className="text-center space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[1em] text-indigo-500/60 italic">Mapping Temporal Geometry</p>
              <div className="w-64 h-[2px] bg-white/5 relative overflow-hidden mx-auto rounded-full">
                 <div className="absolute inset-0 bg-indigo-600 animate-[loading-bar_1.5s_infinite_linear]" />
              </div>
           </div>
        </div>
      )}

      {!isAnalyzing && (
        <div className="pt-24 border-t border-white/5">
           <p className="text-[12px] font-black text-white/20 uppercase tracking-[1.2em] text-center mb-20 italic">Verified Studio Data</p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSampleSelect(sample.url, sample.name)}
                  className="group relative h-80 rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/40 flex flex-col justify-center items-center px-10 transition-all duration-500 hover:scale-[1.05] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                >
                  {/* High contrast gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${sample.color} via-black/40 to-black opacity-30 group-hover:opacity-100 transition-opacity duration-700`} />
                  
                  <div className="relative z-10 flex flex-col items-center text-center gap-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-black/60 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white/20 group-hover:text-white group-hover:border-white/30 transition-all duration-700 shadow-2xl">
                      {sample.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black uppercase tracking-[0.3em] italic group-hover:text-white transition-colors mb-4">{sample.name}</h3>
                      <p className="text-[11px] text-white/20 uppercase tracking-[0.15em] font-bold group-hover:text-indigo-300 transition-colors max-w-[200px] leading-relaxed">
                        {sample.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative hardware corners */}
                  <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-white/5 group-hover:border-indigo-500/50 transition-colors" />
                  <div className="absolute bottom-10 right-10 w-4 h-4 border-b-2 border-r-2 border-white/5 group-hover:border-indigo-500/50 transition-colors" />
                </button>
              ))}
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(600px); }
        }
      `}} />
    </div>
  );
};

export default FileUpload;
