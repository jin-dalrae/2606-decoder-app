import React, { useState } from 'react';
import cultureData from '../data/cultureData.json';

export default function DesignMaturity({ tensionMode }) {
  const { status, rungs, radarMetrics } = cultureData.designMaturity;

  // Track selected rung index (0 to 4). Default to Integrated (index 3)
  const [selectedRung, setSelectedRung] = useState(3);

  // Initialize Anthropic values from the database
  const [anthropicValues, setAnthropicValues] = useState({
    'UI Polish': radarMetrics.find(m => m.dimension === 'UI Polish').anthropic,
    'Brand Identity': radarMetrics.find(m => m.dimension === 'Brand Identity').anthropic,
    'Tool Innovation': radarMetrics.find(m => m.dimension === 'Tool Innovation').anthropic,
    'Safety Influence': radarMetrics.find(m => m.dimension === 'Safety Influence').anthropic,
    'Research Alignment': radarMetrics.find(m => m.dimension === 'Research Alignment').anthropic,
  });

  const dimensions = [
    { key: 'UI Polish', label: 'UI Polish' },
    { key: 'Brand Identity', label: 'Brand Identity' },
    { key: 'Tool Innovation', label: 'Tool Innovation' },
    { key: 'Safety Influence', label: 'Safety Influence' },
    { key: 'Research Alignment', label: 'Research Alignment' }
  ];

  const size = 320;
  const center = size / 2;
  const rMax = 110; // Maximum radius

  // Convert value (0 to 5) and index to (x, y) coordinates
  const getCoordinates = (value, index) => {
    const angle = (Math.PI * 2 / 5) * index - Math.PI / 2; // Point straight UP
    const radius = (value / 5) * rMax;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Build the polygon points path string
  const getPathString = (valuesMap, isAnthropic = true) => {
    const coords = dimensions.map((d, index) => {
      const val = isAnthropic 
        ? valuesMap[d.key] 
        : radarMetrics.find(m => m.dimension === d.key).industryAverage;
      const { x, y } = getCoordinates(val, index);
      return `${x},${y}`;
    });
    return coords.join(' ');
  };

  const anthropicPoints = getPathString(anthropicValues, true);
  const industryPoints = getPathString(null, false);

  // Render concentric polygon grid lines (scale 1 to 5)
  const renderBackgroundPolygons = () => {
    return [1, 2, 3, 4, 5].map((scaleVal) => {
      const coords = dimensions.map((_, index) => {
        const { x, y } = getCoordinates(scaleVal, index);
        return `${x},${y}`;
      }).join(' ');

      return (
        <polygon
          key={scaleVal}
          points={coords}
          fill="none"
          stroke="rgba(16, 15, 17, 0.08)"
          strokeWidth="1"
        />
      );
    });
  };

  // Render radial spokes
  const renderRadarSpokes = () => {
    return dimensions.map((_, index) => {
      const { x, y } = getCoordinates(5, index);
      return (
        <line
          key={index}
          x1={center}
          y1={center}
          x2={x}
          y2={y}
          stroke="rgba(16, 15, 17, 0.1)"
          strokeWidth="1"
        />
      );
    });
  };

  // Render labels around vertices
  const renderLabels = () => {
    return dimensions.map((d, index) => {
      const angle = (Math.PI * 2 / 5) * index - Math.PI / 2;
      const x = center + (rMax + 22) * Math.cos(angle);
      const y = center + (rMax + 12) * Math.sin(angle);
      
      let anchor = "middle";
      if (Math.cos(angle) > 0.1) anchor = "start";
      if (Math.cos(angle) < -0.1) anchor = "end";

      return (
        <text
          key={d.key}
          x={x}
          y={y}
          fill="#5D5D5D"
          fontSize="9"
          fontFamily="Work Sans"
          fontWeight="600"
          textAnchor={anchor}
        >
          {d.label}
        </text>
      );
    });
  };

  // Currently active rung details
  const activeRung = rungs[selectedRung];
  // Check if active rung is part of Anthropic's current maturity (Integrated, Strategic)
  const isAnthropicRung = activeRung.isCurrent;

  return (
    <div className={`glass-panel w-full flex flex-col xl:flex-row gap-8 items-center transition-all duration-500 ${
      tensionMode ? 'border-red-500/30' : 'glass-panel-glow'
    }`}>
      
      {/* Design Maturity Ladder UI */}
      <div className="flex-1 w-full max-w-md">
        <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-3 block">
          Ladder of Design Integration
        </span>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Design Maturity Ladder</h2>
        <p className="text-stone-400 text-xs sm:text-sm mb-6 leading-relaxed">
          Organizational design influence scales from post-hoc styling to core business strategy. Click different steps to review capabilities.
        </p>

        {/* Ladder Steps */}
        <div className="flex flex-col gap-2 mb-6">
          {[...rungs].reverse().map((rung, revIdx) => {
            const index = rungs.length - 1 - revIdx;
            const isSelected = selectedRung === index;
            const isCurrent = rung.isCurrent;

            return (
              <div
                key={rung.name}
                onClick={() => setSelectedRung(index)}
                className={`border p-3.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 text-white shadow-[0_0_12px_rgba(217,119,6,0.15)]'
                    : 'border-stone-850 bg-black/20 hover:border-stone-800 text-stone-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
                    0{index + 1}
                  </span>
                  <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-white' : 'text-stone-300'}`}>
                    {rung.name} Step
                  </span>
                </div>
                
                {isCurrent && (
                  <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                    CURRENT STANDING
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Rung Details Card */}
        <div className="bg-black/35 border border-stone-850 rounded-xl p-4 min-h-[140px] flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono text-amber-400 uppercase mb-1">{activeRung.name} Description</h4>
            <p className="text-stone-300 text-xs leading-relaxed m-0">{activeRung.description}</p>
          </div>
          {isAnthropicRung && (
            <div className="mt-3 pt-3 border-t border-stone-900 text-[10px] text-stone-500 italic">
              * Anthropic has achieved this stage, embedding design into strategic development alongside AI research.
            </div>
          )}
        </div>
      </div>

      {/* SVG Radar Chart and Interactive Sliders */}
      <div className="flex-[1.2] w-full flex flex-col md:flex-row gap-6 items-center">
        
        {/* Radar Chart Visual */}
        <div className="flex-1 flex justify-center items-center relative py-4">
          <svg viewBox="0 0 320 320" className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] drop-shadow-2xl select-none">
            {/* Concentric Grid Polygons */}
            {renderBackgroundPolygons()}

            {/* Radial Axes Spoke Lines */}
            {renderRadarSpokes()}

            {/* Vertices Labels */}
            {renderLabels()}

            {/* Scale Axis Numbers */}
            {[1, 2, 3, 4, 5].map((scale) => {
              const { y } = getCoordinates(scale, 0); // Straight UP
              return (
                <text key={scale} x={center + 5} y={y + 3} fill="rgba(16, 15, 17, 0.3)" fontSize="8" fontFamily="Inter">
                  {scale}
                </text>
              );
            })}

            {/* Industry Average Polygon (Dashed Blue line, no fill) */}
            <polygon
              points={industryPoints}
              fill="none"
              stroke="#5D5D5D"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              opacity="0.6"
            />

            {/* Anthropic/Our Org Polygon (Solid Glowing Gold) */}
            <polygon
              points={anthropicPoints}
              fill="rgba(20, 87, 204, 0.12)"
              stroke="#1457CC"
              strokeWidth="2.5"
              className="transition-all duration-300"
            />

            {/* Vertex Dots */}
            {dimensions.map((d, index) => {
              const val = anthropicValues[d.key];
              const { x, y } = getCoordinates(val, index);
              return (
                <circle
                  key={d.key}
                  cx={x}
                  cy={y}
                  r="4.5"
                  fill="#1457CC"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        </div>

        {/* Sliders and Benchmarks */}
        <div className="flex-1 w-full max-w-xs flex flex-col justify-between self-stretch py-2">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                VECTOR DIMENSIONS
              </span>
              <div className="flex gap-4 text-[9px] font-mono">
                <span className="text-amber-400">● ORG</span>
                <span className="text-blue-400">-- IND</span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {dimensions.map((d) => {
                const indVal = radarMetrics.find(m => m.dimension === d.key).industryAverage;
                return (
                  <div key={d.key} className="flex flex-col">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-stone-300">{d.label}</span>
                      <span className="font-mono text-amber-500 font-semibold">
                        {anthropicValues[d.key].toFixed(1)} <span className="text-stone-600 text-[10px]">/ 5.0 (Ind: {indVal.toFixed(1)})</span>
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={anthropicValues[d.key]}
                      onChange={(e) => setAnthropicValues({ ...anthropicValues, [d.key]: parseFloat(e.target.value) })}
                      className="w-full accent-amber-500 bg-stone-850 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* If the current maturity rung is active, display the detailed evidence list */}
          {isAnthropicRung && (
            <div className="mt-6 pt-4 border-t border-stone-850">
              <span className="text-[10px] font-mono text-amber-500 uppercase block mb-2 tracking-wider">
                Integrated Practice Evidence
              </span>
              <div className="max-h-[130px] overflow-y-auto pr-1 text-[11px] text-stone-300 leading-snug space-y-2 custom-scroll">
                {status.evidence.map((ev, i) => (
                  <div key={i} className="border-l-2 border-amber-500/40 pl-2">
                    <strong className="text-stone-200 block">{ev.title}</strong>
                    <span className="text-stone-400">{ev.details}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
