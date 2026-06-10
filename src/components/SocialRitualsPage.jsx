import React, { useState, useEffect, useRef } from 'react';
import EvidenceHub from './EvidenceHub';

// ─── Utility: scroll-triggered animated counter ──────────────────────────────
function AnimatedNumber({ target, suffix = '', prefix = '', decimals = 0, duration = 1600 }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const pct = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (pct < 1) requestAnimationFrame(tick);
      else setValue(target);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration, decimals]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? value.toFixed(decimals) : Math.round(value)}{suffix}
    </span>
  );
}

// ─── Interactive SVG Sandbox & Workspace Map ────────────────────────────────
const WORKSPACE_ZONES = {
  greenhouse: {
    title: 'The Greenhouse Workspace & Library',
    focus: 'Physical Workspace Design (Howard St. SF)',
    color: 'var(--brand-primary)',
    body: 'Anthropic\'s head office is designed to foster a botanical library atmosphere. Extensive indoor plantings (monsteras, fiddle-leaf figs, pothos) and wood-paneled meeting greenhouses reduce sensory stimulation, grounding researchers physically during intense pre-training sprints.',
  },
  vend: {
    title: 'Project Vend: Autonomous Snack Shop',
    focus: 'Empirical Agent Sandbox Experiment (May 2025)',
    color: 'var(--accent-orange)',
    body: 'A physical convenience kiosk controlled by a custom model named "Claudius." Claudius autonomously managed inventory and prices. It was found to underprice premium snacks to maximize user happiness, and bundle obsolete stock when budget constraints were introduced. Employees jailbroke it for free energy drinks, turning safety testing into a playful office ritual.',
  },
  deal: {
    title: 'Project Deal: Multi-Agent Marketplace',
    focus: 'Empirical Agent Market Sandbox Experiment (April 2026)',
    color: 'var(--brand-primary-dark)',
    body: 'A virtual negotiation market where employees and Claude agents traded resources. Advanced models (Sonnet 3.5 / Opus 3) extracted up to 35% higher utility margins through anchoring, strategic delay tactics, and concealing utility curves, highlighting how advanced agents behave as active economic actors rather than passive chat assistants.',
  },
  brand: {
    title: 'Claude Digital Brand Studio',
    focus: 'Humanities & Academic Interaction Design',
    color: 'var(--brand-primary)',
    body: 'Claude\'s visual interface, styled under Jenny Wen, deliberately avoids cold, neon sci-fi themes. Earthy tones (unfired clay background) and elegant serif typography (Lora, PP Editorial) mimic paper, framing Claude as a scholarly research partner, reinforcing HHH (helpful, honest, harmless) espoused values.',
  },
};

