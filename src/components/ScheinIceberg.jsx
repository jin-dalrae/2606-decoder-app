import React, { useState } from 'react';
import cultureData from '../data/cultureData.json';

export default function ScheinIceberg({ tensionMode }) {
  const [selectedLayer, setSelectedLayer] = useState('artifacts'); // Default to artifacts

  const layerDefinitions = {
    artifacts: {
      id: 'artifacts',
      title: 'Artifacts & Behaviors',
      depth: 'Visible (Above Water)',
      definition: 'The visible structures, processes, languages, physical space, and products of the organization.',
      dbKey: 'artifacts',
      color: '#D97706', // Gold
      zOffsetNormal: 'translate3d(0, 0, 70px)',
      zOffsetHover: 'translate3d(0, 0, 100px)',
      glowColor: 'rgba(217, 119, 6, 0.4)'
    },
    espoused: {
      id: 'espoused',
      title: 'Espoused Values',
      depth: 'Sub-Surface (Semi-Visible)',
      definition: 'Stated goals, strategies, and operating philosophies. What the company explicitly says they prioritize.',
      dbKey: 'espousedValues',
      color: '#F5EBE6', // Sand
      zOffsetNormal: 'translate3d(0, 0, 0px)',
      zOffsetHover: 'translate3d(0, 0, 30px)',
      glowColor: 'rgba(245, 235, 230, 0.3)'
    },
    tacit: {
      id: 'tacit',
      title: 'Tacit Assumptions',
      depth: 'Deep Ocean (Invisible Core)',
      definition: 'Unconscious, taken-for-granted beliefs, perceptions, and thoughts that are the ultimate source of values and actions.',
      dbKey: 'tacitAssumptions',
      color: '#3B82F6', // Blue
      zOffsetNormal: 'translate3d(0, 0, -70px)',
      zOffsetHover: 'translate3d(0, 0, -40px)',
      glowColor: 'rgba(59, 130, 246, 0.4)'
    }
  };

  const activeDef = layerDefinitions[selectedLayer];
  const activeItems = cultureData.iceberg[activeDef.dbKey];

  return (
    <div className={`glass-panel w-full flex flex-col xl:flex-row gap-8 min-h-[550px] transition-all duration-500 ${
      tensionMode ? 'glass-panel-glow-tension border-red-500/40' : 'glass-panel-glow'
    }`}>
      
      {/* 3D Iceberg Interactive Stack */}
      <div className="flex-1 flex flex-col justify-center items-center py-8 relative min-h-[350px] select-none">
        
        {/* Dynamic Waterline Graphic */}
        <div className="absolute w-full border-t border-dashed border-sky-400/40 top-[42%] left-0 flex justify-between px-4 pointer-events-none">
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
                ? 'border-red-500/50 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.25)]' 
                : isSelected 
                  ? 'border-amber-400 bg-slate-900/90 shadow-[0_15px_30px_rgba(0,0,0,0.65)]' 
                  : 'border-stone-800 bg-slate-950/70 hover:border-stone-700 shadow-[0_5px_15px_rgba(0,0,0,0.4)]';

              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`absolute w-full h-[85px] rounded-xl cursor-pointer flex flex-col justify-center items-center border p-4 transition-all duration-500 ease-out ${borderStyle}`}
                  style={{ 
                    transform: currentTransform,
                    transformStyle: 'preserve-3d',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}
                >
                  <span className="text-[9px] font-mono tracking-widest text-stone-500 uppercase mb-1">
                    Level 0{index + 1}
                  </span>
                  <span className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${
                    isSelected ? 'text-amber-400' : 'text-stone-200'
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
                        ? 'bg-gradient-to-b from-red-500 to-orange-500' 
                        : isSelected 
                          ? 'bg-amber-400' 
                          : 'bg-stone-800'
                    }`} 
                    style={{ transform: 'rotateY(-90deg) translateZ(0px)' }}
                  />
                  {/* Bottom Side Edge Panel (3D Depth) */}
                  <div 
                    className={`absolute right-0 bottom-0 left-0 h-[6px] origin-bottom rounded-b-md transition-all duration-300 ${
                      tensionMode 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600' 
                        : isSelected 
                          ? 'bg-amber-500' 
                          : 'bg-stone-900'
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
                  ? 'bg-gradient-to-b from-red-500 via-orange-500 to-red-600 opacity-70 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse' 
                  : 'bg-gradient-to-b from-amber-500/20 via-stone-700/10 to-blue-500/20 opacity-30'
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
              {cultureData.iceberg.tensions.map((tension, idx) => (
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
