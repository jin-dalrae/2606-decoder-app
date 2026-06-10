import React, { useState, useRef } from 'react';
import cultureData from '../data/cultureData.json';

export default function GoffeeJonesGrid({ tensionMode }) {
  const containerRef = useRef(null);

  // Set default coordinates to Anthropic's coordinates (8.5, 8.5)
  const anthropicCoords = cultureData.goffeeJonesGrid.anthropic.coordinates;
  const [userCoord, setUserCoord] = useState({ x: anthropicCoords.x, y: anthropicCoords.y });

  const comparativeNodes = [
    {
      id: 'anthropic',
      name: 'Anthropic',
      x: anthropicCoords.x,
      y: anthropicCoords.y,
      color: '#D97706', // Gold
      description: cultureData.goffeeJonesGrid.anthropic.description,
      isCurrent: true
    },
    ...cultureData.goffeeJonesGrid.comparativeNodes.map(node => {
      let color = '#6B7280'; // Default Slate for Fragmented
      if (node.quadrant === 'Mercenary') color = '#EF4444'; // Red
      if (node.quadrant === 'Networked') color = '#F5EBE6'; // Sand/White
      return {
        id: node.quadrant.toLowerCase(),
        name: node.exampleOrg,
        x: node.coordinates.x,
        y: node.coordinates.y,
        color: color,
        description: node.description,
        isCurrent: false
      };
    })
  ];

  // Helper to map 0-10 math coordinate to 0-400 SVG coordinate
  const toSvgX = (x) => (x / 10) * 400;
  const toSvgY = (y) => (1 - y / 10) * 400; // Invert Y for SVG space

  // Helper to update coords based on event positioning
  const handleDragMove = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let relX = clientX - rect.left;
    let relY = clientY - rect.top;

    // Constrain to container boundaries
    relX = Math.max(0, Math.min(relX, rect.width));
    relY = Math.max(0, Math.min(relY, rect.height));

    // Map screen [0, rect.width] -> math [0.0, 10.0]
    const mathX = parseFloat(((relX / rect.width) * 10).toFixed(1));
    const mathY = parseFloat((10 - (relY / rect.height) * 10).toFixed(1));

    setUserCoord({ x: mathX, y: mathY });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragMove(e.clientX, e.clientY);

    const onMouseMove = (moveEvent) => {
      handleDragMove(moveEvent.clientX, moveEvent.clientY);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e) => {
    // Prevent scrolling when dragging on mobile
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);

    const onTouchMove = (moveEvent) => {
      const moveTouch = moveEvent.touches[0];
      handleDragMove(moveTouch.clientX, moveTouch.clientY);
    };

    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  };

  // Determine active quadrant and details
  const getQuadrantInfo = () => {
    const { x, y } = userCoord;
    const isHighSociability = x >= 5.0;
    const isHighSolidarity = y >= 5.0;

    if (isHighSociability && isHighSolidarity) {
      // Communal
      return {
        quadrant: 'Communal',
        accentColor: '#D97706',
        title: 'Communal Culture (Anthropic Core)',
        description: cultureData.goffeeJonesGrid.anthropic.description,
        extraTitle: 'Key Culture Evidence',
        extraContent: (
          <ul className="m-0 pl-4 text-xs text-stone-300 leading-relaxed space-y-1">
            {cultureData.goffeeJonesGrid.anthropic.evidence.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        )
      };
    } else if (!isHighSociability && isHighSolidarity) {
      // Mercenary
      const shift = cultureData.goffeeJonesGrid.scenarioShifts.toMercenary;
      return {
        quadrant: 'Mercenary',
        accentColor: '#EF4444',
        title: shift.title,
        description: shift.description,
        extraTitle: 'Culture Shift Impact',
        extraContent: <p className="text-xs text-red-400 font-mono leading-relaxed m-0 uppercase">{shift.culturalImpact}</p>
      };
    } else if (isHighSociability && !isHighSolidarity) {
      // Networked
      const shift = cultureData.goffeeJonesGrid.scenarioShifts.toNetworked;
      return {
        quadrant: 'Networked',
        accentColor: '#F5EBE6',
        title: shift.title,
        description: shift.description,
        extraTitle: 'Culture Shift Impact',
        extraContent: <p className="text-xs text-amber-500 font-mono leading-relaxed m-0 uppercase">{shift.culturalImpact}</p>
      };
    } else {
      // Fragmented
      const shift = cultureData.goffeeJonesGrid.scenarioShifts.toFragmented;
      return {
        quadrant: 'Fragmented',
        accentColor: '#6B7280',
        title: shift.title,
        description: shift.description,
        extraTitle: 'Culture Shift Impact',
        extraContent: <p className="text-xs text-stone-400 font-mono leading-relaxed m-0 uppercase">{shift.culturalImpact}</p>
      };
    }
  };

  const quadInfo = getQuadrantInfo();

  return (
    <div className={`glass-panel w-full flex flex-col xl:flex-row gap-8 items-center transition-all duration-500 ${
      tensionMode ? 'border-red-500/30' : 'glass-panel-glow'
    }`}>
      
      {/* 2x2 Interactive Grid */}
      <div className="flex-1 flex flex-col items-center">
        <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-3 block">
          Double-S Diagnostic Matrix
        </span>
        
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] bg-slate-950/70 border border-stone-850 rounded-2xl overflow-hidden cursor-crosshair shadow-2xl select-none"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Grid quadrants background styling */}
            <rect x="200" y="0" width="200" height="200" fill="rgba(16, 185, 129, 0.02)" /> {/* Communal (Top Right) */}
            <rect x="0" y="0" width="200" height="200" fill="rgba(239, 68, 68, 0.02)" />  {/* Mercenary (Top Left) */}
            <rect x="0" y="200" width="200" height="200" fill="rgba(107, 114, 128, 0.02)" /> {/* Fragmented (Bottom Left) */}
            <rect x="200" y="200" width="200" height="200" fill="rgba(217, 119, 6, 0.02)" /> {/* Networked (Bottom Right) */}

            {/* Grid Subdivisions (Fine grid lines) */}
            {[40, 80, 120, 160, 240, 280, 320, 360].map(coord => (
              <React.Fragment key={coord}>
                <line x1={coord} y1="0" x2={coord} y2="400" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                <line x1="0" y1={coord} x2="400" y2={coord} stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              </React.Fragment>
            ))}

            {/* Center Main Axes */}
            <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" />
            <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" />

            {/* Axis Arrows and Labels */}
            <text x="390" y="192" fill="#9ca3af" fontSize="9" fontFamily="Space Mono" textAnchor="end" letterSpacing="1">
              SOCIABILITY (Friendliness) →
            </text>
            <text x="10" y="210" fill="#6B7280" fontSize="9" fontFamily="Space Mono" textAnchor="start" letterSpacing="1">
              ← LOW SOCIABILITY
            </text>
            <text x="208" y="15" fill="#9ca3af" fontSize="9" fontFamily="Space Mono" textAnchor="start" letterSpacing="1">
              SOLIDARITY (Consensus) ↑
            </text>
            <text x="208" y="390" fill="#6B7280" fontSize="9" fontFamily="Space Mono" textAnchor="start" letterSpacing="1">
              ↓ LOW SOLIDARITY
            </text>

            {/* Static Comparative Nodes */}
            {comparativeNodes.map((node) => {
              const cx = toSvgX(node.x);
              const cy = toSvgY(node.y);
              return (
                <g 
                  key={node.id} 
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserCoord({ x: node.x, y: node.y });
                  }}
                >
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r="6" 
                    fill={node.color} 
                    opacity="0.75" 
                    className="hover:opacity-100 transition-all duration-300"
                  />
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r="10" 
                    fill="none" 
                    stroke={node.color} 
                    strokeWidth="1" 
                    opacity="0.3" 
                    className="group-hover:scale-125 transition-transform duration-300"
                  />
                  <text 
                    x={cx} 
                    y={cy - 12} 
                    fill={node.color} 
                    fontSize="8" 
                    fontFamily="Space Mono" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    {node.id === 'anthropic' ? 'Anthropic' : node.id.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* Draggable Active Marker */}
            <g transform={`translate(${toSvgX(userCoord.x)}, ${toSvgY(userCoord.y)})`} className="pointer-events-none">
              <circle r="14" fill="none" stroke={quadInfo.accentColor} strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="10;18;10" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle r="6" fill={quadInfo.accentColor} stroke="#0B0F19" strokeWidth="2" />
            </g>
          </svg>
        </div>
        <span className="text-[10px] text-stone-500 font-mono mt-3">
          Drag coordinates or click comparative nodes to test scenarios
        </span>
      </div>

      {/* Narrative & Dynamic Sidebar Details */}
      <div className="flex-1 max-w-xl w-full">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Sociability vs. Solidarity Mapping</h2>
        <p className="text-stone-400 text-xs sm:text-sm mb-6 leading-relaxed">
          Goffee and Jones define culture through <strong>Sociability</strong> (mutual sympathy and friendliness) and <strong>Solidarity</strong> (shared task focus and ruthless pursuit of objectives). Drag the point to see how organizational values warp.
        </p>

        {/* Dynamic Quadrant Details Card */}
        <div className="bg-black/35 border border-stone-850 rounded-2xl p-5 relative overflow-hidden min-h-[260px] flex flex-col justify-between">
          {/* Vertical Accent Color Indicator */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-500"
            style={{ backgroundColor: quadInfo.accentColor }}
          />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-bold text-white m-0 uppercase tracking-wide">
                {quadInfo.quadrant} Quadrant
              </h3>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-white/5 border border-stone-800 text-stone-300">
                Sociability: {userCoord.x.toFixed(1)} | Solidarity: {userCoord.y.toFixed(1)}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-stone-200 mb-2 leading-snug">
              {quadInfo.title}
            </h4>
            <p className="text-stone-300 text-xs leading-relaxed mb-4">
              {quadInfo.description}
            </p>
          </div>

          <div className="border-t border-stone-900 pt-4 mt-2">
            <span className="text-[10px] font-mono text-stone-500 uppercase block mb-2 tracking-wider">
              {quadInfo.extraTitle}
            </span>
            {quadInfo.extraContent}
          </div>
        </div>

        {/* Manual Fine Tuning Sliders */}
        <div className="flex gap-4 mt-5">
          <div className="flex-1">
            <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1.5">Sociability (X-axis)</label>
            <input 
              type="range" 
              min="0.0" 
              max="10.0" 
              step="0.1" 
              value={userCoord.x} 
              onChange={(e) => setUserCoord({ ...userCoord, x: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 bg-stone-800 rounded-lg cursor-pointer h-1"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1.5">Solidarity (Y-axis)</label>
            <input 
              type="range" 
              min="0.0" 
              max="10.0" 
              step="0.1" 
              value={userCoord.y} 
              onChange={(e) => setUserCoord({ ...userCoord, y: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 bg-stone-800 rounded-lg cursor-pointer h-1"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}
