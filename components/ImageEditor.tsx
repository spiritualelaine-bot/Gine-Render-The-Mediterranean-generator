import React, { useState, useRef } from 'react';
import { editImageCinematic } from '../services/geminiService';
import { Loader2, Upload, Wand2, ArrowRight } from 'lucide-react';

export const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setResultImage(null);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    try {
      const result = await editImageCinematic(image, prompt);
      setResultImage(result);
    } catch (error) {
      console.error(error);
      alert("Failed to edit image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
       <div className="mb-8">
        <h2 className="text-3xl font-serif text-amber-50 mb-2">Nano Banana Scene Editor</h2>
        <p className="text-stone-400">Modify existing shots using Gemini 2.5 Flash Image. Add filters, remove elements, or change lighting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div className="space-y-6">
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden
              ${preview ? 'border-amber-600/50 bg-stone-900' : 'border-stone-700 hover:border-stone-500 hover:bg-stone-800'}`}
          >
            {preview ? (
               <img src={preview} alt="Original" className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
            ) : (
              <div className="text-stone-500 flex flex-col items-center gap-2">
                <Upload size={32} />
                <span>Upload Source Plate</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-stone-300">Editing Instruction</label>
             <div className="flex gap-2">
               <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Add a retro film grain filter..."
                className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:ring-2 focus:ring-amber-600 outline-none"
               />
               <button 
                onClick={handleEdit}
                disabled={!image || !prompt || loading}
                className="px-6 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-800 text-white rounded-lg font-bold transition-colors flex items-center"
               >
                 {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
               </button>
             </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="h-[500px] bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-center relative">
           {resultImage ? (
             <img src={resultImage} alt="Edited" className="max-w-full max-h-full object-contain" />
           ) : (
             <div className="text-stone-600 text-center">
               {loading ? (
                 <div className="flex flex-col items-center gap-3">
                   <Loader2 className="animate-spin w-8 h-8 text-amber-500" />
                   <p>Applying edits...</p>
                 </div>
               ) : (
                 <p>Edited result will appear here</p>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};