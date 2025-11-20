import React, { useState, useRef } from 'react';
import { generateVeoVideo } from '../services/geminiService';
import { Loader2, Video, Image as ImageIcon, Upload } from 'lucide-react';

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
        <div className="space-y-6">
          
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