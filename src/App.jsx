import React, { useState } from 'react';
import ConstellationBackground from './components/ConstellationBackground';
import Hero from './components/Hero';
import ScheinIceberg from './components/ScheinIceberg';
import GoffeeJonesGrid from './components/GoffeeJonesGrid';
import DesignMaturity from './components/DesignMaturity';
import EvidenceHub from './components/EvidenceHub';

function App() {
  const [tensionMode, setTensionMode] = useState(false);

  return (
    <>
      {/* Interactive Cosmos/Constellation Backdrop */}
      <ConstellationBackground />

      {/* Main Layout Content */}
      <main className="w-full flex-grow flex flex-col gap-10">

        {/* Finished hero — logo, headline, subtitle, CTAs */}
        <Hero tensionMode={tensionMode} setTensionMode={setTensionMode} />

        {/* Component 01: Schein's Iceberg */}
        <section id="dashboard-start" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-stone-500">01 / Depth Stack</span>
            <span className="h-[1px] flex-grow bg-stone-900" />
          </div>
          <ScheinIceberg tensionMode={tensionMode} />
        </section>

        {/* Diagnostic Split Layout for Goffee-Jones & Design Maturity */}
        <div className="grid grid-cols-1 gap-10">
          
          {/* Component 02: Goffee-Jones 2x2 Grid */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-500">02 / Cultural Typology Matrix</span>
              <span className="h-[1px] flex-grow bg-stone-900" />
            </div>
            <GoffeeJonesGrid tensionMode={tensionMode} />
          </section>

          {/* Component 03: Design Maturity & Radar Chart */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-500">03 / Design Integration & Radar Metric</span>
              <span className="h-[1px] flex-grow bg-stone-900" />
            </div>
            <DesignMaturity tensionMode={tensionMode} />
          </section>

        </div>

        {/* Component 04: Qualitative Evidence Hub */}
        <section id="methodology" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-stone-500">04 / Raw Source Feed</span>
            <span className="h-[1px] flex-grow bg-stone-900" />
          </div>
          <EvidenceHub tensionMode={tensionMode} />
        </section>

        {/* Report Footer */}
        <footer className="border-t border-stone-900/60 pt-6 pb-8 text-center text-[10px] text-stone-600 font-mono flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>© 2026 ANTIGRAVITY RESEARCH SYSTEMS (CULTURE DIAGNOSTICS DEPT)</span>
          <span className="hidden sm:inline-block">●</span>
          <span>PRESS [CMD+P] OR [CTRL+P] FOR PRINT-OPTIMIZED FORMATTING</span>
        </footer>

      </main>
    </>
  );
}

export default App;
