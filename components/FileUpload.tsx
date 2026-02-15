
import React from 'react';
import { Upload, Play, Rocket, Mountain, Building, Sparkles, Film } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: (url: string, name: string) => void;
  isAnalyzing: boolean;
}

const SAMPLES = [
  { 
    id: '1', 
    name: 'DEEP SPACE', 
    url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-deep-space-1156-large.mp4', 
    icon: <Rocket size={24}/>,
    tag: 'SCI-FI'
  },
  { 
    id: '2', 
    name: 'MOUNTAIN', 
    url: 'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-down-a-mountain-41545-large.mp4', 
    icon: <Mountain size={24}/>,
    tag: 'NATURE'
  },
  { 
    id: '3', 
    name: 'CITY NIGHT', 
    url: 'https://assets.mixkit.co/videos/preview/mixkit-night-city-street-lights-and-traffic-1161-large.mp4', 
    icon: <Building size={24}/>,
    tag: 'URBAN'
  },
];

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onSampleSelect, isAnalyzing }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-10">
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
    <div className="space-y-12 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLES.map(sample => (
          <button 
            key={sample.id}
            onClick={() => onSampleSelect(sample.url, sample.name)}
            className="group relative bg-zinc-900 border border-white/10 p-8 rounded-3xl hover:border-indigo-500/50 transition-all text-left overflow-hidden"
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
            <div className="absolute bottom-6 right-6 p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={16} className="text-white fill-white" />
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-6 opacity-30">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-black tracking-[0.4em] uppercase">OR UPLOAD OWN</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <label className="block w-full cursor-pointer group">
        <input type="file" className="hidden" accept="video/*" onChange={handleFile} />
        <div className="bg-zinc-950 border-2 border-dashed border-white/10 p-12 rounded-[2.5rem] group-hover:bg-zinc-900 group-hover:border-indigo-500/50 transition-all flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
            <Film size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black uppercase tracking-tight text-white">Select Video Asset</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">MP4, WEBM, or MOV up to 100MB</p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default FileUpload;
