import React, { useState } from 'react';
import ConstellationBackground from './components/ConstellationBackground';
import Header from './components/Header';
import ScheinIceberg from './components/ScheinIceberg';
import GoffeeJonesGrid from './components/GoffeeJonesGrid';
import DesignMaturity from './components/DesignMaturity';
import EvidenceHub from './components/EvidenceHub';
import SelectionVettingPage from './components/SelectionVettingPage';
import ProgressionRewardPage from './components/ProgressionRewardPage';
import PowerGovernancePage from './components/PowerGovernancePage';
import SocialRitualsPage from './components/SocialRitualsPage';

function App() {
  const [tensionMode, setTensionMode] = useState(false);
  const [activePage, setActivePage] = useState('home'); // 'home' | 'selection' | 'progression' | 'power' | 'social' | 'synthesis'

  // Navigation handlers
  const handleNav = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to determine if a page link is active
  const activeClass = (page) => activePage === page ? 'active' : '';

  // Render main page content dynamically based on routing state
  const renderContent = () => {
    switch (activePage) {
      case 'selection':
        return <SelectionVettingPage tensionMode={tensionMode} />;

      case 'progression':
        return <ProgressionRewardPage tensionMode={tensionMode} />;

      case 'power':
        return <PowerGovernancePage tensionMode={tensionMode} />;

      case 'social':
        return <SocialRitualsPage tensionMode={tensionMode} />;


      case 'synthesis':
        return (
          <div className="app-main-content">
            <section className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase block">Pillar 05 / Evaluation</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white m-0">Synthesis & Typology</h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed m-0">
                Integrates our diagnostic findings. Examine where Anthropic plots on the Goffee-Jones grid relative to competitors, and review design maturity scores with live parameter sliders.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-stone-500">Goffee-Jones Sociability vs. Solidarity Grid</span>
                <span className="h-[1px] flex-grow bg-stone-900" />
              </div>
              <GoffeeJonesGrid tensionMode={tensionMode} />
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-stone-500">Design Maturity Radar Metrics</span>
                <span className="h-[1px] flex-grow bg-stone-900" />
              </div>
              <DesignMaturity tensionMode={tensionMode} />
            </section>
          </div>
        );

      case 'home':
      default:
        return (
          <div className="app-main-content">
            {/* Dashboard Intro Hero Block */}
            <section className="max-w-3xl py-4 flex flex-col gap-3">
              <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase block">
                Anthropic Culture Diagnostic Report
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white m-0">
                Decoding Organizational DNA
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed m-0">
                Welcome to the culture decoder. Dissect the invisible guidelines governing Anthropic PBC, mapped across four core pillars of company culture and unified under Schein's Iceberg levels and the Goffee-Jones alignment grid.
              </p>
            </section>

            {/* Quick Pillars Grid Navigation */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-stone-500">Culture Pillars Overview</span>
                <span className="h-[1px] flex-grow bg-stone-900" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => handleNav('selection')} className="glass-panel cursor-pointer hover:border-amber-500/50 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-amber-500 block uppercase mb-1">Pillar 01</span>
                    <h3 className="text-lg font-bold mb-2 text-stone-200">Selection & Vetting</h3>
                    <p className="text-stone-400 text-xs leading-relaxed mb-4">Vetting for high-density, low-ego talent and safety mission alignment during recruiter screens.</p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase mt-auto">Analyze Pillar →</span>
                </div>

                <div onClick={() => handleNav('progression')} className="glass-panel cursor-pointer hover:border-amber-500/50 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-amber-500 block uppercase mb-1">Pillar 02</span>
                    <h3 className="text-lg font-bold mb-2 text-stone-200">Progression & Reward</h3>
                    <p className="text-stone-400 text-xs leading-relaxed mb-4">Investigating incentives, burnout assumptions, and milestone-focused work sprints.</p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase mt-auto">Analyze Pillar →</span>
                </div>

                <div onClick={() => handleNav('power')} className="glass-panel cursor-pointer hover:border-amber-500/50 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-amber-500 block uppercase mb-1">Pillar 03</span>
                    <h3 className="text-lg font-bold mb-2 text-stone-200">Power & Governance</h3>
                    <p className="text-stone-400 text-xs leading-relaxed mb-4">Tracing the safety veto power, corporate benefit trust charters, and commercialization frictions.</p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase mt-auto">Analyze Pillar →</span>
                </div>

                <div onClick={() => handleNav('social')} className="glass-panel cursor-pointer hover:border-amber-500/50 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-amber-500 block uppercase mb-1">Pillar 04</span>
                    <h3 className="text-lg font-bold mb-2 text-stone-200">Social & Rituals</h3>
                    <p className="text-stone-400 text-xs leading-relaxed mb-4">Observing greenhouse aesthetics, kind communication styles, and AI marketplace sandboxes.</p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase mt-auto">Analyze Pillar →</span>
                </div>
              </div>
            </section>

            {/* Strategic Design Maturity Summary */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-stone-500">Design Maturity & Strategic Alignment</span>
                <span className="h-[1px] flex-grow bg-stone-900" />
              </div>
              <DesignMaturity tensionMode={tensionMode} />
            </section>
          </div>
        );
    }
  };

  return (
    <>
      {/* Interactive Cosmos/Constellation Backdrop */}
      <ConstellationBackground />

      <div className="app-layout">
        
        {/* Sticky Left Sidebar Navigation */}
        <aside className="app-sidebar">
          
          <div className="app-sidebar-header">
            <h1 className="app-sidebar-title">CULTURE DECODER</h1>
            <span className="app-sidebar-subtitle">Anthropic Alignment</span>
          </div>

          <nav>
            <ul className="app-sidebar-menu">
              <li>
                <button onClick={() => handleNav('home')} className={`app-sidebar-link ${activeClass('home')}`}>
                  <span>●</span> Overview / Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('selection')} className={`app-sidebar-link ${activeClass('selection')}`}>
                  <span>○</span> 1. Selection & Vetting
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('progression')} className={`app-sidebar-link ${activeClass('progression')}`}>
                  <span>○</span> 2. Progression & Reward
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('power')} className={`app-sidebar-link ${activeClass('power')}`}>
                  <span>○</span> 3. Power & Governance
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('social')} className={`app-sidebar-link ${activeClass('social')}`}>
                  <span>○</span> 4. Social & Rituals
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('synthesis')} className={`app-sidebar-link ${activeClass('synthesis')}`}>
                  <span>●</span> 5. Synthesis (Grid)
                </button>
              </li>
            </ul>
          </nav>

          {/* Group 2 LbD Credits Badge */}
          <div className="app-team-badge">
            <div className="font-mono text-[9px] text-amber-500 uppercase font-semibold mb-1">LbD GROUP 2 WORK</div>
            <strong>Rae, Ayushi, Yulin, Karen</strong>
            <div className="text-[10px] text-stone-500 mt-1 font-mono">Learning by Design Class</div>
          </div>

          {/* Sidebar Footer Controls */}
          <div className="app-sidebar-footer">
            <div className="text-[9px] font-mono text-stone-500 uppercase tracking-widest text-center">
              SYSTEM CONTROLS
            </div>
          </div>

        </aside>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col justify-between min-h-screen">
          
          <div className="flex flex-col gap-6">
            {/* Top Toolbar Header (spotlight toggle, print button) */}
            <Header tensionMode={tensionMode} setTensionMode={setTensionMode} />

            {/* Dynamic Page Rendering */}
            {renderContent()}
          </div>

          {/* Print Friendly Footer */}
          <footer className="border-t border-stone-900/60 pt-6 pb-8 mt-12 text-center text-[10px] text-stone-600 font-mono flex flex-col sm:flex-row justify-between items-center gap-3">
            <span>© 2026 ANTIGRAVITY RESEARCH SYSTEMS (CULTURE DIAGNOSTICS DEPT)</span>
            <span className="hidden sm:inline-block">●</span>
            <span>PRESS [CMD+P] OR [CTRL+P] FOR PRINT-OPTIMIZED FORMATTING</span>
          </footer>

        </div>

      </div>
    </>
  );
}

export default App;
