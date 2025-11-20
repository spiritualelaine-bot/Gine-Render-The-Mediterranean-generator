import React, { useState } from 'react';
import { generateCinematicImage } from '../services/geminiService';
import { ImageAspectRatio } from '../types';
import { Loader2, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('16:9');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateCinematicImage(prompt, aspectRatio);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const ratios: ImageAspectRatio[] = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-amber-50 mb-2">Character & World Generation</h2>
        <p className="text-stone-400">Create photorealistic ancient Judean landscapes and characters using Gemini 3 Pro.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-300">Scene Description</label>
            <textarea
              className="w-full h-40 bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none placeholder-stone-600"
              placeholder="e.g., Apostle Paul writing in a dimly lit stone room, dust motes dancing in a beam of sunlight, cinematic lighting..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-300">Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-2">
              {ratios.map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-2 py-2 text-xs rounded border transition-colors
                    ${aspectRatio === r 
                      ? 'bg-amber-600 border-amber-500 text-white' 
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-800 disabled:text-stone-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            Generate Render
          </button>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 text-red-300 rounded text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-center min-h-[500px] overflow-hidden relative">
          {generatedImage ? (
            <div className="relative w-full h-full flex items-center justify-center group">
              <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain shadow-2xl" />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={generatedImage} 
                  download={`render-${Date.now()}.png`}
                  className="p-3 bg-stone-950/80 text-white rounded-full hover:bg-amber-600 transition-colors flex"
                >
                  <Download size={20} />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-stone-600 flex flex-col items-center gap-4">
               <div className="w-20 h-20 border-2 border-dashed border-stone-700 rounded-full flex items-center justify-center">
                 <ImageIcon className="w-8 h-8" />
               </div>
               <p>Enter a prompt to begin rendering</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};