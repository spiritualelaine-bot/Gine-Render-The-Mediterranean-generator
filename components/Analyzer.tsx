import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Loader2, FileText, ScanLine, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Analyzer: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setAnalysis('');
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const prompt = `Analyze this image to create a highly detailed structured prompt suitable for AI video or image generation (like Veo or Gemini).
      
      Start with a **High-Level Narrative**: A concise paragraph capturing the core story, mood, and visual impact.

      Then, provide a structured breakdown:

      **1. Character & Subject Details:**
      *   **Anatomy & Skin:** Analyze skin texture (pores, sweat, grime, wrinkles, scars), complexion, and age.
      *   **Expression:** Describe micro-expressions, gaze direction, and emotional nuance.
      *   **Attire:** Detail fabric weight, weave, wear-and-tear, historical accuracy, and how it hangs on the body.

      **2. Environment & Atmosphere:**
      *   **Setting:** Specific architectural or natural elements.
      *   **Atmospherics:** Explicitly describe elements like fog density, dust motes, heat haze, rain streaks, or smoke.
      *   **Ambiance:** The "feel" of the air (humid, dry, cold).

      **3. Lighting & Shadow Play:**
      *   **Light Sources:** Identify key, fill, and rim lights (e.g., "soft window light," "harsh noon sun," "flickering firelight").
      *   **Shadows:** Describe the quality of shadows (deep, crushed blacks vs. lifted shadows, hard vs. soft edges).
      *   **Contrast:** Chiaroscuro, high-key, or low-key lighting.

      **4. Cinematic Composition:**
      *   **Camera:** Focal length (e.g., 35mm, 85mm), depth of field (bokeh), and angle.
      *   **Color Grade:** Palette (e.g., "teal and orange," "desaturated sepia") and film grain.

      **5. Generative Prompt Translation (CRITICAL):**
      *   Translate the visual analysis into a comma-separated list of high-impact keywords and phrases optimized for image generation.
      *   Include specific modifiers for lighting (e.g., "volumetric lighting," "god rays"), texture (e.g., "imperfection," "gritty"), and style (e.g., "cinematic still," "hyper-realistic").
      *   Example format: "Cinematic close-up, [Subject Description], [Environment], [Lighting keywords], [Camera keywords], 8k, highly detailed."`;
      
      const result = await analyzeImage(image, prompt);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
       <div className="mb-8">
        <h2 className="text-3xl font-serif text-amber-50 mb-2">Reference Analyzer</h2>
        <p className="text-stone-400">Upload historical references or location scouts. Gemini will analyze lighting, atmosphere, and details to generate a recreation prompt.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[300px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden bg-stone-900
              ${preview ? 'border-amber-600/50' : 'border-stone-700 hover:border-stone-500'}`}
          >
             {preview ? (
               <img src={preview} alt="Analysis Target" className="w-full h-full object-contain" />
             ) : (
               <div className="text-stone-500 flex flex-col items-center gap-3">
                 <ScanLine size={40} />
                 <span>Upload Reference Image</span>
               </div>
             )}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={!image || loading}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-stone-200 font-medium rounded-lg border border-stone-700 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <FileText />}
            Generate Prompt Analysis
          </button>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl flex flex-col shadow-inner shadow-black/50 h-[600px]">
          <div className="p-3 border-b border-stone-800 flex justify-between items-center bg-stone-900/50">
             <span className="text-xs font-bold text-stone-500 uppercase">Gemini Analysis</span>
             {analysis && (
                 <button onClick={copyToClipboard} className="text-stone-400 hover:text-amber-500 transition-colors">
                     {copied ? <Check size={16} /> : <Copy size={16} />}
                 </button>
             )}
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            {analysis ? (
                <div className="prose prose-invert prose-amber max-w-none text-sm">
                <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-stone-600 italic">
                Analysis results will appear here...
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};