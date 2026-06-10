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

// ─── Interactive SVG Governance Flow Diagram ───────────────────────────────
const GOVERNANCE_NODES = {
  trust: {
    title: 'Long-Term Benefit Trust (LTBT)',
    role: 'Legal Check on Management & Board Sourcing',
    color: 'var(--brand-primary)',
    body: 'A Delaware purpose trust holding all Class T Common Stock (voting rights, no dividends). As of early 2026, its power phase-in reached a majority (3 out of 5 seats) on Anthropic\'s Board. Trustees are financially disinterested (no equity) with staggered terms. Current trustees include Neil Buddy Shah (Chair), Richard Fontaine (CNAS CEO), and Mariano-Florentino Cuéllar (Carnegie Endowment President).',
  },
  board: {
    title: 'Board of Directors',
    role: 'Tripartite Fiduciary Balance',
    color: 'var(--brand-primary-dark)',
    body: 'Responsible for overseeing corporate affairs. Legally mandated under the Delaware Public Benefit Corporation (PBC) charter to balance shareholder wealth with public benefit (the safety mission) and user interests. This charter protects the board from investor lawsuits when they choose to delay capability releases or pause pre-training for safety reasons.',
  },
  shareholders: {
    title: 'Shareholders & Cloud Partners',
    role: 'Capital Investment & Override Failsafe',
    color: 'var(--brand-primary)',
    body: 'Venture investors (Series A-D, including Google\'s $2B and Amazon\'s $4B) hold equity. Stockholders can override or terminate the LTBT\'s voting power with a 75% Board vote + 75% outstanding Voting Common Stock. However, cloud partner shares are non-voting preferred, preventing Google or Amazon from unilaterally dismantling the trust.',
  },
  veto: {
    title: 'Safety Veto Pipeline (RSO & CEO)',
    role: 'Responsible Scaling Policy (RSP) Control',
    color: 'var(--accent-orange)',
    body: 'When models meet ASL-3 capability thresholds (CBRN weapons uplift, autonomous cyber exploit, internet replication), a veto workflow is triggered. ML safety researchers report capability uplifts to the Responsible Scaling Officer (RSO, Jared Kaplan) who drafts a Risk Report. The RSO and CEO hold joint authority to veto the release or approve it with hardware mitigations, notifying the Board & LTBT.',
  },
};