function WorkspaceZonalMap() {
  const [selectedZone, setSelectedZone] = useState('greenhouse');
  const current = WORKSPACE_ZONES[selectedZone];

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>PHYSICAL & DIGITAL SANDBOX MAP</span>
        <h3 style={styles.cardTitle}>Howard Street Campus Zonal Map</h3>
        <p style={styles.cardDesc}>
          Click areas on the layout to inspect office experiments, spatial biophilia, and UI brand aesthetics.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* SVG Office Campus Map */}
        <div style={{ flexShrink: 0, background: 'var(--bg-muted)', padding: '16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-default)' }}>
          <svg width="320" height="200" viewBox="0 0 320 200" style={{ overflow: 'visible' }}>
            {/* Campus Floor Outline */}
            <rect x="10" y="10" width="300" height="180" rx="10" fill="none" stroke="var(--border-default)" strokeWidth="1.5" />
            
            {/* Inner partitions */}
            <line x1="160" y1="10" x2="160" y2="190" stroke="var(--border-default)" strokeWidth="0.75" strokeDasharray="4,4" />
            <line x1="10" y1="100" x2="310" y2="100" stroke="var(--border-default)" strokeWidth="0.75" strokeDasharray="4,4" />

            {/* Greenhouse Library Zone */}
            <g onClick={() => setSelectedZone('greenhouse')} style={{ cursor: 'pointer' }}>
              <rect x="20" y="20" width="130" height="70" rx="6"
                fill={selectedZone === 'greenhouse' ? 'rgba(20,87,204,0.06)' : 'var(--bg-default)'}
                stroke={selectedZone === 'greenhouse' ? 'var(--brand-primary)' : 'var(--border-default)'} strokeWidth="1.5" />
              <text x="85" y="50" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>Greenhouse Library</text>
              <text x="85" y="62" textAnchor="middle" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>🌿 Biophilic Lounge</text>
            </g>

            {/* Brand/Typography Studio */}
            <g onClick={() => setSelectedZone('brand')} style={{ cursor: 'pointer' }}>
              <rect x="170" y="20" width="130" height="70" rx="6"
                fill={selectedZone === 'brand' ? 'rgba(8,25,92,0.06)' : 'var(--bg-default)'}
                stroke={selectedZone === 'brand' ? 'var(--brand-primary-dark)' : 'var(--border-default)'} strokeWidth="1.5" />
              <text x="235" y="50" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>Typography & Brand</text>
              <text x="235" y="62" textAnchor="middle" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>✍️ Serif/Clay Design</text>
            </g>

            {/* Project Vend Zone */}
            <g onClick={() => setSelectedZone('vend')} style={{ cursor: 'pointer' }}>
              <rect x="20" y="110" width="130" height="70" rx="6"
                fill={selectedZone === 'vend' ? 'var(--accent-red-wash)' : 'var(--bg-default)'}
                stroke={selectedZone === 'vend' ? 'var(--accent-orange)' : 'var(--border-default)'} strokeWidth="1.5" />
              <text x="85" y="140" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>Project Vend Sandbox</text>
              <text x="85" y="152" textAnchor="middle" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>🏪 Autonomous Shop</text>
            </g>

            {/* Project Deal Zone */}
            <g onClick={() => setSelectedZone('deal')} style={{ cursor: 'pointer' }}>
              <rect x="170" y="110" width="130" height="70" rx="6"
                fill={selectedZone === 'deal' ? 'rgba(20,87,204,0.06)' : 'var(--bg-default)'}
                stroke={selectedZone === 'deal' ? 'var(--brand-primary)' : 'var(--border-default)'} strokeWidth="1.5" />
              <text x="235" y="140" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>Project Deal Market</text>
              <text x="235" y="152" textAnchor="middle" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>🤝 Agent Negotiations</text>
            </g>
          </svg>
        </div>

        {/* Selected zone details card */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{
            padding: '20px', borderRadius: 'var(--r-md)',
            background: 'var(--bg-muted)',
            border: '1px solid var(--border-default)',
            borderLeft: `4px solid ${current.color}`,
            transition: 'var(--transition-smooth)',
          }}>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: current.color, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
              {current.focus}
            </span>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', fontFamily: 'var(--font-sans)' }}>
              {current.title}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
              {current.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Existential Burnout Dynamics Dial / Slider ──────────────────────────────
function ExistentialBurnoutSlider() {
  const [urgency, setUrgency] = useState(2); // 1 to 5 scale

  const getUrgencyMetrics = (val) => {
    switch (val) {
      case '1':
        return {
          label: 'EVALUATION & CALM (Post-Launch)',
          solidarity: 65,
          sociability: 85,
          wlb: 90,
          stigma: 'Rest and time-off are actively respected. Sibling resolve-by-consensus is standard.',
          color: 'var(--brand-primary)',
        };
      case '2':
        return {
          label: 'NORMAL OPERATIONS (Empirical Safety Work)',
          solidarity: 78,
          sociability: 88,
          wlb: 72,
          stigma: 'Weekend Slack replies are typical but not enforced. Office green zones are quiet.',
          color: 'var(--brand-primary)',
        };
      case '3':
        return {
          label: 'COMPETITOR ANNOUNCEMENT SPRINT',
          solidarity: 88,
          sociability: 88,
          wlb: 50,
          stigma: 'Late-night checkins begin. PM requirements are secondary to capability reviews.',
          color: 'var(--brand-primary-dark)',
        };
      case '4':
        return {
          label: 'FRANTIC PRE-TRAINING CLUSTER RUN',
          solidarity: 94,
          sociability: 85,
          wlb: 30,
          stigma: '24/7 on-call rotation. Rest is pushed aside. High collective guilt if logging off.',
          color: 'var(--accent-orange)',
        };
      case '5':
      default:
        return {
          label: 'EXISTENTIAL RACE (AGI Proximity Sprint)',
          solidarity: 98,
          sociability: 80,
          wlb: 12,
          stigma: 'Boundary collapse. Logging off at 6 PM is culturally seen as a moral safety failure.',
          color: 'var(--accent-red)',
        };
    }
  };

  const metrics = getUrgencyMetrics(urgency.toString());

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>GOFFEE-JONES DYNAMICS SHIFT</span>
        <h3 style={styles.cardTitle}>Existential Burnout Dynamics Dial</h3>
        <p style={styles.cardDesc}>
          Adjust the slider to simulate how intensifying existential urgency (e.g. pre-training sprints) shifts employee behavior and collapses personal boundaries.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Slider Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', uppercase: true, letterSpacing: '0.04em' }}>
              AGI Timeline / Sprint Urgency Level:
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: metrics.color, fontFamily: 'var(--font-mono)' }}>
              LEVEL {urgency} / 5
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={urgency}
            onChange={(e) => setUrgency(parseInt(e.target.value))}
            style={{
              width: '100%',
              accentColor: metrics.color,
              cursor: 'pointer',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: 'var(--bg-muted)',
            }}
          />
          <div style={{ fontSize: '12px', fontWeight: 700, color: metrics.color, marginTop: '4px', textAlign: 'center', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
            {metrics.label}
          </div>
        </div>

        {/* Dynamic Metrics Output */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {/* Solidarity */}
          <div style={{ padding: '16px', borderRadius: 'var(--r-md)', background: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Solidarity (Alignment)</span>
              <strong style={{ color: 'var(--brand-primary)' }}>{metrics.solidarity}%</strong>
            </div>
            <div style={{ height: '4px', background: 'var(--bg-default)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${metrics.solidarity}%`, background: 'var(--brand-primary)', transition: 'width 0.2s ease' }} />
            </div>
          </div>

          {/* Sociability */}
          <div style={{ padding: '16px', borderRadius: 'var(--r-md)', background: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Sociability (Warmth)</span>
              <strong style={{ color: 'var(--brand-primary-dark)' }}>{metrics.sociability}%</strong>
            </div>
            <div style={{ height: '4px', background: 'var(--bg-default)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${metrics.sociability}%`, background: 'var(--brand-primary-dark)', transition: 'width 0.2s ease' }} />
            </div>
          </div>

          {/* WLB Integrity */}
          <div style={{ padding: '16px', borderRadius: 'var(--r-md)', background: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>WLB Boundary Integrity</span>
              <strong style={{ color: metrics.wlb < 40 ? 'var(--accent-red)' : 'var(--brand-primary)' }}>{metrics.wlb}%</strong>
            </div>
            <div style={{ height: '4px', background: 'var(--bg-default)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${metrics.wlb}%`, background: metrics.wlb < 40 ? 'var(--accent-red)' : 'var(--brand-primary)', transition: 'width 0.2s ease' }} />
            </div>
          </div>
        </div>

        {/* Dynamic Social Impact explanation */}
        <div style={{
          padding: '16px 18px', borderRadius: 'var(--r-md)',
          background: 'var(--bg-muted)',
          border: '1px solid var(--border-default)',
          borderLeft: `4px solid ${metrics.color}`,
          transition: 'all 0.2s ease',
        }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: metrics.color, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '5px', fontWeight: 700 }}>
            Culture Loop & Social Stigma
          </span>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
            {metrics.stigma}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Tension Core: Social & Rituals ─────────────────────────────────────────
const TENSION_DATA = [
  {
    espoused: 'Empathetic "kind and direct" feedback',
    espousedDetail: 'The sibling co-founder model and flat structures promote low-ego discussions and mutual respect.',
    tacit: '"Consensus loops delay hard execution"',
    tacitDetail: 'Without strict hierarchies, technical alignment debates can stretch for weeks as teams struggle to reach a unified consensus.',
    severity: 'medium',
  },
  {
    espoused: 'Unlimited, self-directed PTO',
    espousedDetail: 'Corporate communications encourage rest to sustain long-term research performance.',
    tacit: '"Existential threat breeds moral overwork"',
    tacitDetail: 'The shared belief that models carry existential risks turns logging off at 6 PM into a personal source of guilt. Rest is perceived as a lack of alignment.',
    severity: 'critical',
  },
  {
    espoused: 'Scholarly, bookish user branding',
    espousedDetail: 'Claude\'s clay tones and serif layout frame it as an ethical, library-like assistant for scholars.',
    tacit: '"Extractive Panama scraping project"',
    tacitDetail: 'Behind the calm design, data acquisition runs aggressively, including scanning and destroying copyright books (Project Panama) to avoid liability.',
    severity: 'critical',
  },
  {
    espoused: 'Biophilic office greenhouse design',
    espousedDetail: 'Lush greenery and monstera plants create a calm SF campus to reduce workplace stress.',
    tacit: '"Greenhouses mask pre-training alarms"',
    tacitDetail: 'The beautiful environment hides the high-intensity reality of Pre-training cluster shifts and 24/7 on-call schedules.',
    severity: 'high',
  },
];

const SEVERITY_COLORS = { high: 'var(--accent-orange)', critical: 'var(--accent-red)', medium: 'var(--brand-primary)' };
const SEVERITY_LABELS = { high: 'HIGH TENSION', critical: 'CRITICAL TENSION', medium: 'MODERATE TENSION' };
const SEVERITY_WASH = { high: 'var(--accent-red-wash)', critical: 'var(--accent-red-wash)', medium: 'rgba(20,87,204,0.05)' };
const SEVERITY_BORDER = { high: 'var(--accent-red-border)', critical: 'var(--accent-red-border)', medium: 'rgba(20,87,204,0.15)' };

function TensionCore({ tensionMode }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = TENSION_DATA[activeIdx];
  const sevColor = SEVERITY_COLORS[current.severity];
  const wash = SEVERITY_WASH[current.severity];
  const border = SEVERITY_BORDER[current.severity];

  return (
    <div className={`glass-panel ${tensionMode ? 'glass-panel-glow-tension' : ''}`} style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>ESPOUSED VALUES vs. TACIT ASSUMPTIONS</span>
        <h3 style={styles.cardTitle}>Social & Rituals Tensions</h3>
        <p style={styles.cardDesc}>
          Contradictions between Anthropic\'s friendly academic persona and the high-burnout realities of the pre-training sprints.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
        {TENSION_DATA.map((t, i) => (
          <button key={i} onClick={() => setActiveIdx(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: 'var(--r-md)', textAlign: 'left', cursor: 'pointer',
              border: `1.5px solid ${activeIdx === i ? SEVERITY_COLORS[t.severity] : 'var(--border-default)'}`,
              background: activeIdx === i ? `${SEVERITY_COLORS[t.severity]}10` : 'transparent',
              transition: 'all 0.18s var(--ease-settle)',
            }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
              background: SEVERITY_COLORS[t.severity],
              boxShadow: activeIdx === i ? `0 0 0 3px ${SEVERITY_COLORS[t.severity]}30` : 'none',
            }} />
            <span style={{ fontSize: '12px', fontWeight: activeIdx === i ? 700 : 500, color: activeIdx === i ? SEVERITY_COLORS[t.severity] : 'var(--text-secondary)', flex: 1, lineHeight: 1.3, fontFamily: 'var(--font-sans)' }}>
              {t.espoused}
            </span>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: SEVERITY_COLORS[t.severity], fontWeight: 700, flexShrink: 0, letterSpacing: '0.04em' }}>
              {SEVERITY_LABELS[t.severity]}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div style={{
          padding: '20px', borderRadius: 'var(--r-md)',
          background: 'var(--bg-muted)', border: '1px solid var(--border-default)',
          borderTop: '3px solid var(--brand-primary)',
        }}>
          <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            WHAT ANTHROPIC SAYS
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.3, fontFamily: 'var(--font-sans)' }}>
            "{current.espoused}"
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
            {current.espousedDetail}
          </p>
        </div>

        <div style={{
          padding: '20px', borderRadius: 'var(--r-md)',
          background: wash,
          border: `1px solid ${border}`,
          borderTop: `3px solid ${sevColor}`,
        }}>
          <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: sevColor, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            WHAT ACTUALLY HAPPENS
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: sevColor, marginBottom: '10px', lineHeight: 1.3, fontFamily: 'var(--font-sans)' }}>
            "{current.tacit}"
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
            {current.tacitDetail}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Schein Iceberg: Social & Rituals ───────────────────────────────────────
const SOCIAL_SCHEIN = {
  artifacts: [
    {
      name: 'Howard St. Office Biophilia (SF)',
      description: 'Mature green plants, monsteras, fiddle-leaf figs, and greenhouse lounge structures in the center of SF.',
      extra: 'Acts as a calming physical buffer, designed to lower stress levels and evoke a library-like intellectual atmosphere.'
    },
    {
      name: 'Claude Serifs & Earthy Tones',
      description: 'Claude\'s digital brand design: PP Editorial serifs and unfired clay paper backgrounds.',
      extra: 'Avoids futuristic clinical tech aesthetics, positioning Claude as a literary assistant and research partner.'
    },
    {
      name: 'Internal Agent Sandboxes (Project Vend/Deal)',
      description: 'Empirical convenience kiosk experiments and agent negotiation markets.',
      extra: 'Indicates the commitment to test agents in physical, micro-economic environments before release.'
    },
  ],
  espousedValues: [
    {
      name: 'Kind & direct communication',
      description: 'Flat organizational rules that reject toxic posturing, promoting mutual respect and active mentorship.',
      extra: 'Declared in company handbooks, aiming to separate research alignment discussions from corporate politics.'
    },
    {
      name: 'HHH (Helpful, Honest, Harmless) internal culture',
      description: 'Ensuring model alignment philosophies (HHH) are mirrored in employee relationships.',
      extra: 'Fosters high interpersonal trust, although it can lead to consensus delays during core conflicts.'
    },
  ],
  tacitAssumptions: [
    {
      name: 'Urgency justifies boundary collapse',
      description: 'The shared belief that because the alignment mission is existential, working weekends and holidays is required.',
      extra: 'Normalizes extreme hours, transforming the safety mission into a moral overwork trap.'
    },
    {
      name: 'Pragmatic necessity overrides bookish branding',
      description: 'The assumption that aggressive data gathering is acceptable if it allows Anthropic to compete.',
      extra: 'Visible in Projects like Panama (scanning/destroying books) which contradicts the public ethical branding.'
    },
  ]
};

function SocialScheinBreakdown() {
  const [activeTab, setActiveTab] = useState('artifacts');
  const [expanded, setExpanded] = useState(null);

  const items = SOCIAL_SCHEIN[activeTab];
  const meta  = TAB_META.find(t => t.id === activeTab);

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>SCHEIN\'S 3 LEVELS — SOCIAL CONTEXT</span>
        <h3 style={styles.cardTitle}>Social & Rituals Iceberg</h3>
        <p style={styles.cardDesc}>
          Explore how Anthropic\'s biophilic scholar persona operates from visible physical plants down to unwritten burnout assumptions.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {TAB_META.map(tab => (
          <button key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpanded(null); }}
            style={{
              padding: '10px 18px', borderRadius: 'var(--r-sm)', textAlign: 'left', cursor: 'pointer',
              border: `1.5px solid ${activeTab === tab.id ? tab.color : 'var(--border-default)'}`,
              background: activeTab === tab.id ? 'var(--bg-muted)' : 'transparent',
              transition: 'all 0.2s var(--ease-settle)',
            }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: activeTab === tab.id ? tab.color : 'var(--text-secondary)', lineHeight: 1.3, letterSpacing: '-0.01em', fontFamily: 'var(--font-sans)' }}>
              {tab.label}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {tab.sub}
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {items.map((item, i) => (
          <div key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              padding: '16px 18px', borderRadius: 'var(--r-md)', cursor: 'pointer',
              border: `1px solid ${expanded === i ? meta.color : 'var(--border-default)'}`,
              background: expanded === i ? 'var(--bg-muted)' : 'var(--bg-default)',
              transition: 'all 0.22s var(--ease-settle)',
              transform: expanded === i ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: expanded === i ? 'var(--shadow-card)' : '0 1px 4px rgba(0,0,0,0.05)',
            }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: expanded === i ? meta.color : 'var(--text-primary)', margin: 0, lineHeight: 1.35, flex: 1, fontFamily: 'var(--font-sans)' }}>
                {item.name}
              </h4>
              <span style={{
                fontSize: '14px', color: meta.color, opacity: 0.7, flexShrink: 0, lineHeight: 1,
                display: 'inline-block', transition: 'transform 0.2s ease',
                transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>▾</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55, fontFamily: 'var(--font-sans)' }}>
              {item.description}
            </p>
            {expanded === i && (
              <div style={{
                marginTop: '12px', padding: '10px 14px', borderRadius: 'var(--r-sm)',
                background: 'var(--bg-default)', borderLeft: `3px solid ${meta.color}`,
                animation: 'fadeSlideIn 0.18s ease',
              }}>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: meta.color, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '5px', fontWeight: 600 }}>
                  Cultural Significance
                </span>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55, fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>
                  {item.extra}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
const STATS = [
  { label: 'SF Plant Count',       value: 150, suffix: '+',   prefix: '',   decimals: 0, note: 'Biophilic Greens' },
  { label: 'Sandbox Projects',     value: 2,   suffix: '',    prefix: '',   decimals: 0, note: 'Vend & Deal' },
  { label: 'Weekly hours',         value: 55,  suffix: 'h+',  prefix: '',  decimals: 0, note: 'Pre-training average' },
  { label: 'HHH Peer Rating',      value: 9.2, suffix: '/10', prefix: '',   decimals: 1, note: 'Kind/Direct feedback' },
];

export default function SocialRitualsPage({ tensionMode }) {
  return (
    <div className="app-main-content">
      {/* Page header */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={styles.eyebrow}>Pillar 04 / Connection</span>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          Social & Rituals
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '680px', fontFamily: 'var(--font-sans)' }}>
          Observes the daily habits, spatial artifacts, experimental sandboxes, and visual interfaces that define the collaborative environment of the lab. We audit how the scholarly, "anti-hype" biophilic greenery and kind direct feedback loops mask and enable boundary collapse under pre-training sprint pressures.
        </p>
      </section>

      {/* Animated stats */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Key Social Metrics</span>
          <div style={styles.hairline} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
          {STATS.map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%)` }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: '-0.05em', lineHeight: 1 }}>
                <AnimatedNumber target={s.value} suffix={s.suffix} prefix={s.prefix} decimals={s.decimals} duration={1800 + i * 200} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '7px', letterSpacing: '-0.01em', fontFamily: 'var(--font-sans)' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workspace Zonal Map */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Campus Zonal Layout</span>
          <div style={styles.hairline} />
        </div>
        <WorkspaceZonalMap />
      </section>

      {/* Existential Burnout Dynamics Dial */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Urgency & Burnout Simulation</span>
          <div style={styles.hairline} />
        </div>
        <ExistentialBurnoutSlider />
      </section>

      {/* Tension Core */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Espoused vs. Tacit Tensions</span>
          <div style={styles.hairline} />
        </div>
        <TensionCore tensionMode={tensionMode} />
      </section>

      {/* Schein Iceberg Breakdown */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Schein\'s Iceberg Breakdown</span>
          <div style={styles.hairline} />
        </div>
        <SocialScheinBreakdown />
      </section>

      {/* Qualitative Evidence Feed */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Qualitative Evidence Feed</span>
          <div style={styles.hairline} />
        </div>
        <EvidenceHub tensionMode={tensionMode} pillar="social" />
      </section>
    </div>
  );
}

// Extend styles with layout helpers
const styles = {
  eyebrow: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--brand-primary)',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
  },
  cardTitle: {
    margin: '0 0 4px',
    fontFamily: 'var(--font-display)',
    fontSize: '1.3rem',
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
  },
  cardDesc: {
    margin: '4px 0 0',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  sectionDivider: {
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px',
  },
  sectionLabel: {
    fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)',
    whiteSpace: 'nowrap', fontWeight: 500,
  },
  hairline: {
    height: '1px', flexGrow: 1, backgroundColor: 'var(--border-default)',
  },
};

const TAB_META = [
  { id: 'artifacts',        label: 'Artifacts & Behaviors', sub: 'Visible Layer',   color: 'var(--brand-primary)' },
  { id: 'espousedValues',   label: 'Espoused Values',        sub: 'Declared Layer', color: 'var(--brand-primary-dark)' },
  { id: 'tacitAssumptions', label: 'Tacit Assumptions',      sub: 'Hidden Core',    color: 'var(--brand-primary-dark)' },
];
