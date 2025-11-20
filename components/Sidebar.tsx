import React from 'react';
import { Clapperboard, Image as ImageIcon, Wand2, Video, ScanEye, Film, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: 'Studio Hub', icon: <LayoutDashboard size={20} /> },
    { id: 'generate-image', label: 'Character & World', icon: <ImageIcon size={20} /> },
    { id: 'edit-image', label: 'Scene Editor', icon: <Wand2 size={20} /> },
    { id: 'generate-video', label: 'Veo Animation', icon: <Video size={20} /> },
    { id: 'analyze', label: 'Reference Analyzer', icon: <ScanEye size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-stone-900 border-r border-stone-800 flex flex-col sticky top-0">
      <div className="p-6 border-b border-stone-800">
        <div className="flex items-center gap-2 text-amber-500 mb-1">
          <Film size={24} />
          <span className="font-serif font-bold text-lg tracking-wider">CINE-RENDER</span>
        </div>
        <p className="text-xs text-stone-500 uppercase tracking-[0.2em]">Gemini Powered</p>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === item.id 
                ? 'bg-amber-900/20 text-amber-400 border border-amber-900/50' 
                : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-800">
        <div className="bg-stone-800/50 rounded p-3 text-xs text-stone-500">
          <p className="font-semibold text-stone-400 mb-1">Project Active</p>
          <p>The Epistle to the Hebrews</p>
        </div>
      </div>
    </div>
  );
};