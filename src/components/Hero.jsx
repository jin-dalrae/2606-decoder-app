import React from 'react';

export default function Hero({ onDecode, onMethodology }) {
  const handleDecode = () => {
    if (typeof onDecode === 'function') onDecode();
  };

  const handleMethodology = (e) => {
    if (typeof onMethodology === 'function') {
      e.preventDefault();
      onMethodology();
    }
  };

  return (
    <section className="hero">
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
        <a className="glass-btn" href="#synthesis" onClick={handleMethodology}>
          Read the methodology
        </a>
      </div>
    </section>
  );
}
