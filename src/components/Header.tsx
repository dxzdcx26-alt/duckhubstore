import React from 'react';

export const Header: React.FC<{ activeTab: string; setActiveTab: (t: string) => void }> = ({ activeTab, setActiveTab }) => (
  <header className="sticky top-0 z-40 border-b border-yellow-500/20 bg-black/80 backdrop-blur">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <button onClick={() => setActiveTab('home')} className="font-black text-yellow-400 text-lg">DuckyHub 🦆</button>
      <nav className="flex gap-2 text-sm flex-wrap">
        {['home','streaming','gaming','wheel','user','admin'].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1.5 rounded-lg ${activeTab===t?'bg-yellow-500 text-black':'text-neutral-300 hover:bg-white/5'}`}>{t}</button>
        ))}
      </nav>
    </div>
  </header>
);
