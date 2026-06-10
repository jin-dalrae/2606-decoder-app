import React, { useState, useEffect } from 'react';

export default function Header({ tensionMode, setTensionMode }) {
  const [typedTitle, setTypedTitle] = useState("");
  const fullTitle = "Anthropic Culture Decoder";

  useEffect(() => {
    let index = 0;
    setTypedTitle("");
    const interval = setInterval(() => {
      if (index < fullTitle.length) {
        setTypedTitle(fullTitle.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-stone-850/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Brand & Typewriter Title */}
      <div className="flex flex-col items-center sm:items-start">
        <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-1">
          Culture Diagnostic Tool
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 select-none flex items-center">
          <span className="bg-gradient-to-r from-text-primary via-accent-gold to-accent-gold-light bg-clip-text text-transparent">
            {typedTitle}
          </span>
          <span className="typewriter inline-block ml-1 h-[1.25em] w-[2px] bg-amber-500 align-middle"></span>
        </h1>
      </div>

      {/* Controls: Spotlight and PDF Export */}
      <div className="flex items-center gap-4">
        {/* Tension Spotlight Toggle */}
        <button
          onClick={() => setTensionMode(!tensionMode)}
          className={`glass-btn px-4 py-2 text-xs font-mono transition-all duration-300 flex items-center gap-2 ${
            tensionMode
              ? 'bg-red-950/40 text-red-400 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : 'text-stone-400 border-stone-800 hover:text-amber-500 hover:border-amber-500/50'
          }`}
          title="Toggle Tension Spotlight to highlight cultural friction points across all views"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${tensionMode ? 'bg-red-500 animate-pulse' : 'bg-stone-600'}`} />
          {tensionMode ? '● TENSION SPOTLIGHT ON' : '○ TENSION SPOTLIGHT'}
        </button>

        {/* Export PDF Button */}
        <button
          onClick={() => window.print()}
          className="glass-btn glass-btn-primary px-4 py-2 text-xs font-mono text-slate-950 font-bold"
          title="Export high-contrast print-optimized PDF of this report"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          EXPORT PDF
        </button>
      </div>
    </header>
  );
}
