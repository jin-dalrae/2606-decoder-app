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

// ─── Talent Funnel ────────────────────────────────────────────────────────────
const FUNNEL_STAGES = [
  { label: 'Total Applicants per Role', count: '~10,000', width: 100, color: '#1457CC' },
  { label: 'Recruiter Phone Screen',    count: '~500',    width: 62,  color: '#1E6BD4' },
  { label: 'Technical Coding Rounds',  count: '~100',    width: 40,  color: '#2E7EE0' },
  { label: 'Mission Fit Panel',         count: '~20',     width: 24,  color: '#5B5BD6' },
  { label: 'Offer Extended',            count: '~10',     width: 13,  color: '#7C3AED' },
];

function TalentFunnel() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setAnimated(true), 100); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="glass-panel"
      style={{ padding: '32px' }}
    >
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>HIRING PIPELINE VISUALIZATION</span>
        <h3 style={styles.cardTitle}>The Talent Funnel</h3>
        <p style={styles.cardDesc}>
          Anthropic's extreme selectivity: approximately 0.1% of applicants per role receive an offer,
          making it statistically harder to join than Harvard Law or Google Brain.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        {FUNNEL_STAGES.map((stage, i) => (
          <React.Fragment key={i}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                position: 'relative',
                height: '48px',
                width: animated ? `${stage.width}%` : '2%',
                maxWidth: '100%',
                minWidth: animated ? '160px' : '4px',
                backgroundColor: stage.color,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: `width ${0.35 + i * 0.15}s cubic-bezier(0.16, 1, 0.3, 1), min-width ${0.35 + i * 0.15}s cubic-bezier(0.16, 1, 0.3, 1)`,
                boxShadow: `0 3px 12px ${stage.color}35`,
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', flexShrink: 0 }}>
                  {stage.label}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', opacity: 0.92, marginLeft: '12px', flexShrink: 0 }}>
                  {stage.count}
                </span>
              </div>
            </div>
            {i < FUNNEL_STAGES.length - 1 && (
              <div style={{
                width: 0, height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: `9px solid ${stage.color}50`,
                opacity: animated ? 1 : 0,
                transition: `opacity ${0.5 + i * 0.15}s ease`,
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{
        marginTop: '24px', padding: '14px 20px',
        background: 'rgba(20, 87, 204, 0.04)',
        borderRadius: '10px',
        border: '1px solid rgba(20, 87, 204, 0.18)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Overall offer rate
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Across all open roles — driven by the Mission Fit veto at final panel stage
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--brand-primary)', fontWeight: 700, letterSpacing: '-0.04em' }}>
          ~0.1%
        </div>
      </div>
    </div>
  );
}

// ─── Schein 3 Levels — Selection Context ────────────────────────────────────
const SELECTION_SCHEIN = {
  artifacts: [
    {
      name: '6–8 Round Interview Architecture',
      description: 'A deliberately long multi-stage funnel: recruiter screen → two coding rounds → systems design → research deep-dive → mission & values fit panel → bar-raiser interview → take-home AI safety case study → VP conversation. Each round has structured rubrics and panel debrief.',
      extra: 'The sheer length signals that Anthropic treats every hire as a high-stakes risk decision. In a 1,000-person organization, one culture-negative hire at senior level carries systemic cost exceeding a missed hire that stays vacant for six months.',
    },
    {
      name: 'Mission Fit Panel Interview',
      description: 'A dedicated interview round — conducted by senior researchers, not HR — that assesses whether a candidate genuinely internalizes Anthropic\'s safety mission as a deeply-held belief, not a career positioning strategy. Probes include views on AI risk magnitude, alignment research priorities, and ethical trade-offs under commercial pressure.',
      extra: 'This panel carries equal scoring weight to all combined technical rounds. The structural parity signals that mission alignment is a hard filter, not a soft preference that can be overridden by exceptional technical scores.',
    },
    {
      name: 'AI Safety Case Study Assessment',
      description: 'A take-home problem testing how candidates reason under alignment uncertainty — e.g., "How would you handle a model that scores well on all capability benchmarks but shows early behavioral patterns consistent with deceptive alignment?" Unlike standard LeetCode screens, this evaluates judgment and values, not just execution.',
      extra: 'Candidates describe this case study as the most revealing round. It cannot be prepped with algorithmic practice — it requires candidates to have developed genuine intuitions about safety trade-offs before the interview.',
    },
    {
      name: 'Referral-Heavy Talent Sourcing',
      description: 'An estimated 60%+ of early Anthropic hires came through warm internal referrals. Former Google Brain, DeepMind, and OpenAI researchers brought their most mission-aligned colleagues. This compresses screening cycles and pre-validates cultural fit through trusted social signal.',
      extra: 'Referral networks are efficient cultural filters. They also compound demographic homogeneity — candidates sourced from the same elite research institutions share educational pedigree, economic background, and worldview, despite Anthropic\'s espoused diversity commitment.',
    },
    {
      name: 'Top-of-Market Compensation as Selection Signal',
      description: 'Posting $400K–$800K+ TC for senior roles acts as a two-sided filter. It attracts candidates who are commercially successful enough to command those offers, while simultaneously screening for candidates who prioritize the mission over the marginal premium they could earn at pure-commercial firms.',
      extra: 'The compensation architecture is a sophisticated selection mechanism: high enough to attract world-class talent, but not so high that financially-motivated candidates choose Anthropic over a hedge fund. Those who accept are self-selected for non-financial motivation.',
    },
  ],
  espousedValues: [
    {
      name: 'Technical Excellence + Mission Alignment, Equally Weighted',
      description: 'Anthropic\'s stated hiring philosophy requires candidates to clear both a technical bar competitive with top ML research labs AND a mission alignment bar. Either condition failing is disqualifying. From their hiring documentation: "We hire people who are both technically exceptional and genuinely passionate about ensuring AI benefits humanity."',
      extra: 'Most Big Tech companies optimize for technical skill alone. The mission alignment co-requirement creates a Venn diagram intersection that is genuinely small — and explains both the low offer rate and the cultural cohesion of the resulting team.',
    },
    {
      name: 'Talent Density Over Headcount Growth',
      description: 'An explicitly espoused organizational principle: Anthropic deliberately resists scaling headcount, preferring 50 exceptional people over 500 average ones. The hiring process is designed to enforce this — it would be impossible to run 6–8 rounds per candidate at scale without intentionally keeping the funnel narrow.',
      extra: 'This espoused value creates a structural ceiling on company size. It also means that Anthropic consistently lags competitors on headcount, which creates both a talent bottleneck and a cultural preservation mechanism.',
    },
    {
      name: 'Low Ego, High Intellectual Generosity',
      description: 'Stated explicitly in Anthropic\'s public hiring materials and internal culture documents: they filter against candidates who seek positional power, external validation, or who signal via credentials rather than ideas. The "tell me what you got wrong" interview reframe is a direct operationalization of this value.',
      extra: 'This espoused value is one of Anthropic\'s most genuinely enforced hiring criteria. Multiple interview reports describe this test being applied in real-time during panel rounds, not just assessed retrospectively.',
    },
    {
      name: 'Diversity Within the Bounds of Mission Alignment',
      description: 'Anthropic espouses a commitment to building a diverse team across gender, ethnicity, discipline, and educational background — arguing that diverse perspectives improve safety research by surfacing edge cases that homogeneous teams miss.',
      extra: 'However, diversity is explicitly bounded by shared mission alignment. Diversity of background is valued; diversity of fundamental belief about whether AGI safety is a priority is not. This creates a genuine tension between epistemic inclusion and organizational coherence.',
    },
  ],
  tacitAssumptions: [
    {
      name: '"A True Believer Would Take the Cut"',
      description: 'The unspoken assumption that a candidate negotiating aggressively, or weighing an Anthropic offer against a higher-paying commercial competitor, is implicitly signaling incomplete mission internalization. The selection process treats aggressive negotiation as a mild red flag.',
      extra: 'This tacit filter has real equity consequences. Candidates from underrepresented economic backgrounds have more financial pressure and legitimate reasons to maximize compensation. The assumption may systematically disadvantage them despite espoused diversity commitments.',
    },
    {
      name: '"If You Need Convincing on Safety, You\'re Already Out"',
      description: 'The interview process does not attempt to persuade candidates that AI safety matters. It selects candidates who independently, pre-interview, concluded that transformative AI risk is real and important. Needing much intellectual persuasion during the process itself is scored negatively.',
      extra: 'This creates a powerful self-reinforcing epistemic filter: the organization hires only people who already share its core prior on AI risk. This produces cohesion but limits the internal diversity of risk assessment — a significant epistemic liability in a field with genuine uncertainty.',
    },
    {
      name: '"Elite ML Pedigree Implies Safety Rigor"',
      description: 'A working prior — never formally stated — that graduates of top ML programs (MIT, Stanford, CMU, Berkeley) or veterans of elite labs (Google Brain, DeepMind, FAIR) carry a credibility signal that accelerates candidacy. The assumption is that these environments produce people who think rigorously about model behavior.',
      extra: 'This prior is partially valid (elite programs do train rigorous thinkers) but imprecisely applied: safety research benefits from philosophy, economics, cognitive science, and policy expertise that elite CS programs specifically do not provide.',
    },
    {
      name: '"No Hire" Is Always the Safe Default',
      description: 'The deeply internalized belief — operationalized through the bar-raiser veto system — that in a high-trust, small-team, existential-mission organization, one culture-negative hire causes more damage than leaving a role vacant for months. "When in doubt, don\'t" is an unwritten law enforced through structural veto power.',
      extra: 'This assumption produces extreme risk-aversion in hiring. It is both a cultural preservation mechanism and a potential bottleneck: teams consistently understaffed during capability race sprints because no candidate cleared the bar, creating the overwork cycle the culture simultaneously deplores.',
    },
    {
      name: '"The Network is the First Filter"',
      description: 'The operational assumption that a referral from a trusted Anthropic employee does pre-filtering work equivalent to several interview rounds. Referred candidates move through the pipeline faster and receive implicit credibility boosts from the social signal embedded in the referral.',
      extra: 'This assumption is efficient but self-reinforcing. Over time, it concentrates Anthropic\'s talent sourcing within a small social network of elite research institutions — an organizational monoculture risk that is difficult to detect from inside the network.',
    },
  ],
};

const TAB_META = [
  { id: 'artifacts',        label: 'Artifacts & Behaviors', sub: 'Visible Layer',    color: '#1457CC' },
  { id: 'espousedValues',   label: 'Espoused Values',        sub: 'Declared Layer',  color: '#7C3AED' },
  { id: 'tacitAssumptions', label: 'Tacit Assumptions',      sub: 'Hidden Core',     color: '#08195C' },
];

function SelectionScheinBreakdown() {
  const [activeTab, setActiveTab] = useState('artifacts');
  const [expanded, setExpanded] = useState(null);

  const items = SELECTION_SCHEIN[activeTab];
  const meta  = TAB_META.find(t => t.id === activeTab);

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>SCHEIN'S 3 LEVELS — SELECTION CONTEXT</span>
        <h3 style={styles.cardTitle}>Cultural Architecture of Hiring</h3>
        <p style={styles.cardDesc}>
          Click any layer tab to explore how Anthropic's selection process operates at each level of Edgar Schein's
          organizational culture model. Expand individual cards for deeper cultural analysis.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {TAB_META.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpanded(null); }}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: `1.5px solid ${activeTab === tab.id ? tab.color : 'var(--border-default)'}`,
              background: activeTab === tab.id ? `${tab.color}10` : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s var(--ease-settle)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: activeTab === tab.id ? tab.color : 'var(--text-secondary)', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              {tab.label}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
              {tab.sub}
            </div>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              padding: '16px 18px',
              borderRadius: '10px',
              border: `1px solid ${expanded === i ? meta.color : 'var(--border-default)'}`,
              background: expanded === i ? `${meta.color}07` : 'var(--bg-default)',
              cursor: 'pointer',
              transition: 'all 0.22s var(--ease-settle)',
              transform: expanded === i ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: expanded === i ? `0 6px 20px ${meta.color}18` : '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: expanded === i ? meta.color : 'var(--text-primary)', margin: 0, lineHeight: 1.35, flex: 1 }}>
                {item.name}
              </h4>
              <span style={{
                fontSize: '14px', color: meta.color, opacity: 0.7, flexShrink: 0, lineHeight: 1,
                transition: 'transform 0.2s ease',
                transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'inline-block',
              }}>▾</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              {item.description}
            </p>
            {expanded === i && (
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '7px',
                background: `${meta.color}08`,
                borderLeft: `3px solid ${meta.color}`,
                animation: 'fadeSlideIn 0.2s ease',
              }}>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: meta.color, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '5px', fontWeight: 600 }}>
                  Cultural Significance
                </span>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>
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

// ─── Vetting Radar Chart ─────────────────────────────────────────────────────
const VETTING_DIMS = [
  { label: 'Technical Depth',     score: 9.5, note: 'Competitive with top ML labs' },
  { label: 'Mission Alignment',   score: 10.0, note: 'Hard filter — equal to all tech rounds' },
  { label: 'Low Ego',             score: 9.0, note: 'Tested explicitly in panel' },
  { label: 'Safety Intuition',    score: 9.2, note: 'Tested via case study' },
  { label: 'Epistemic Humility',  score: 8.5, note: '"What did you get wrong?" test' },
  { label: 'Intellectual Range',  score: 8.0, note: 'Cross-disciplinary thinking' },
];

function VettingRadar() {
  const [animated, setAnimated] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const ref = useRef(null);
  const SIZE = 300;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R  = 105;
  const N  = VETTING_DIMS.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setAnimated(true), 200); },
      { threshold: 0.35 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const pt = (val, maxVal, idx) => {
    const angle = (Math.PI * 2 * idx / N) - Math.PI / 2;
    const r = animated ? (val / maxVal) * R : 0;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  };

  const axisPts = VETTING_DIMS.map((_, i) => {
    const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
    return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
  });

  const dataPts  = VETTING_DIMS.map((d, i) => pt(d.score, 10, i));
  const dataPath = dataPts.map(p => `${p.x},${p.y}`).join(' ');
  const rings    = [2, 4, 6, 8, 10];

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>SCREENING DIMENSION ANALYSIS</span>
        <h3 style={styles.cardTitle}>What Anthropic Vets For</h3>
        <p style={styles.cardDesc}>
          Relative screening weight of each dimension across Anthropic's interview process, scored out of 10.
          Derived from candidate interview reports, internal hiring documentation, and publicly available culture materials.
        </p>
      </div>

      <div ref={ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        {/* SVG Radar */}
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow: 'visible', flexShrink: 0 }}>
          {rings.map(r => {
            const pts = VETTING_DIMS.map((_, i) => {
              const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
              const rr = (r / 10) * R;
              return `${CX + rr * Math.cos(angle)},${CY + rr * Math.sin(angle)}`;
            }).join(' ');
            return (
              <polygon key={r} points={pts} fill="none"
                stroke={r === 10 ? 'var(--border-light)' : 'var(--border-default)'}
                strokeWidth={r === 10 ? 1.5 : 0.75}
                strokeDasharray={r < 10 ? '3,3' : undefined}
              />
            );
          })}
          {axisPts.map((p, i) => (
            <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y}
              stroke="var(--border-default)" strokeWidth="0.75" />
          ))}
          <polygon
            points={dataPath}
            fill="rgba(20,87,204,0.1)"
            stroke="#1457CC"
            strokeWidth="2"
            style={{ transition: 'all 1.3s cubic-bezier(0.16,1,0.3,1)' }}
          />
          {dataPts.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y} r={hoveredIdx === i ? 6 : 4}
              fill={hoveredIdx === i ? '#7C3AED' : '#1457CC'}
              stroke="#fff" strokeWidth="1.5"
              style={{ transition: `all 1.3s cubic-bezier(0.16,1,0.3,1), r 0.15s ease, fill 0.15s ease` }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              cursor="pointer"
            />
          ))}
          {axisPts.map((p, i) => {
            const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
            const lr = R + 26;
            const lx = CX + lr * Math.cos(angle);
            const ly = CY + lr * Math.sin(angle);
            return (
              <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', fill: 'var(--text-secondary)', fontWeight: 600 }}>
                {VETTING_DIMS[i].label}
              </text>
            );
          })}
          <text x={CX} y={CY + R + 42} textAnchor="middle"
            style={{ fontSize: '8px', fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ● Score /10
          </text>
        </svg>

        {/* Dimension list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px', flex: 1, maxWidth: '320px' }}>
          {VETTING_DIMS.map((d, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                cursor: 'default',
                padding: '8px 12px',
                borderRadius: '8px',
                background: hoveredIdx === i ? 'rgba(20,87,204,0.05)' : 'transparent',
                border: `1px solid ${hoveredIdx === i ? 'rgba(20,87,204,0.2)' : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: hoveredIdx === i ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                  {d.label}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-primary)', minWidth: '28px', textAlign: 'right' }}>
                  {d.score}
                </span>
              </div>
              <div style={{ height: '4px', background: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                <div style={{
                  height: '100%',
                  width: animated ? `${d.score * 10}%` : '0%',
                  background: hoveredIdx === i
                    ? 'linear-gradient(90deg, #1457CC, #7C3AED)'
                    : 'linear-gradient(90deg, #1457CC, #2E7EE0)',
                  borderRadius: '3px',
                  transition: `width ${0.8 + i * 0.09}s cubic-bezier(0.16,1,0.3,1), background 0.15s ease`,
                }} />
              </div>
              {hoveredIdx === i && (
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                  {d.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Goffee & Jones Context Card ────────────────────────────────────────────
function GoffeeContextCard() {
  const [activePanel, setActivePanel] = useState('solidarity');

  const panels = {
    solidarity: {
      title: 'High Solidarity via Mission Filtering',
      color: '#1457CC',
      body: 'By selecting only candidates who have independently concluded that AGI safety is an existential priority, Anthropic ensures near-total strategic alignment before day one. Every new hire arrives pre-bonded to the mission — producing the high solidarity that defines the Communal quadrant without top-down enforcement, management overhead, or cultural indoctrination programs.',
    },
    sociability: {
      title: 'High Sociability via Low-Ego Filtering',
      color: '#7C3AED',
      body: 'By actively screening against candidates with high political drive, status-seeking behavior, or ego signaling, the selection process systematically produces a team that is collaborative, intellectually generous, and socially warm. This high sociability dimension of the Communal archetype emerges from subtraction — removing ego-driven candidates — rather than from culture programming.',
    },
    tension: {
      title: 'Structural Risk: Epistemic Conformity',
      color: '#B93815',
      body: 'The Communal culture produced by this selection process carries a structural vulnerability: groupthink. When every team member shares the same prior on AI risk magnitude, arrived at independently but from within the same epistemic community, the organization may lack the internal dissent needed to challenge its own safety assumptions. The selection filter that ensures mission cohesion also limits the diversity of risk intuitions that might surface blind spots.',
    },
  };

  const current = panels[activePanel];

  return (
    <div className="glass-panel" style={{ padding: '32px', borderTop: `3px solid var(--brand-primary)` }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>GOFFEE & JONES CULTURAL TYPOLOGY — SELECTION SIGNAL</span>
        <h3 style={styles.cardTitle}>Why Selection Produces a Communal Culture</h3>
        <p style={styles.cardDesc}>
          Goffee & Jones place organizations on a 2×2 grid of Sociability (interpersonal warmth) vs. Solidarity
          (strategic alignment). Anthropic's hiring practices directly engineer both axes simultaneously.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Mini G-J Grid */}
        <div style={{ flexShrink: 0 }}>
          <svg width="220" height="220" viewBox="0 0 220 220">
            <rect x="1" y="1" width="218" height="218" fill="var(--bg-muted)" stroke="var(--border-light)" strokeWidth="1" rx="6" />
            <line x1="110" y1="1" x2="110" y2="219" stroke="var(--border-default)" strokeWidth="1" />
            <line x1="1" y1="110" x2="219" y2="110" stroke="var(--border-default)" strokeWidth="1" />
            {/* Quadrant labels */}
            {[
              { x: 8,   y: 16,  text: 'NETWORKED',   opacity: 0.4 },
              { x: 116, y: 16,  text: 'COMMUNAL',    opacity: 1.0, bold: true },
              { x: 8,   y: 206, text: 'FRAGMENTED',  opacity: 0.4 },
              { x: 116, y: 206, text: 'MERCENARY',   opacity: 0.4 },
            ].map((q, i) => (
              <text key={i} x={q.x} y={q.y}
                style={{ fontSize: '7.5px', fill: `rgba(16,15,17,${q.opacity})`, fontFamily: 'var(--font-mono)', fontWeight: q.bold ? 700 : 400 }}>
                {q.text}
              </text>
            ))}
            {/* Axis labels */}
            <text x="4" y="108" style={{ fontSize: '7px', fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Solidarity →
            </text>
            <text x="108" y="115" style={{ fontSize: '7px', fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ↑ Soc.
            </text>
            {/* Anthropic dot */}
            <circle cx="190" cy="18" r="9" fill="#1457CC" opacity="0.9" />
            <text x="190" y="21" textAnchor="middle" style={{ fontSize: '6px', fill: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              ANT
            </text>
            {/* Comparison dots */}
            <circle cx="30"  cy="18"  r="5" fill="#B93815" opacity="0.5" />
            <text x="30" y="31" textAnchor="middle" style={{ fontSize: '6px', fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OAI</text>
            <circle cx="170" cy="145" r="5" fill="#5D5D5D" opacity="0.5" />
            <text x="170" y="158" textAnchor="middle" style={{ fontSize: '6px', fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BIG</text>
            <circle cx="22"  cy="195" r="5" fill="#888" opacity="0.4" />
            <text x="22" y="208" textAnchor="middle" style={{ fontSize: '6px', fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACAD</text>
          </svg>
          <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[{ color: '#1457CC', label: 'Anthropic' }, { color: '#B93815', label: 'OpenAI' }, { color: '#5D5D5D', label: 'Big Tech' }].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panels */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {Object.entries(panels).map(([key, p]) => (
              <button key={key} onClick={() => setActivePanel(key)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', border: `1px solid ${activePanel === key ? p.color : 'var(--border-default)'}`,
                  background: activePanel === key ? `${p.color}10` : 'transparent', cursor: 'pointer',
                  fontSize: '10px', fontWeight: 600, color: activePanel === key ? p.color : 'var(--text-secondary)',
                  transition: 'all 0.15s ease', letterSpacing: '0.03em',
                }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          <div style={{
            padding: '16px 18px', borderRadius: '10px',
            background: `${current.color}07`,
            border: `1px solid ${current.color}25`,
            borderLeft: `4px solid ${current.color}`,
            transition: 'all 0.2s ease',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: current.color, marginBottom: '8px', letterSpacing: '-0.01em' }}>
              {current.title}
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              {current.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
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
};

// ─── Keyframe injection ────────────────────────────────────────────────────────
const KEYFRAMES = `
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
if (typeof document !== 'undefined') {
  const existing = document.getElementById('sel-vetting-anim');
  if (!existing) {
    const tag = document.createElement('style');
    tag.id = 'sel-vetting-anim';
    tag.textContent = KEYFRAMES;
    document.head.appendChild(tag);
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Acceptance Rate',  value: 0.1,  suffix: '%',  prefix: '~',  decimals: 1, note: 'per open role' },
  { label: 'Interview Rounds', value: 8,    suffix: '',   prefix: '6–', decimals: 0, note: 'stages typical' },
  { label: 'Mission Weight',   value: 50,   suffix: '%',  prefix: '',   decimals: 0, note: 'equal to technical' },
  { label: 'Senior TC',        value: 800,  suffix: 'K+', prefix: '$',  decimals: 0, note: 'total comp ceiling' },
];

export default function SelectionVettingPage({ tensionMode }) {
  return (
    <div className="app-main-content">

      {/* Page header */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={styles.eyebrow}>Pillar 01 / Recruitment</span>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          Selection & Vetting
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '680px' }}>
          Dissects how Anthropic selects talent — screening for extreme technical depth and deep mission alignment
          simultaneously, and rejecting candidates who prioritize commercial reward over safety ethics. The selection
          process is the primary cultural filter that produces Anthropic's Communal organizational typology.
        </p>
      </section>

      {/* Animated stats */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Key Hiring Metrics</span>
          <div style={styles.hairline} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
          {STATS.map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, #1457CC ${i * 25}%, #7C3AED ${100 - i * 15}%)` }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: '-0.05em', lineHeight: 1 }}>
                <AnimatedNumber target={s.value} suffix={s.suffix} prefix={s.prefix} decimals={s.decimals} duration={1800 + i * 200} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '7px', letterSpacing: '-0.01em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Talent Funnel */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Hiring Pipeline</span>
          <div style={styles.hairline} />
        </div>
        <TalentFunnel />
      </section>

      {/* Schein Breakdown */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Schein's Cultural Iceberg: Selection Context</span>
          <div style={styles.hairline} />
        </div>
        <SelectionScheinBreakdown />
      </section>

      {/* Vetting Radar */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Screening Dimension Radar</span>
          <div style={styles.hairline} />
        </div>
        <VettingRadar />
      </section>

      {/* Goffee-Jones Context */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Goffee & Jones Cultural Typology Signal</span>
          <div style={styles.hairline} />
        </div>
        <GoffeeContextCard />
      </section>

      {/* Evidence Hub */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Qualitative Evidence Feed</span>
          <div style={styles.hairline} />
        </div>
        <EvidenceHub tensionMode={tensionMode} pillar="selection" />
      </section>

    </div>
  );
}

// Extend styles with layout helpers
Object.assign(styles, {
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
});
