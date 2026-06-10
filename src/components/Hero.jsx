import React from 'react';

export default function Hero({ tensionMode, setTensionMode }) {
  const handleDecode = () => {
    const first = document.getElementById('dashboard-start');
    if (first) {
      first.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero">
      {/* Slim controls row — tension spotlight + print export */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setTensionMode(!tensionMode)}
          className={`glass-btn px-4 py-2 text-xs font-mono transition-all duration-300 ${
            tensionMode ? 'border-red-500 text-red-400' : ''
          }`}
          title="Toggle Tension Spotlight to highlight cultural friction points across all views"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              tensionMode ? 'bg-red-500 animate-pulse' : 'bg-stone-600'
            }`}
          />
          {tensionMode ? 'Tension spotlight on' : 'Tension spotlight'}
        </button>

        <button
          onClick={() => window.print()}
          className="glass-btn px-4 py-2 text-xs font-mono"
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
          Export PDF
        </button>
      </div>

      {/* Anthropic logo — radial-burst mark + wordmark, monochrome ink */}
      <div className="hero-logo">
        <svg
          width="30"
          height="30"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g fill="#100F11">
            <rect x="46.5" y="6" width="7" height="88" rx="3.5" />
            <rect x="46.5" y="6" width="7" height="88" rx="3.5" transform="rotate(60 50 50)" />
            <rect x="46.5" y="6" width="7" height="88" rx="3.5" transform="rotate(120 50 50)" />
            <rect x="46.5" y="6" width="7" height="88" rx="3.5" transform="rotate(30 50 50)" />
            <rect x="46.5" y="6" width="7" height="88" rx="3.5" transform="rotate(90 50 50)" />
            <rect x="46.5" y="6" width="7" height="88" rx="3.5" transform="rotate(150 50 50)" />
          </g>
        </svg>
        <span className="hero-wordmark">Anthropic</span>
      </div>

      {/* Headline */}
      <h1 className="hero-title">Anthropic, Culture Decoded</h1>

      {/* Subtitle */}
      <p className="hero-subtitle">
        Decoding the culture of the company building Claude — one piece of evidence at a time.
      </p>

      {/* CTAs */}
      <div className="hero-cta">
        <button className="glass-btn glass-btn-primary" onClick={handleDecode}>
          Decode the culture
        </button>
        <a className="glass-btn" href="#methodology">
          Read the methodology
        </a>
      </div>
    </section>
  );
}
