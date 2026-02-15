
import React from 'react';
import { Upload, Play, Rocket, Mountain, Building, Sparkles } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: (url: string, name: string) => void;
  isAnalyzing: boolean;
}

const SAMPLES = [
  { 
    id: '1', 
    name: 'Cosmos', 
    url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-deep-space-1156-large.mp4', 
    icon: <Rocket size={18}/>,
    desc: 'Deep Space'
  },
  { 
    id: '2', 
    name: 'Alpine', 
    url: 'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-down-a-mountain-41545-large.mp4', 
    icon: <Mountain size={18}/>,
    desc: 'Mountain Flow'
  },
  { 
    id: '3', 
    name: 'Urban', 
    url: 'https://assets.mixkit.co/videos/preview/mixkit-night-city-street-lights-and-traffic-1161-large.mp4', 
    icon: <Building size={18}/>,
    desc: 'City Pulse'
  },
];

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onSampleSelect, isAnalyzing }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-16 h-16 border border-indigo-500/10 rounded-full animate-ping absolute inset-0" />
          <div className="w-16 h-16 border border-white/5 rounded-2xl flex items-center justify-center text-indigo-500 bg-black/40 backdrop-blur-3xl shadow-2xl">
            <Sparkles size={24} className="animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-3">
          <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white">Synthesizing Narrative</p>
          <div className="flex items-center justify-center gap-1.5 opacity-20">
             <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
             <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
             <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLES.map(sample => (
          <button 
            key={sample.id}
            onClick={() => onSampleSelect(sample.url, sample.name)}
            className="group relative bg-white/[0.01] border border-white/5 p-5 rounded-[1.2rem] hover:bg-white/[0.03] hover:border-white/10 transition-all text-left overflow-hidden"
          >
            <div className="relative z-10 flex flex-col gap-4">
              <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-white/10 group-hover:text-white transition-colors">
                {sample.icon}
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest">{sample.name}</h3>
                <p className="text-[6px] font-bold uppercase tracking-widest text-white/10">{sample.desc}</p>
              </div>
            </div>
            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={12} className="fill-current" />
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 py-2 opacity-5">
        <div className="h-px flex-1 bg-white" />
        <span className="text-[6px] font-black tracking-[0.4em]">CUSTOM ASSET</span>
        <div className="h-px flex-1 bg-white" />
      </div>

      <label className="block w-full cursor-pointer group">
        <input type="file" className="hidden" accept="video/*" onChange={handleFile} />
        <div className="bg-white/[0.01] border border-white/5 border-dashed p-8 rounded-[1.5rem] group-hover:bg-white/[0.02] group-hover:border-white/10 transition-all flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 bg-white/5 text-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload size={18} />
          </div>
          <div>
            <h2 className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40">Import local video</h2>
            <p className="text-white/5 text-[6px] font-black tracking-widest mt-1">MP4 / WEBM / MOV</p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default FileUpload;