function GovernanceFlowDiagram() {
  const [selectedNode, setSelectedNode] = useState('board');
  const current = GOVERNANCE_NODES[selectedNode];

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>ORGANIZATIONAL CHECK & BALANCES</span>
        <h3 style={styles.cardTitle}>Interactive Governance Architecture</h3>
        <p style={styles.cardDesc}>
          Click nodes on the flowchart to inspect the flow of authority, legal shields, and veto loops that check commercial pressure.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* SVG Flow diagram */}
        <div style={{ flexShrink: 0, background: 'var(--bg-muted)', padding: '16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-default)' }}>
          <svg width="320" height="280" viewBox="0 0 320 280" style={{ overflow: 'visible' }}>
            {/* Connecting Arrows & Lines */}
            {/* LTBT to Board */}
            <path d="M 230 60 L 160 120" stroke="var(--border-light)" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
            <text x="175" y="80" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} transform="rotate(-40, 175, 80)">Electorate (Class T)</text>
            
            {/* Shareholders to Board */}
            <path d="M 90 60 L 160 120" stroke="var(--border-light)" strokeWidth="1.5" fill="none" />
            <text x="95" y="95" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} transform="rotate(40, 95, 95)">75% Override Loop</text>
            
            {/* Board to Veto */}
            <path d="M 160 120 L 160 210" stroke="var(--brand-primary-dark)" strokeWidth="2" fill="none" />
            <polygon points="160,215 156,207 164,207" fill="var(--brand-primary-dark)" />
            <text x="165" y="165" style={{ fontSize: '7.5px', fill: 'var(--brand-primary-dark)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>RSP Mandate</text>
            
            {/* Veto back to Board/LTBT (Report loop) */}
            <path d="M 230 220 C 290 220, 290 100, 230 60" stroke="var(--accent-orange)" strokeWidth="1" strokeDasharray="3,3" fill="none" />
            <text x="280" y="140" style={{ fontSize: '7px', fill: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>Escalation & Veto Log</text>

            {/* Nodes */}
            {/* Shareholders Node */}
            <g onClick={() => setSelectedNode('shareholders')} style={{ cursor: 'pointer' }}>
              <rect x="20" y="20" width="100" height="40" rx="6"
                fill={selectedNode === 'shareholders' ? 'rgba(20,87,204,0.06)' : 'var(--bg-default)'}
                stroke={selectedNode === 'shareholders' ? 'var(--brand-primary)' : 'var(--border-default)'} strokeWidth="1.5" />
              <text x="70" y="40" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>Shareholders</text>
              <text x="70" y="50" textAnchor="middle" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Capital Investment</text>
            </g>

            {/* LTBT Node */}
            <g onClick={() => setSelectedNode('trust')} style={{ cursor: 'pointer' }}>
              <rect x="200" y="20" width="100" height="40" rx="6"
                fill={selectedNode === 'trust' ? 'rgba(20,87,204,0.06)' : 'var(--bg-default)'}
                stroke={selectedNode === 'trust' ? 'var(--brand-primary)' : 'var(--border-default)'} strokeWidth="1.5" />
              <text x="250" y="40" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>Benefit Trust (LTBT)</text>
              <text x="250" y="50" textAnchor="middle" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Class T Trustee</text>
            </g>

            {/* Board of Directors Node */}
            <g onClick={() => setSelectedNode('board')} style={{ cursor: 'pointer' }}>
              <rect x="100" y="110" width="120" height="40" rx="8"
                fill={selectedNode === 'board' ? 'var(--accent-red-wash)' : 'var(--bg-default)'}
                stroke={selectedNode === 'board' ? 'var(--brand-primary-dark)' : 'var(--border-default)'} strokeWidth="2" />
              <text x="160" y="130" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 700, fill: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>Board of Directors</text>
              <text x="160" y="141" textAnchor="middle" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Tripartite Fiduciary</text>
            </g>

            {/* Safety Veto Node */}
            <g onClick={() => setSelectedNode('veto')} style={{ cursor: 'pointer' }}>
              <rect x="100" y="200" width="120" height="40" rx="8"
                fill={selectedNode === 'veto' ? 'var(--accent-red-wash)' : 'var(--bg-default)'}
                stroke={selectedNode === 'veto' ? 'var(--accent-orange)' : 'var(--border-default)'} strokeWidth="2" />
              <text x="160" y="220" textAnchor="middle" style={{ fontSize: '9.5px', fontWeight: 700, fill: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>RSO & CEO Veto Pipeline</text>
              <text x="160" y="231" textAnchor="middle" style={{ fontSize: '7px', fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>RSP v3.2 Evaluation</text>
            </g>
          </svg>
        </div>

        {/* Selected detail panel */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{
            padding: '20px', borderRadius: 'var(--r-md)',
            background: 'var(--bg-muted)',
            border: '1px solid var(--border-default)',
            borderLeft: `4px solid ${current.color}`,
            transition: 'var(--transition-smooth)',
          }}>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: current.color, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
              {current.role}
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

// ─── Capital-Compute Mortgage Escalator ─────────────────────────────────────
const COMPUTE_DATA = [
  { label: 'Google Pre-training Investment', amount: 2, scale: 'B', color: 'var(--brand-primary)', note: 'Equity + cloud credits' },
  { label: 'Amazon Strategic Partnership',  amount: 4, scale: 'B', color: 'var(--brand-primary-dark)', note: 'Capacity & pre-training credits' },
  { label: '10-Year Cloud Compute Liability', amount: 100, scale: 'B+', color: 'var(--accent-orange)', note: 'AWS/GCP pre-commitments' },
];

function ComputeMortgageEscalator() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setAnimated(true), 200); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={styles.eyebrow}>COMPUTE INFRASTRUCTURE LIABILITIES</span>
        <h3 style={styles.cardTitle}>The Capital-Compute Trap</h3>
        <p style={styles.cardDesc}>
          Anthropic\'s massive compute dependency. Google and Amazon funding structures function as compute mortgages, committing the lab to $100B+ in pre-training capacity fees that force monetization rushes.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {COMPUTE_DATA.map((d, i) => {
          const w = (d.amount / 100) * 100;
          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                  {d.label}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: d.color, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                  ${d.amount}{d.scale}
                </span>
              </div>
              <div style={{ height: '18px', background: 'var(--bg-muted)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: animated ? `${w}%` : '0%',
                  background: d.color,
                  borderRadius: 'var(--r-sm)',
                  transition: `width ${0.7 + i * 0.15}s var(--ease-settle)`,
                }} />
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '4px' }}>
                {d.note}
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{
        marginTop: '20px', padding: '14px 18px', borderRadius: 'var(--r-md)',
        background: 'var(--accent-red-wash)', border: '1px solid var(--accent-red-border)',
        fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'var(--font-sans)'
      }}>
        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
          Strategic Reality & RSP Dilution:
        </strong>
        Because pre-training requires exponential compute budgets, Anthropic\'s charter protection is heavily pressured by cloud debt. In transition to **RSP v3.0+**, the lab backed away from unilateral hard-pause commitments, opting for flexible guardrails to prevent falling into commercial irrelevance compared to OpenAI.
      </div>
    </div>
  );
}

// ─── Tension Core: Power & Governance ───────────────────────────────────────
const TENSION_DATA = [
  {
    espoused: 'Empirical safety-first vetoes',
    espousedDetail: 'The Responsible Scaling Policy establishes safety thresholds (ASL-3) that authorize researchers to veto capability releases.',
    tacit: '"Competitor velocity dilutes hard pauses"',
    tacitDetail: 'If competitor launches threaten Anthropic\'s market stance, evaluation cycles are compressed and RSP definitions are modified to avoid unilateral pause penalties.',
    severity: 'critical',
  },
  {
    espoused: 'Independent legal board shield',
    espousedDetail: 'Delaware Public Benefit Corporation (PBC) charter mandates balancing stockholder profits with safety benefit purposes.',
    tacit: '"Compute debt drives commercial quotas"',
    tacitDetail: 'With $100B+ cloud capacity liabilities, the board faces heavy pressure to satisfy monetization quotas, limiting the practical application of delays.',
    severity: 'high',
  },
  {
    espoused: 'Anonymized whistleblowing reporting',
    espousedDetail: 'EthicsPoint NAVEX portals allow employees to report safety breaches anonymously to the Board.',
    tacit: '"Confidential S-1 prep encourages secrecy"',
    tacitDetail: 'IPO preparations and strict investor NDAs establish a strong tacit assumption that public disclosures or leaks are acts of corporate sabotage.',
    severity: 'high',
  },
  {
    espoused: 'Ego-free collective consensus',
    espousedDetail: 'The sibling founders model flat communication and encourage debate loops where technical arguments override rank.',
    tacit: '"Researcher hegemony disempowers PMs"',
    tacitDetail: 'Safety researchers hold functional vetoes over roadmaps, disempowering product managers who have quotas to hit but no authority to schedule releases.',
    severity: 'medium',
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
        <h3 style={styles.cardTitle}>Power & Governance Tensions</h3>
        <p style={styles.cardDesc}>
           Official legal structures and safety pledges versus the commercial realities of compute commitments and competitive pressure.
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

// ─── Schein Iceberg: Power & Governance ─────────────────────────────────────
const POWER_SCHEIN = {
  artifacts: [
    {
      name: 'Delaware Public Benefit Corporation (PBC) Charter',
      description: 'A legally binding charter requiring directors to balance stockholder value with public benefit—the responsible development of advanced AI.',
      extra: 'Acts as a legal shield protecting safety-first pause decisions from investor lawsuits that would traditional force maximizing share prices.'
    },
    {
      name: 'Class T Voting Common Stock & LTBT',
      description: 'A purpose trust holding exclusive Class T shares, carrying negligible economic value but holding power to elect a board majority.',
      extra: 'Insulates board appointments from VC control, ensuring at least three of five board members are safety-focused and financially disinterested.'
    },
    {
      name: 'Responsible Scaling Policy (RSP v3.2)',
      description: 'A written framework specifying AI Safety Levels (ASL-3) and mandatory containment protocols.',
      extra: 'Provides a structured trigger for safety evaluations, although it was modified in v3.0 to allow commercial flexibility.'
    },
  ],
  espousedValues: [
    {
      name: 'Act for global good & Fiduciary Balance',
      description: 'Stated principles mandating that model capability leaps must be balanced with ethical evaluations and long-term societal benefit.',
      extra: 'Declared explicitly in the charter and public reports, serving to define corporate identity and recruit safety-motivated talent.'
    },
    {
      name: 'Ignite a safety race to the top',
      description: 'The belief that by demonstrating empirical safety techniques, competitors will be forced to adopt similar policies.',
      extra: 'Used to justify commercial operations, arguing that a competitive Anthropic raises the security posture of the entire industry.'
    },
  ],
  tacitAssumptions: [
    {
      name: 'Competitor pressure overrides hard vetoes',
      description: 'The unwritten rule that safety evaluations can be streamlined or paused if OpenAI launches a model that risks Anthropic\'s relevance.',
      extra: 'Visible in the shift from hard unilateral pauses to flexible risk mitigation reports in RSP revisions.'
    },
    {
      name: 'Commercial viability is a seat at the table',
      description: 'The assumption that safety research is only influential if Anthropic remains at the frontier of commercial capabilities.',
      extra: 'Justifies rapid pre-training scaling and extensive corporate partnership models with major tech companies.'
    },
  ]
};

const TAB_META = [
  { id: 'artifacts',        label: 'Artifacts & Behaviors', sub: 'Visible Layer',   color: 'var(--brand-primary)' },
  { id: 'espousedValues',   label: 'Espoused Values',        sub: 'Declared Layer', color: 'var(--brand-primary-dark)' },
  { id: 'tacitAssumptions', label: 'Tacit Assumptions',      sub: 'Hidden Core',    color: 'var(--brand-primary-dark)' },
];

function PowerScheinBreakdown() {
  const [activeTab, setActiveTab] = useState('artifacts');
  const [expanded, setExpanded] = useState(null);

  const items = POWER_SCHEIN[activeTab];
  const meta  = TAB_META.find(t => t.id === activeTab);

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>SCHEIN\'S 3 LEVELS — POWER CONTEXT</span>
        <h3 style={styles.cardTitle}>Governance Iceberg</h3>
        <p style={styles.cardDesc}>
          Explore how Anthropic\'s power structure runs from visible legal charters down to tacit competitive assumptions.
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
  { label: 'LTBT Trustees',        value: 5,   suffix: '',    prefix: '',   decimals: 0, note: 'Independent Check' },
  { label: 'Veto Override Vote',   value: 75,  suffix: '%',   prefix: '',   decimals: 0, note: 'Stockholders veto' },
  { label: 'Compute Commitments',  value: 100, suffix: 'B+',  prefix: '$',  decimals: 0, note: 'Cloud partner debt' },
  { label: 'Active Safety Level',  value: 3,   suffix: '',    prefix: 'ASL-', decimals: 0, note: 'v3.2 containment' },
];

export default function PowerGovernancePage({ tensionMode }) {
  return (
    <div className="app-main-content">
      {/* Page header */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={styles.eyebrow}>Pillar 03 / Influence</span>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          Power & Governance
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '680px', fontFamily: 'var(--font-sans)' }}>
          Deconstructs how authority and decision-making flow at Anthropic PBC. We trace the legal shield of Delaware Public Benefit charter balances, the Long-Term Benefit Trust voting check, the operational safety veto pipelines, and the commercializing pressures introduced by massive venture compute debt.
        </p>
      </section>

      {/* Animated stats */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Key Governance Metrics</span>
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

      {/* Governance flow */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Authority & Veto Flowchart</span>
          <div style={styles.hairline} />
        </div>
        <GovernanceFlowDiagram />
      </section>

      {/* Compute Mortgage Escalator */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Venture Compute Trap</span>
          <div style={styles.hairline} />
        </div>
        <ComputeMortgageEscalator />
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
        <PowerScheinBreakdown />
      </section>

      {/* Qualitative Evidence Feed */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Qualitative Evidence Feed</span>
          <div style={styles.hairline} />
        </div>
        <EvidenceHub tensionMode={tensionMode} pillar="power" />
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
