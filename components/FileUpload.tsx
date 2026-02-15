
import React, { useState } from 'react';
import { Upload, Play, Rocket, Mountain, Building, Sparkles, Film, EyeOff, Eye } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: (url: string, name: string, id: string) => void;
  isAnalyzing: boolean;
}

const SAMPLES = [
  { 
    id: '1', 
    name: 'THE DREAM', 
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
    icon: <Rocket size={24}/>,
    tag: 'SURREAL'
  },
  { 
    id: '2', 
    name: 'BIG BUCK', 
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
    icon: <Mountain size={24}/>,
    tag: 'NATURE'
  },
  { 
    id: '3', 
    name: 'ESCAPES', 
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
    icon: <Building size={24}/>,
    tag: 'CINEMATIC'
  },
];

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onSampleSelect, isAnalyzing }) => {
  const [showSamples, setShowSamples] = useState(true);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-10">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-indigo-400 animate-pulse" size={40} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.5em] text-white">Generating Sequence</p>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Architecting narrative nodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full">
      {/* Control Header */}
      <div className="flex items-center justify-end relative z-30">
         <button 
           type="button"
           onClick={(e) => {
             e.stopPropagation();
             setShowSamples(!showSamples);
           }}
           className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-white/50 hover:text-white active:scale-95 cursor-pointer"
         >
           {showSamples ? <EyeOff size={16} /> : <Eye size={16} />}
           {showSamples ? "Hide Quick Samples" : "Show Quick Samples"}
         </button>
      </div>

      {/* Samples Grid */}
      {showSamples && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {SAMPLES.map(sample => (
            <button 
              key={sample.id}
              onClick={() => onSampleSelect(sample.url, sample.name, sample.id)}
              className="group relative bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:border-indigo-500/50 hover:bg-zinc-900 transition-all text-left overflow-hidden"
            >
              <div className="relative z-10 flex flex-col gap-6">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  {sample.icon}
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">{sample.tag}</span>
                  <h3 className="text-lg font-black tracking-tight text-white mt-1 uppercase">{sample.name}</h3>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 flex items-center gap-2">
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Launch Engine</span>
                 <div className="p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                   <Play size={16} className="text-white fill-white" />
                 </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Divider */}
      {showSamples && (
        <div className="flex items-center gap-6 opacity-30 px-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase whitespace-nowrap">OR IMPORT OWN SOURCE</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      )}

      {/* Upload Zone */}
      <div className="relative w-full group">
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          accept="video/*" 
          onChange={handleFile} 
        />
        <div className="bg-zinc-950/50 border-2 border-dashed border-white/10 p-16 md:p-24 rounded-[2.5rem] group-hover:bg-zinc-900 group-hover:border-indigo-500/50 transition-all flex flex-col items-center gap-8 text-center pointer-events-none relative">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/30 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500">
            <Film size={40} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Select Video Asset</h2>
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em]">Import MP4, WEBM, or MOV from your machine</p>
          </div>
          <div className="mt-4 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            Maximum Capacity: 100MB
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
