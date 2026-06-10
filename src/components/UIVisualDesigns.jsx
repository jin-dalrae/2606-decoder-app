import React, { useState, useEffect, useRef } from 'react';

// -------------------------------------------------------------
// 1. CONSTELLATION BACKGROUND
// -------------------------------------------------------------
export function ConstellationBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let particles = [];
    const particleCount = 80;
    const connectionDistance = 110;
    let mouse = { x: null, y: null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Gentle mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            // Push gently away
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 0.8;
            this.y += (dy / distance) * force * 0.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 235, 230, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid glows
      ctx.fillStyle = 'rgba(11, 15, 25, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update & Draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Draw lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(217, 119, 6, ${alpha})`; // Warm Gold connection lines
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw mouse line connection
      if (mouse.x !== null && mouse.y !== null) {
        particles.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius - 30) {
            const alpha = (1 - dist / (mouse.radius - 30)) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(245, 235, 230, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="constellation-wrapper">
      <canvas ref={canvasRef} className="constellation-canvas" />
      {/* Background ambient color highlights */}
      <div 
        className="constellation-glow-spot" 
        style={{ top: '15%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)' }} 
      />
      <div 
        className="constellation-glow-spot" 
        style={{ bottom: '10%', right: '15%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)' }} 
      />
    </div>
  );
}

// -------------------------------------------------------------
// 2. SCHEIN'S ICEBERG COMPONENT
// -------------------------------------------------------------
export function ScheinsIceberg() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [tensionMode, setTensionMode] = useState(false);

  const layers = [
    {
      id: 'artifacts',
      title: 'Artifacts & Behaviors',
      depth: 'Visible (Above Water)',
      description: 'The visible structures, processes, languages, dress codes, technology choices, and physical environments of the organization.',
      tensionDesc: 'Friction between new tooling/processes and legacy developer habits.',
      color: 'rgba(217, 119, 6, 0.8)', // Gold
      accentClass: 'border-amber-500',
      zOffsetNormal: 'translate3d(0, 0, 80px)',
      zOffsetHover: 'translate3d(0, 0, 120px)',
    },
    {
      id: 'espoused',
      title: 'Espoused Values',
      depth: 'Sub-Surface (Semi-Visible)',
      description: 'Declared goals, strategies, operating philosophies, and shared beliefs. What the team says they care about (e.g. "Security first").',
      tensionDesc: 'Friction when declared values (e.g., speed) contradict tacit priorities (e.g., safety checks).',
      color: 'rgba(245, 235, 230, 0.8)', // Sand
      accentClass: 'border-stone-300',
      zOffsetNormal: 'translate3d(0, 0, 0px)',
      zOffsetHover: 'translate3d(0, 0, 30px)',
    },
    {
      id: 'tacit',
      title: 'Tacit Assumptions',
      depth: 'Deep Ocean (Invisible Core)',
      description: 'Taken-for-granted beliefs, perceptions, thoughts, and feelings. Unwritten rules that govern behavior automatically without question.',
      tensionDesc: 'Core cultural resistance to change; fear of failure disguised as code reviews.',
      color: 'rgba(59, 130, 246, 0.8)', // Blue
      accentClass: 'border-blue-500',
      zOffsetNormal: 'translate3d(0, 0, -80px)',
      zOffsetHover: 'translate3d(0, 0, -40px)',
    }
  ];

  return (
    <div className="glass-panel w-full flex flex-col md:flex-row gap-8 items-center justify-between min-h-[500px]">
      <div className="flex-1 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-mono text-amber-500 tracking-wider">DIAGNOSTIC VISUALIZATION</span>
          <button 
            onClick={() => setTensionMode(!tensionMode)}
            className={`glass-btn px-4 py-1.5 text-xs font-mono transition-all duration-300 ${
              tensionMode 
                ? 'bg-red-950/40 text-red-400 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                : 'text-stone-400 border-stone-700 hover:text-amber-500'
            }`}
          >
            {tensionMode ? '● TENSION MODE ON' : '○ ACTIVATE TENSION'}
          </button>
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight">Schein's Culture Iceberg</h2>
        <p className="text-stone-400 text-sm mb-6 leading-relaxed">
          Hover over each layer to dissect how visible behaviors root themselves into deep, tacit assumptions. Toggle Tension Mode to identify structural friction.
        </p>

        {/* Dynamic Sidebar info depending on selection */}
        <div className="min-h-[160px] bg-black/40 border border-stone-800/80 rounded-xl p-4 transition-all duration-300">
          {activeLayer ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeLayer.color }} />
                <h3 className="text-base font-semibold m-0">{activeLayer.title}</h3>
              </div>
              <p className="text-xs font-mono text-amber-500/80 mb-2 uppercase">{activeLayer.depth}</p>
              <p className="text-stone-300 text-xs leading-relaxed mb-0">{activeLayer.description}</p>
              
              {tensionMode && (
                <div className="mt-3 pt-3 border-t border-red-900/40 text-xs text-red-400 leading-normal animate-pulse">
                  <strong className="font-mono text-red-500 uppercase block text-[10px] tracking-wider mb-1">Cultural Friction Point:</strong>
                  {activeLayer.tensionDesc}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[140px] text-stone-500 text-xs italic">
              Hover over the 3D layers to inspect cultural depth layers.
            </div>
          )}
        </div>
      </div>

      {/* 3D Iceberg Graphic Section */}
      <div className="flex-1 flex justify-center items-center py-12 relative select-none">
        {/* Dynamic Glowing Rings around the 3D stack */}
        {tensionMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 border-2 border-dashed border-red-500/10 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute w-[340px] h-[340px] border border-red-500/5 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          </div>
        )}

        <div className="perspective-container relative w-[300px] h-[340px] flex items-center justify-center">
          <div 
            className="relative w-[280px] h-[90px] transition-transform duration-700 ease-out"
            style={{ 
              transform: 'rotateX(60deg) rotateZ(-45deg)', 
              transformStyle: 'preserve-3d' 
            }}
          >
            {/* Render 3 Layers */}
            {layers.map((layer, index) => {
              const isHovered = activeLayer?.id === layer.id;
              const currentTransform = isHovered ? layer.zOffsetHover : layer.zOffsetNormal;
              
              return (
                <div
                  key={layer.id}
                  onMouseEnter={() => setActiveLayer(layer)}
                  onMouseLeave={() => setActiveLayer(null)}
                  className={`absolute w-full h-[85px] rounded-xl cursor-pointer flex flex-col justify-center items-center border p-4 transition-all duration-500 ease-out ${
                    tensionMode 
                      ? 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-slate-950/70' 
                      : isHovered 
                        ? 'border-amber-400 bg-slate-900/85 shadow-[0_15px_35px_rgba(0,0,0,0.6)]' 
                        : 'border-stone-800 bg-slate-950/60 shadow-[0_5px_20px_rgba(0,0,0,0.4)]'
                  }`}
                  style={{ 
                    transform: currentTransform,
                    transformStyle: 'preserve-3d',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                  }}
                >
                  {/* Internal Glow Text Element */}
                  <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase mb-1">
                    Layer 0{index + 1}
                  </span>
                  <span className={`text-sm font-semibold text-center tracking-wide ${isHovered ? 'text-amber-400' : 'text-stone-200'}`}>
                    {layer.title}
                  </span>

                  {/* Visual 3D side edge panel effects */}
                  <div 
                    className={`absolute left-0 bottom-0 top-0 w-[5px] origin-left rounded-l-md transition-all duration-300 ${
                      tensionMode 
                        ? 'bg-red-500' 
                        : isHovered 
                          ? 'bg-amber-400' 
                          : 'bg-stone-700'
                    }`} 
                    style={{ transform: 'rotateY(-90deg) translateZ(0px)' }}
                  />
                  <div 
                    className={`absolute right-0 bottom-0 left-0 h-[5px] origin-bottom rounded-b-md transition-all duration-300 ${
                      tensionMode 
                        ? 'bg-red-600' 
                        : isHovered 
                          ? 'bg-amber-500' 
                          : 'bg-stone-850'
                    }`} 
                    style={{ transform: 'rotateX(-90deg) translateZ(0px)' }}
                  />
                </div>
              );
            })}

            {/* Vertical Connector Rays / Tension Pillars */}
            <div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-[160px] pointer-events-none transition-all duration-500 ${
                tensionMode 
                  ? 'bg-gradient-to-b from-red-500 via-orange-500 to-red-600 opacity-60 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                  : 'bg-gradient-to-b from-amber-500/20 via-stone-700/10 to-blue-500/20 opacity-30'
              }`}
              style={{ transform: 'translate3d(0, 0, -80px) rotateX(-90deg)', height: '220px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. GOFFEE-JONES GRID COMPONENT
// -------------------------------------------------------------
export function GoffeeJonesGrid() {
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [userCoord, setUserCoord] = useState({ x: 2.2, y: 3.1 }); // Default custom organization position
  const containerRef = useRef(null);

  const quadrants = [
    {
      id: 'communal',
      name: 'Communal',
      xRange: 'High Sociability',
      yRange: 'High Solidarity',
      description: 'Friendly, team-oriented, and shares a deep devotion to tasks. Individuals get along very well, but conformity can suppress dissent.',
      accent: 'rgba(16, 185, 129, 1)', // Green
      fill: 'rgba(16, 185, 129, 0.04)',
      hoverFill: 'rgba(16, 185, 129, 0.08)',
      x: 200, y: 0, width: 200, height: 200
    },
    {
      id: 'mercenary',
      name: 'Mercenary',
      xRange: 'Low Sociability',
      yRange: 'High Solidarity',
      description: 'Highly goal-oriented, productive, and focused on tasks. Personal relationships are secondary to performance. Can feel cold and ruthless.',
      accent: 'rgba(239, 68, 68, 1)', // Red
      fill: 'rgba(239, 68, 68, 0.04)',
      hoverFill: 'rgba(239, 68, 68, 0.08)',
      x: 0, y: 0, width: 200, height: 200
    },
    {
      id: 'fragmented',
      name: 'Fragmented',
      xRange: 'Low Sociability',
      yRange: 'Low Solidarity',
      description: 'High autonomy and individual focus. Weak personal ties and minimal alignment around shared objectives. Common in remote workforces or gig models.',
      accent: 'rgba(107, 114, 128, 1)', // Slate
      fill: 'rgba(107, 114, 128, 0.04)',
      hoverFill: 'rgba(107, 114, 128, 0.08)',
      x: 0, y: 200, width: 200, height: 200
    },
    {
      id: 'networked',
      name: 'Networked',
      xRange: 'High Sociability',
      yRange: 'Low Solidarity',
      description: 'High friendliness and socialization, but low operational agreement. People enjoy working together, but consensus-seeking slows decision speeds.',
      accent: 'rgba(217, 119, 6, 1)', // Gold
      fill: 'rgba(217, 119, 6, 0.04)',
      hoverFill: 'rgba(217, 119, 6, 0.08)',
      x: 200, y: 200, width: 200, height: 200
    }
  ];

  // Map user click coordinates to mathematical grid scale (-5 to +5)
  const handleGridClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Scale mathematically from svg space [0, 400] to [-5, 5]
    const mathX = parseFloat((((clickX / rect.width) * 10) - 5).toFixed(1));
    // Y is inverted in screen space
    const mathY = parseFloat((5 - ((clickY / rect.height) * 10)).toFixed(1));
    
    setUserCoord({ x: mathX, y: mathY });
  };

  // Map math coordinate back to SVG coordinate space
  const svgX = ((userCoord.x + 5) / 10) * 400;
  const svgY = ((5 - userCoord.y) / 10) * 400;

  // Determine current quadrant of the user marker
  const currentQuadId = 
    userCoord.x >= 0 && userCoord.y >= 0 ? 'communal' :
    userCoord.x < 0 && userCoord.y >= 0 ? 'mercenary' :
    userCoord.x < 0 && userCoord.y < 0 ? 'fragmented' : 'networked';

  const currentQuad = quadrants.find(q => q.id === currentQuadId);

  return (
    <div className="glass-panel w-full flex flex-col lg:flex-row gap-8 items-center justify-between">
      {/* 2x2 Interactive SVG Grid */}
      <div className="flex-1 flex flex-col items-center">
        <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
          Interactive Cultural Mapping
        </span>
        <div 
          ref={containerRef}
          onClick={handleGridClick}
          className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] bg-slate-950/70 border border-stone-800 rounded-xl overflow-hidden cursor-crosshair shadow-2xl"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Background Grid Lines & Quadrants */}
            {quadrants.map((q) => {
              const isHovered = selectedQuadrant?.id === q.id;
              const isCurrent = currentQuadId === q.id;
              return (
                <rect
                  key={q.id}
                  x={q.x}
                  y={q.y}
                  width={q.width}
                  height={q.height}
                  fill={isHovered ? q.hoverFill : q.fill}
                  stroke="rgba(255, 255, 255, 0.02)"
                  strokeWidth="1"
                  className="transition-colors duration-300"
                  onMouseEnter={() => setSelectedQuadrant(q)}
                  onMouseLeave={() => setSelectedQuadrant(null)}
                />
              );
            })}

            {/* Subtle Grid Lines (Steps of 1 unit) */}
            {[40, 80, 120, 160, 240, 280, 320, 360].map((coord) => (
              <React.Fragment key={coord}>
                <line x1={coord} y1="0" x2={coord} y2="400" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                <line x1="0" y1={coord} x2="400" y2={coord} stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
              </React.Fragment>
            ))}

            {/* Central Main Axes */}
            <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
            <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />

            {/* Quadrant Name Labels inside Grid */}
            <text x="380" y="30" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="Space Grotesk" fontWeight="600" textAnchor="end">COMMUNAL</text>
            <text x="20" y="30" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="Space Grotesk" fontWeight="600" textAnchor="start">MERCENARY</text>
            <text x="20" y="380" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="Space Grotesk" fontWeight="600" textAnchor="start">FRAGMENTED</text>
            <text x="380" y="380" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="Space Grotesk" fontWeight="600" textAnchor="end">NETWORKED</text>

            {/* Axis Label Arrows and Text */}
            <text x="390" y="193" fill="#9ca3af" fontSize="9" fontFamily="Space Mono" textAnchor="end">SOCIABILITY (Friendliness) →</text>
            <text x="10" y="212" fill="#9ca3af" fontSize="9" fontFamily="Space Mono" textAnchor="start">← SOCIABILITY (Low)</text>
            <text x="208" y="15" fill="#9ca3af" fontSize="9" fontFamily="Space Mono" textAnchor="start">SOLIDARITY (Task Consensus) ↑</text>
            <text x="208" y="390" fill="#9ca3af" fontSize="9" fontFamily="Space Mono" textAnchor="start">↓ SOLIDARITY (Low)</text>

            {/* User Draggable / Clicked Coordinate Marker */}
            <g transform={`translate(${svgX}, ${svgY})`} className="cursor-pointer">
              {/* Outer pulsing ring */}
              <circle r="12" fill="none" stroke={currentQuad.accent} strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Core Dot */}
              <circle r="5" fill={currentQuad.accent} shadow="0 0 10px rgba(255,255,255,0.8)" />
            </g>
          </svg>
        </div>
        <span className="text-[11px] text-stone-500 font-mono mt-3">Click anywhere on the grid to relocate your coordinate</span>
      </div>

      {/* Info Display & Explanations */}
      <div className="flex-1 max-w-lg">
        <h2 className="text-2xl font-bold mb-2">Goffee-Jones Double-S (2x2 Grid)</h2>
        <p className="text-stone-400 text-sm mb-6">
          Categorizes organizational culture according to two axes: <strong>Sociability</strong> (emotional warmth, friendships, empathy) and <strong>Solidarity</strong> (alignment, strict task agreement, shared business objectives).
        </p>

        {/* Selected or Calculated Quadrant Card */}
        <div className="bg-black/30 border border-stone-800 rounded-xl p-5 mb-4 relative overflow-hidden">
          {/* Accent Line */}
          <div 
            className="absolute top-0 left-0 bottom-0 w-1 transition-all duration-500" 
            style={{ backgroundColor: currentQuad.accent }}
          />

          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold m-0 text-white">{currentQuad.name} Culture</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-stone-300">
              [{userCoord.x >= 0 ? '+' : ''}{userCoord.x}, {userCoord.y >= 0 ? '+' : ''}{userCoord.y}]
            </span>
          </div>

          <div className="flex gap-4 text-xs font-mono mb-3 text-stone-400">
            <div>
              <span>Sociability: </span>
              <strong className={userCoord.x >= 0 ? 'text-emerald-400' : 'text-stone-300'}>
                {userCoord.x >= 0 ? 'High' : 'Low'}
              </strong>
            </div>
            <div>
              <span>Solidarity: </span>
              <strong className={userCoord.y >= 0 ? 'text-emerald-400' : 'text-stone-300'}>
                {userCoord.y >= 0 ? 'High' : 'Low'}
              </strong>
            </div>
          </div>

          <p className="text-stone-300 text-xs leading-relaxed mb-4">
            {currentQuad.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="border border-stone-850 p-2.5 rounded bg-stone-900/40">
              <span className="text-emerald-400 block font-semibold mb-1">STRENGTHS</span>
              <span className="text-stone-400">
                {currentQuadId === 'communal' && 'Incredible alignment, high morale, unified effort.'}
                {currentQuadId === 'mercenary' && 'Highly efficient execution, logical, no politics.'}
                {currentQuadId === 'fragmented' && 'Autonomous, focus on deep individual tasks.'}
                {currentQuadId === 'networked' && 'Creative exchange, friendly peer review, supportive.'}
              </span>
            </div>
            <div className="border border-stone-850 p-2.5 rounded bg-stone-900/40">
              <span className="text-red-400 block font-semibold mb-1">RISKS</span>
              <span className="text-stone-400">
                {currentQuadId === 'communal' && 'Groupthink, hostile to changes, excludes others.'}
                {currentQuadId === 'mercenary' && 'Extreme burnout, zero empathy, high churn rate.'}
                {currentQuadId === 'fragmented' && 'Lack of common vision, isolated working silos.'}
                {currentQuadId === 'networked' && 'Endless committee meetings, slow path to ship.'}
              </span>
            </div>
          </div>
        </div>

        {/* Live coordinate editor */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[11px] font-mono text-stone-500 uppercase block mb-1">Sociability (-5 to +5)</label>
            <input 
              type="range" 
              min="-5" 
              max="5" 
              step="0.1" 
              value={userCoord.x} 
              onChange={(e) => setUserCoord({ ...userCoord, x: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 bg-stone-800 rounded-lg cursor-pointer h-1"
            />
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-mono text-stone-500 uppercase block mb-1">Solidarity (-5 to +5)</label>
            <input 
              type="range" 
              min="-5" 
              max="5" 
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

// -------------------------------------------------------------
// 4. RADAR CHART COMPONENT (5 DIMENSIONS)
// -------------------------------------------------------------
export function RadarChart() {
  // 5 Cultural Dimensions of Anthropic / Custom Team vs Industry Benchmark
  const [anthropicValues, setAnthropicValues] = useState({
    innovation: 4.8,
    solidarity: 4.2,
    sociability: 3.9,
    customerFocus: 4.5,
    agility: 4.7
  });

  const industryAverage = {
    innovation: 3.2,
    solidarity: 3.5,
    sociability: 3.1,
    customerFocus: 3.8,
    agility: 3.4
  };

  const dimensions = [
    { key: 'innovation', label: 'Innovation & Risk' },
    { key: 'solidarity', label: 'Solidarity & Alignment' },
    { key: 'sociability', label: 'Belonging & Warmth' },
    { key: 'customerFocus', label: 'Customer Focus' },
    { key: 'agility', label: 'Learning & Agility' }
  ];

  const size = 320;
  const center = size / 2;
  const rMax = 120; // Maximum radius

  // Math translation function: given value (0 to 5) and index, compute (x, y) coordinates
  const getCoordinates = (value, index) => {
    const angle = (Math.PI * 2 / 5) * index - Math.PI / 2; // Subtract PI/2 to start pointing straight UP
    const radius = (value / 5) * rMax;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Build the polygon points path string
  const getPathString = (dataObject) => {
    const coords = dimensions.map((d, index) => {
      const { x, y } = getCoordinates(dataObject[d.key], index);
      return `${x},${y}`;
    });
    return coords.join(' ');
  };

  const anthropicPoints = getPathString(anthropicValues);
  const industryPoints = getPathString(industryAverage);

  // Generate concentric polygon grid points for background (values 1 to 5)
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
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
        />
      );
    });
  };

  // Render text labels around vertices
  const renderLabels = () => {
    return dimensions.map((d, index) => {
      // Calculate a slightly further radius for label positions
      const angle = (Math.PI * 2 / 5) * index - Math.PI / 2;
      const x = center + (rMax + 24) * Math.cos(angle);
      const y = center + (rMax + 14) * Math.sin(angle);
      
      let anchor = "middle";
      if (Math.cos(angle) > 0.1) anchor = "start";
      if (Math.cos(angle) < -0.1) anchor = "end";

      return (
        <text
          key={d.key}
          x={x}
          y={y}
          fill="#9ca3af"
          fontSize="10"
          fontFamily="Space Grotesk"
          fontWeight="500"
          textAnchor={anchor}
        >
          {d.label}
        </text>
      );
    });
  };

  // Render radial connector lines
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
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="1"
        />
      );
    });
  };

  return (
    <div className="glass-panel w-full flex flex-col lg:flex-row gap-8 items-center justify-between">
      {/* Dynamic Polygon SVG */}
      <div className="flex-1 flex justify-center items-center relative py-6">
        <svg viewBox="0 0 320 320" className="w-[300px] h-[300px] drop-shadow-2xl">
          {/* Background Concentric Polygons */}
          {renderBackgroundPolygons()}

          {/* Radial Spokes */}
          {renderRadarSpokes()}

          {/* Scale Axis numbers */}
          {[1, 2, 3, 4, 5].map((scale) => {
            const { y } = getCoordinates(scale, 0); // straight up
            return (
              <text key={scale} x={center + 5} y={y + 3} fill="rgba(255, 255, 255, 0.2)" fontSize="8" fontFamily="Space Mono">
                {scale}
              </text>
            );
          })}

          {/* Labels */}
          {renderLabels()}

          {/* Industry Average Polygon (Greenish Blue dashed overlay) */}
          <polygon
            points={industryPoints}
            fill="rgba(59, 130, 246, 0.05)"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            className="radar-industry"
          />

          {/* Anthropic / Custom Org Polygon (Translucent Glowing Gold) */}
          <polygon
            points={anthropicPoints}
            fill="rgba(217, 119, 6, 0.25)"
            stroke="#D97706"
            strokeWidth="2.5"
            className="radar-anthropic transition-all duration-300"
          />

          {/* Anthropic vertices marker dots */}
          {dimensions.map((d, index) => {
            const { x, y } = getCoordinates(anthropicValues[d.key], index);
            return (
              <circle
                key={d.key}
                cx={x}
                cy={y}
                r="4"
                fill="#FBBF24"
                stroke="#0B0F19"
                strokeWidth="1.5"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
      </div>

      {/* Adjusters & Benchmarks Panel */}
      <div className="flex-1 max-w-lg">
        <h2 className="text-2xl font-bold mb-2">5-D Cultural Radar Chart</h2>
        <p className="text-stone-400 text-sm mb-6">
          Compare organization performance metrics against the industry average. Modify the sliders below to view how shifts in specific vectors shape the overall cultural signature.
        </p>

        {/* Legend */}
        <div className="flex gap-6 mb-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 bg-amber-500 inline-block" />
            <span className="text-stone-200">Our Organization</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 border-t border-dashed border-blue-500 inline-block" />
            <span className="text-stone-400">Industry Average</span>
          </div>
        </div>

        {/* Sliders container */}
        <div className="flex flex-col gap-3.5">
          {dimensions.map((d) => (
            <div key={d.key} className="flex flex-col">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-stone-300">{d.label}</span>
                <span className="font-mono text-amber-500 font-semibold">{anthropicValues[d.key].toFixed(1)} / 5.0</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={anthropicValues[d.key]}
                onChange={(e) => setAnthropicValues({ ...anthropicValues, [d.key]: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 bg-stone-850 h-1 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. MAIN PRESET DEMO / SHOWCASE EXPORT
// -------------------------------------------------------------
export default function UIVisualDesigns() {
  return (
    <div className="flex flex-col gap-16 py-8">
      <ConstellationBackground />
      
      {/* Decorative Title Banner */}
      <header className="text-center max-w-2xl mx-auto mb-4">
        <span className="text-xs font-mono text-amber-500 tracking-widest uppercase block mb-3">
          ANALYTICAL INTERFACES
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          Culture Decoder UI Kit
        </h1>
        <p className="text-stone-400 text-sm leading-relaxed">
          Premium dark-theme visual components constructed for interactive organizational diagnostics. Native SVG calculations and performance-optimized CSS animations.
        </p>
      </header>

      {/* Grid containing Iceberg & Double S */}
      <section className="flex flex-col gap-12">
        <div>
          <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-4">
            Component 01 / Three-Dimensional Depth Stack
          </h3>
          <ScheinsIceberg />
        </div>

        <div className="grid-cols-1 grid lg:grid-cols-1 gap-12">
          <div>
            <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-4">
              Component 02 / Quadrant Typology Mapping
            </h3>
            <GoffeeJonesGrid />
          </div>

          <div>
            <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-4">
              Component 03 / Vector Analysis polygon
            </h3>
            <RadarChart />
          </div>
        </div>
      </section>

      {/* Footer Print Info Block */}
      <footer className="border-t border-stone-900 pt-8 text-center text-xs text-stone-600 font-mono flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>© 2026 ANTIGRAVITY RESEARCH SYSTEMS</span>
        <span className="hidden sm:inline-block">●</span>
        <span>PRESS [CMD+P] OR [CTRL+P] TO TEST HIGH-CONTRAST STATIC PRINT STYLING</span>
      </footer>
    </div>
  );
}
