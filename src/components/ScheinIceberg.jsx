import React, { useState } from 'react';
import cultureData from '../data/cultureData.json';

export default function ScheinIceberg({ tensionMode, pillar = 'all' }) {
  const [selectedLayer, setSelectedLayer] = useState('artifacts'); // Default to artifacts

  const layerDefinitions = {
    artifacts: {
      id: 'artifacts',
      title: 'Artifacts & Behaviors',
      depth: 'Visible (Above Water)',
      definition: 'The visible structures, processes, languages, physical space, and products of the organization.',
      dbKey: 'artifacts',
      color: '#1457CC', // Brand blue
      zOffsetNormal: 'translate3d(0, -35px, 60px)',
      zOffsetHover: 'translate3d(0, -35px, 95px)',
      zIndex: 30,
      glowColor: 'rgba(20, 87, 204, 0.35)'
    },
    espoused: {
      id: 'espoused',
      title: 'Espoused Values',
      depth: 'Sub-Surface (Semi-Visible)',
      definition: 'Stated goals, strategies, and operating philosophies. What the company explicitly says they prioritize.',
      dbKey: 'espousedValues',
      color: '#5D5D5D', // Ink gray
      zOffsetNormal: 'translate3d(0, 0px, 0px)',
      zOffsetHover: 'translate3d(0, 0px, 35px)',
      zIndex: 20,
      glowColor: 'rgba(93, 93, 93, 0.3)'
    },
    tacit: {
      id: 'tacit',
      title: 'Tacit Assumptions',
      depth: 'Deep Ocean (Invisible Core)',
      definition: 'Unconscious, taken-for-granted beliefs, perceptions, and thoughts that are the ultimate source of values and actions.',
      dbKey: 'tacitAssumptions',
      color: '#08195C', // Deep navy
      zOffsetNormal: 'translate3d(0, 35px, -60px)',
      zOffsetHover: 'translate3d(0, 35px, -25px)',
      zIndex: 10,
      glowColor: 'rgba(8, 25, 92, 0.35)'
    }
  };

  const pillarMapping = {
    selection: {
      artifacts: ["SF Head Office & Hybrid/In-Office Model", "Top-Tier Silicon Valley Compensation"],
      espousedValues: ["Act for global good", "Ignite race to safety", "Put mission first"],
      tacitAssumptions: ["Talent density beats process", "Safety is a science"],
      tensions: ["Helpful Honest Harmless vs. Extreme pressure & long hours due to capability race"]
    },
    progression: {
      artifacts: ["Top-Tier Silicon Valley Compensation"],
      espousedValues: ["Simple thing that works", "Helpful honest harmless", "Put mission first"],
      tacitAssumptions: ["Extreme hours/burnout as the price of alignment"],
      tensions: ["Helpful Honest Harmless vs. Extreme pressure & long hours due to capability race"]
    },
    power: {
      artifacts: ["SF Head Office & Hybrid/In-Office Model", "Project Deal (Internal AI Marketplace)"],
      espousedValues: ["Act for global good", "Hold light and shade", "Ignite race to safety"],
      tacitAssumptions: ["Safety is a science", "Move fast but safely"],
      tensions: [
        "Ignite race to safety vs. Commercializing models rapidly to compete with OpenAI",
        "Be good to users vs. High Refusal Rates and Safety Censorship",
        "Simple thing that works vs. Scaling Infrastructure Complexity"
      ]
    },
    social: {
      artifacts: ["Claude.ai UI & Artifacts Feature", "Project Vend (AI Office Shop)", "Office Greenery (Plants)"],
      espousedValues: ["Be good to our users", "Helpful honest harmless"],
      tacitAssumptions: ["Talent density beats process"],
      tensions: [
        "Simple thing that works vs. Scaling Infrastructure Complexity",
        "Be good to users vs. High Refusal Rates and Safety Censorship",
        "Helpful Honest Harmless vs. Extreme pressure & long hours due to capability race"
      ]
    }
  };

  const activeDef = layerDefinitions[selectedLayer];
  let activeItems = cultureData.iceberg[activeDef.dbKey];

  if (pillar !== 'all' && pillarMapping[pillar]) {
    const allowedNames = pillarMapping[pillar][activeDef.dbKey];
    activeItems = activeItems.filter(item => {
      const name = item.name || item.value || item.assumption;
      return allowedNames.includes(name);
    });
  }

  let activeTensions = cultureData.iceberg.tensions;
  if (pillar !== 'all' && pillarMapping[pillar]) {
    const allowedTensions = pillarMapping[pillar].tensions;
    activeTensions = activeTensions.filter(tension => allowedTensions.includes(tension.title));
  }

  return (
    <div className={`glass-panel w-full flex flex-col xl:flex-row gap-8 min-h-[550px] transition-all duration-500 ${
      tensionMode ? 'glass-panel-glow-tension border-red-500/40' : 'glass-panel-glow'
    }`}>
      
      {/* 3D Iceberg Interactive Stack */}
      <div className="flex-1 flex flex-col justify-center items-center py-8 relative min-h-[350px] select-none">
        
        {/* Interactive Staggered Tab Navigation Fallback */}
        <div className="flex gap-2.5 mb-6 z-10 flex-wrap justify-center">
          {Object.values(layerDefinitions).map((layer, index) => {
            const isSelected = selectedLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`glass-btn text-[11px] py-1.5 px-3.5 rounded-full transition-all duration-300 font-mono tracking-wide ${
                  isSelected 
                    ? 'border-[#1457CC] bg-[#1457CC] text-white shadow-[0_4px_12px_rgba(20,87,204,0.25)]' 
                    : 'border-stone-300 text-stone-600 bg-white hover:border-[#1457CC] hover:text-[#1457CC]'
                }`}
              >
                L0{index + 1}: {layer.title.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Dynamic Waterline Graphic */}
        <div className="absolute w-full border-t border-dashed border-sky-400/40 top-[48%] left-0 flex justify-between px-4 pointer-events-none">
          <span className="text-[10px] font-mono text-sky-400/60 uppercase">Water Level ~ Visible Boundary</span>
          <span className="text-[10px] font-mono text-sky-400/60 uppercase">Sub-surface</span>
        </div>

        {/* Global Tension Pulse Ring */}
        {tensionMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[320px] h-[320px] border-2 border-dashed border-red-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute w-[360px] h-[360px] border border-orange-500/10 rounded-full animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
          </div>
        )}

        <div className="perspective-container relative w-[300px] h-[300px] flex items-center justify-center">
          <div 
            className="relative w-[280px] h-[90px] transition-transform duration-700 ease-out"
            style={{ 
              transform: 'rotateX(60deg) rotateZ(-40deg)', 
              transformStyle: 'preserve-3d' 
            }}
          >
            {/* Iceberg Layers */}
            {Object.values(layerDefinitions).map((layer, index) => {
              const isSelected = selectedLayer === layer.id;
              const currentTransform = isSelected ? layer.zOffsetHover : layer.zOffsetNormal;
              
              let borderStyle = tensionMode 
                ? 'border-red-500/50 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:border-red-400' 
                : isSelected 
                  ? 'border-[#1457CC] bg-[#FBFAF7] shadow-[0_15px_30px_rgba(20,87,204,0.15)]' 
                  : 'border-stone-300 bg-[#FFFEFB]/90 hover:border-stone-400 hover:shadow-[0_8px_18px_rgba(0,0,0,0.08)]';

              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`absolute w-full h-[85px] rounded-xl cursor-pointer flex flex-col justify-center items-center border p-4 transition-all duration-500 ease-out ${borderStyle}`}
                  style={{ 
                    transform: currentTransform,
                    transformStyle: 'preserve-3d',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    zIndex: isSelected ? 40 : layer.zIndex
                  }}
                >
                  <span className="text-[9px] font-mono tracking-widest text-stone-500 uppercase mb-1">
                    Level 0{index + 1}
                  </span>
                  <span className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${
                    isSelected ? 'text-[#1457CC]' : 'text-stone-800'
                  }`}>
                    {layer.title}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 mt-1">
                    {layer.depth}
                  </span>

                  {/* Left Side Edge Panel (3D Depth) */}
                  <div 
                    className={`absolute left-0 bottom-0 top-0 w-[6px] origin-left rounded-l-md transition-all duration-300 ${
                      tensionMode
                        ? 'bg-red-500'
                        : isSelected
                          ? 'bg-[#1457CC]'
                          : 'bg-stone-300'
                    }`} 
                    style={{ transform: 'rotateY(-90deg) translateZ(0px)' }}
                  />
                  {/* Bottom Side Edge Panel (3D Depth) */}
                  <div 
                    className={`absolute right-0 bottom-0 left-0 h-[6px] origin-bottom rounded-b-md transition-all duration-300 ${
                      tensionMode
                        ? 'bg-red-500'
                        : isSelected
                          ? 'bg-[#1457CC]'
                          : 'bg-stone-300'
                    }`} 
                    style={{ transform: 'rotateX(-90deg) translateZ(0px)' }}
                  />
                </div>
              );
            })}

            {/* Core Vertical Connection Axis / Tension Core */}
            <div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-[200px] pointer-events-none transition-all duration-500 ${
                tensionMode
                  ? 'bg-red-500 opacity-70 animate-pulse'
                  : 'bg-stone-300 opacity-40'
              }`}
              style={{ transform: 'translate3d(0, 0, -80px) rotateX(-90deg)', height: '220px' }}
            />
          </div>
        </div>
      </div>

      {/* Details Panel: Selected Layer Cards & Tensions */}
      <div className="flex-[1.2] flex flex-col justify-between">
        
        {/* Layer Definition Banner */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: activeDef.color }} />
            <h2 className="text-xl sm:text-2xl font-bold m-0">{activeDef.title}</h2>
          </div>
          <span className="text-xs font-mono text-amber-500 uppercase tracking-wider block mb-2">
            {activeDef.depth}
          </span>
          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed m-0 border-l-2 border-stone-800 pl-3">
            {activeDef.definition}
          </p>
        </div>

        {/* Dynamic Cards Container */}
        <div className="flex-grow">
          <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">
            Observed Cultural Entities ({activeItems.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
            {activeItems.map((item, idx) => {
              const name = item.name || item.value || item.assumption;
              const details = item.description;
              const extraKey = item.culturalSignificance ? 'Cultural Significance' : item.verbatim ? 'Core Philosophy' : 'Cultural Impact';
              const extraValue = item.culturalSignificance || item.verbatim || item.culturalImpact;

              return (
                <div 
                  key={idx} 
                  className="bg-black/35 border border-stone-850 hover:border-stone-800 rounded-xl p-3.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-mono text-amber-400 tracking-wide uppercase mb-1.5">{name}</h4>
                    <p className="text-stone-300 text-xs leading-relaxed mb-3">{details}</p>
                  </div>
                  {extraValue && (
                    <div className="border-t border-stone-900 pt-2 text-[10px] text-stone-400">
                      <span className="font-mono text-stone-500 block uppercase mb-0.5">{extraKey}:</span>
                      {extraValue}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tension Mode Section (Tension Spotlight) */}
        {tensionMode && (
          <div className="mt-6 pt-5 border-t border-red-900/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-xs font-mono text-red-500 uppercase tracking-wider m-0">
                ACTIVE ORGANIZATIONAL TENSIONS
              </h3>
            </div>
            
            <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scroll">
              {activeTensions.map((tension, idx) => (
                <div 
                  key={idx} 
                  className="bg-red-950/10 border border-red-900/30 rounded-xl p-3 text-xs"
                >
                  <strong className="text-red-400 block mb-1 font-semibold">{tension.title}</strong>
                  <div className="text-stone-400 mb-1.5"><span className="text-red-500/80 font-mono text-[9px] uppercase mr-1">Conflict:</span>{tension.conflict}</div>
                  <div className="text-stone-400"><span className="text-orange-500/80 font-mono text-[9px] uppercase mr-1">Manifestation:</span>{tension.manifestation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
