import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageEditor } from './components/ImageEditor';
import { VideoGenerator } from './components/VideoGenerator';
import { Analyzer } from './components/Analyzer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'generate-image':
        return <ImageGenerator />;
      case 'edit-image':
        return <ImageEditor />;
      case 'generate-video':
        return <VideoGenerator />;
      case 'analyze':
        return <Analyzer />;
      case 'home':
      default:
        return (
          <div className="max-w-4xl mx-auto text-center py-20 space-y-8">
            <h1 className="text-5xl md:text-7xl font-serif text-amber-50 tracking-tight">
              GEMINI <span className="text-amber-600">CINE-RENDER</span> STUDIO
            </h1>
            <p className="text-xl text-stone-400 font-light max-w-2xl mx-auto">
              The Epistle to the Hebrews Project
            </p>
            <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
              Welcome to the production hub. Use the sidebar to generate characters, animate scenes with Veo, or analyze location scouts.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
               <div className="p-6 bg-stone-900 rounded-xl border border-stone-800 hover:border-amber-900 transition-colors cursor-pointer" onClick={() => setActiveTab('generate-image')}>
                 <div className="h-12 w-12 bg-amber-900/20 rounded-full flex items-center justify-center mb-4 text-amber-500 font-bold text-xl">1</div>
                 <h3 className="text-lg font-bold text-stone-200 mb-2">World Builder</h3>
                 <p className="text-sm text-stone-500">Generate high-fidelity Judean landscapes and characters.</p>
               </div>
               <div className="p-6 bg-stone-900 rounded-xl border border-stone-800 hover:border-amber-900 transition-colors cursor-pointer" onClick={() => setActiveTab('generate-video')}>
                 <div className="h-12 w-12 bg-amber-900/20 rounded-full flex items-center justify-center mb-4 text-amber-500 font-bold text-xl">2</div>
                 <h3 className="text-lg font-bold text-stone-200 mb-2">Veo Animation</h3>
                 <p className="text-sm text-stone-500">Bring static storyboards to life with AI video generation.</p>
               </div>
               <div className="p-6 bg-stone-900 rounded-xl border border-stone-800 hover:border-amber-900 transition-colors cursor-pointer" onClick={() => setActiveTab('edit-image')}>
                 <div className="h-12 w-12 bg-amber-900/20 rounded-full flex items-center justify-center mb-4 text-amber-500 font-bold text-xl">3</div>
                 <h3 className="text-lg font-bold text-stone-200 mb-2">Scene Director</h3>
                 <p className="text-sm text-stone-500">Edit lighting, remove anachronisms, and apply filters.</p>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-200 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;