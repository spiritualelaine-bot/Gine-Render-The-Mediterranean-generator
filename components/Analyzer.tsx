import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Upload, Loader2, FileText, ScanLine } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Analyzer: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
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
      const result = await analyzeImage(image, "Analyze this image for a film production. Describe the lighting, color palette, period accuracy, texture details, and potential improvements for a cinematic look.");
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
       <div className="mb-8">
        <h2 className="text-3xl font-serif text-amber-50 mb-2">Reference Analyzer</h2>
        <p className="text-stone-400">Upload historical references or location scouts for Gemini 3 Pro to break down cinematic elements.</p>
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
            Generate Analysis Report
          </button>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 overflow-y-auto max-h-[600px] shadow-inner shadow-black/50">
          {analysis ? (
            <div className="prose prose-invert prose-amber max-w-none">
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
  );
};