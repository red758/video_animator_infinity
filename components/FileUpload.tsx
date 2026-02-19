import React, { useState } from 'react';
import { Play, Rocket, Mountain, Building, Sparkles, Film, EyeOff, Eye, Search } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: (url: string, name: string, id: string) => void;
  isAnalyzing: boolean;
}

const SAMPLES = [
  { 
    id: '1', 
    name: 'THE DREAM', 
    url: 'https://res.cloudinary.com/dd7o282ls/video/upload/deep_space_hgzrwn.mp4', 
    icon: <Rocket size={32}/>,
    tag: 'SURREAL'
  },
  { 
    id: '2', 
    name: 'BIG BUCK', 
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
    icon: <Mountain size={32}/>,
    tag: 'NATURE'
  },
  { 
    id: '3', 
    name: 'ESCAPES', 
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
    icon: <Building size={32}/>,
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
      <div className="flex flex-col items-center justify-center py-40 gap-12 bg-white/[0.02] border border-white/5 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
        <div className="relative">
          <div className="w-40 h-40 border-4 border-indigo-500/5 rounded-full animate-spin border-t-indigo-500 shadow-[0_0_80px_rgba(79,70,229,0.2)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-indigo-500 animate-pulse w-12 h-12" />
          </div>
        </div>
        <div className="text-center space-y-3">
          <p className="text-base font-black uppercase tracking-[0.6em] text-indigo-100">Generating Sequence</p>
          <p className="text-[12px] font-bold text-indigo-500/40 uppercase tracking-widest">Architecting narrative nodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-16 backdrop-blur-3xl relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
      {/* Header Inside Card */}
      <div className="flex justify-end mb-14">
        <button 
           type="button"
           onClick={() => setShowSamples(!showSamples)}
           className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/10 transition-all text-white/40 hover:text-white"
        >
          {showSamples ? <EyeOff size={16} /> : <Search size={16} />}
          {showSamples ? "Hide Samples" : "Show Samples"}
        </button>
      </div>

      <div className="space-y-20">
        {/* Samples Section and Divider */}
        {showSamples && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
              {SAMPLES.map(sample => (
                <button 
                  key={sample.id}
                  onClick={() => onSampleSelect(sample.url, sample.name, sample.id)}
                  className="group relative flex flex-col items-center gap-8 p-12 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all text-center overflow-hidden"
                >
                  <div className="w-24 h-24 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl flex items-center justify-center text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)] group-hover:text-indigo-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-500">
                    {sample.icon}
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400/60 uppercase">{sample.tag}</span>
                    <h3 className="text-xl font-black tracking-tight text-white uppercase">{sample.name}</h3>
                  </div>
                  <div className="absolute top-4 right-4 p-2 bg-indigo-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} className="text-indigo-400 fill-indigo-400" />
                  </div>
                </button>
              ))}
            </div>

            {/* Divider only shows if samples show */}
            <div className="relative flex items-center justify-center py-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <span className="relative px-10 bg-[#0a0a0c] text-[10px] font-black uppercase tracking-[0.6em] text-white/20">OR IMPORT SOURCE</span>
            </div>
          </>
        )}

        {/* Upload Zone */}
        <div className="relative w-full group max-w-4xl mx-auto">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            accept="video/*" 
            onChange={handleFile} 
          />
          <div className="border border-dashed border-white/10 p-20 md:p-32 rounded-[3rem] md:rounded-[5rem] bg-black/20 group-hover:bg-indigo-500/5 group-hover:border-indigo-500/20 transition-all flex flex-col items-center gap-10 text-center pointer-events-none">
            <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-500/80 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:text-blue-400 group-hover:drop-shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-all duration-700">
              <Film size={36} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">Select Asset</h2>
              <p className="text-white/20 text-[11px] md:text-[13px] font-bold uppercase tracking-[0.5em]">Import MP4, WEBM, OR MOV</p>
            </div>
            <div className="px-10 py-3 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              100MB Limit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
