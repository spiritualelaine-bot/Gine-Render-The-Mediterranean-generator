import React, { useState, useRef } from 'react';
import { generateVeoVideo } from '../services/geminiService';
import { Loader2, Video, Image as ImageIcon, Upload, Move, Wind, Palette, Settings, Fingerprint, Lock } from 'lucide-react';

export const VideoGenerator: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt && mode === 'text') return;
    if (!image && mode === 'image') return;
    
    setLoading(true);
    setVideoUrl(null);
    
    try {
      const url = await generateVeoVideo(prompt, mode === 'image' ? image : null, aspectRatio);
      setVideoUrl(url);
    } catch (error) {
      console.error(error);
      alert("Failed to generate video. Ensure you have selected a paid project API key.");
    } finally {
      setLoading(false);
    }
  };

  const appendToPrompt = (text: string) => {
    setPrompt(prev => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return text;
      if (!/[.,;]$/.test(cleanPrev)) {
        return `${cleanPrev}, ${text}`;
      }
      return `${cleanPrev} ${text}`;
    });
  };

  const isScribeLocked = prompt.includes("MediterraneanScribe_Consistency_V1");

  const applyScribePreset = () => {
    const seed = "--character-consistency-seed MediterraneanScribe_Consistency_V1";
    const description = "Base character: mid-40s Middle Eastern Jewish scribe, weathered olive skin, thick curly dark-brown beard with natural gray streaks, deep-set intense brown eyes, subtle forehead creases, strong but kind facial structure, short curly hair partially covered by a coarse beige woven head cloth. Wearing off-white rough woolen robe with visible weave texture and slight fraying at cuffs. Ink-stained fingers (index and middle finger of left hand have permanent black marks). Exact likeness must be preserved.";
    
    setPrompt(prev => {
       if (prev.includes(seed)) return prev;
       return `${seed}\n${description}\n\n${prev}`;
    });
  };

  const cameraMovements = [
    { label: 'Static Shot', text: 'static shot, tripod stability' },
    { label: 'Pan Left', text: 'slow cinematic pan to the left' },
    { label: 'Pan Right', text: 'slow cinematic pan to the right' },
    { label: 'Tilt Up', text: 'gentle tilt up revealing the scene' },
    { label: 'Tilt Down', text: 'gentle tilt down from sky to subject' },
    { label: 'Dolly In', text: 'slow dolly in towards the subject' },
    { label: 'Dolly Out', text: 'slow dolly out revealing context' },
    { label: 'Crane Shot', text: 'sweeping crane shot establishing the environment' }
  ];

  const subtleAnimations = [
    { label: 'Slight Breathing', text: 'subtle rhythmic breathing movement' },
    { label: 'Gentle Cloth Movement', text: 'fabric swaying gently in light breeze' },
    { label: 'Candle Flicker', text: 'candle flame flickering softly' },
    { label: 'Subtle Eye Blink', text: 'natural subtle eye blinking' }
  ];

  const styleReferences = [
    { label: 'The Chosen Look', text: 'hyper-realistic cinematography in the exact visual tone of The Chosen' },
    { label: 'Apostle Aesthetic', text: 'style of Paul Apostle of Christ, muted earth tones, rich detail, zero stylization or fantasy glow' },
    { label: 'Biblical Epic', text: 'classic biblical epic style, grand scale, naturalistic lighting' },
    { label: 'Historical Doc', text: 'high-fidelity historical documentary style, raw and unpolished' }
  ];

  const technicalSpecs = [
    { label: 'Seamless Loop', text: '8-12 second seamless loop' },
    { label: 'Cinematic 4K', text: '4k, 24 fps, cinematic aspect ratio 2.39:1' },
    { label: 'Slow Motion', text: 'slow motion 60fps playback' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-amber-50 mb-2">Veo Animation Studio</h2>
        <p className="text-stone-400">Generate cinematic clips or animate existing storyboards using Veo 3.1.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-1 overflow-hidden flex mb-6 w-fit">
        <button 
          onClick={() => setMode('text')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'text' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300'}`}
        >
          Text to Video
        </button>
        <button 
          onClick={() => setMode('image')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'image' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300'}`}
        >
          Image to Video
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 h-[600px] overflow-y-auto custom-scrollbar pr-2">
          
          {mode === 'image' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden
                ${preview ? 'border-amber-600/50 bg-black' : 'border-stone-700 hover:border-stone-500 bg-stone-900'}`}
            >
              {preview ? (
                 <img src={preview} alt="Source" className="w-full h-full object-contain" />
              ) : (
                <div className="text-stone-500 flex flex-col items-center gap-2">
                  <Upload size={24} />
                  <span className="text-sm">Upload Storyboard to Animate</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          )}

          {/* Character Consistency Section */}
          <div className={`border rounded-lg p-4 transition-all duration-500 ${isScribeLocked ? 'bg-amber-950/40 border-amber-600/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-amber-950/20 border-amber-900/30'}`}>
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-wider text-xs">
                  <Fingerprint size={14} />
                  <span>MediterraneanScribe_Consistency_V1</span>
                </div>
                {isScribeLocked && (
                  <div className="flex items-center gap-1 text-[10px] bg-amber-600 text-stone-950 px-2 py-0.5 rounded font-bold animate-pulse">
                    <Lock size={10} />
                    LOCKED
                  </div>
                )}
             </div>
             <p className="text-xs text-stone-400 mb-4 leading-relaxed">
               When enabled, every generated video will feature the identical scribe from the original reference.
             </p>
             <button 
                onClick={applyScribePreset}
                disabled={isScribeLocked}
                className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2
                  ${isScribeLocked 
                    ? 'bg-amber-600/20 text-amber-500 border border-amber-600/50 cursor-default' 
                    : 'bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 text-amber-200'}`}
             >
               <Fingerprint size={16} />
               {isScribeLocked ? 'Same Scribe (Locked)' : 'Lock Scribe Consistency'}
             </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-300">
              {mode === 'image' ? 'Animation Prompt (Optional)' : 'Scene Description'}
            </label>
            <textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'image' ? "Describe the movement (e.g., camera pans right, candle flickers)..." : "A cinematic drone shot of ancient Jerusalem at sunset..."}
              className="w-full h-32 bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 focus:ring-2 focus:ring-amber-600 resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-800">
               <div className="flex items-center gap-2 mb-3 text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <Palette size={14} />
                  <span>Style Reference</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {styleReferences.map((item) => (
                     <button
                        key={item.label}
                        onClick={() => appendToPrompt(item.text)}
                        className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                     >
                        {item.label}
                     </button>
                  ))}
               </div>
            </div>

            <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-800">
               <div className="flex items-center gap-2 mb-3 text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <Settings size={14} />
                  <span>Technical Specs & Format</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {technicalSpecs.map((item) => (
                     <button
                        key={item.label}
                        onClick={() => appendToPrompt(item.text)}
                        className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                     >
                        {item.label}
                     </button>
                  ))}
               </div>
            </div>

            <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-800">
               <div className="flex items-center gap-2 mb-3 text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <Move size={14} />
                  <span>Camera Movement</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {cameraMovements.map((item) => (
                     <button
                        key={item.label}
                        onClick={() => appendToPrompt(item.text)}
                        className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                     >
                        {item.label}
                     </button>
                  ))}
               </div>
            </div>

            <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-800">
               <div className="flex items-center gap-2 mb-3 text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <Wind size={14} />
                  <span>Subtle Animation</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {subtleAnimations.map((item) => (
                     <button
                        key={item.label}
                        onClick={() => appendToPrompt(item.text)}
                        className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                     >
                        {item.label}
                     </button>
                  ))}
               </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-300">Aspect Ratio</label>
            <div className="flex gap-3">
              <button 
                onClick={() => setAspectRatio("16:9")}
                className={`flex-1 py-2 border rounded-lg text-sm ${aspectRatio === "16:9" ? 'bg-amber-600 border-amber-500 text-white' : 'border-stone-700 text-stone-400'}`}
              >
                Landscape (16:9)
              </button>
              <button 
                onClick={() => setAspectRatio("9:16")}
                className={`flex-1 py-2 border rounded-lg text-sm ${aspectRatio === "9:16" ? 'bg-amber-600 border-amber-500 text-white' : 'border-stone-700 text-stone-400'}`}
              >
                Portrait (9:16)
              </button>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || (mode === 'text' && !prompt) || (mode === 'image' && !image)}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-800 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Video />}
            Generate Cinematic Video
          </button>
           <p className="text-xs text-stone-500 text-center">
            Note: Video generation may take several minutes.
          </p>
        </div>

        <div className="bg-stone-900 rounded-xl border border-stone-800 min-h-[400px] flex items-center justify-center">
          {videoUrl ? (
            <video src={videoUrl} controls autoPlay loop className="w-full h-full rounded-xl" />
          ) : (
            <div className="text-stone-600 flex flex-col items-center gap-4 p-8 text-center">
               {loading ? (
                 <>
                   <Loader2 className="animate-spin w-10 h-10 text-amber-500" />
                   <div>
                     <p className="font-medium text-stone-300">Rendering Video...</p>
                     <p className="text-sm mt-1">This involves complex temporal processing by Veo.</p>
                   </div>
                 </>
               ) : (
                 <>
                    <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center">
                      <Video className="w-8 h-8" />
                    </div>
                    <p>Generated video will play here</p>
                 </>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};