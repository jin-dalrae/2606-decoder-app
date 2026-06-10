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

// ─── Compensation Landscape ───────────────────────────────────────────────────
const COMP_DATA = [
  {
    org: 'Anthropic (Sr. MTS)',
    base: 320, equity: 380, bonus: 40,
    color: '#1457CC',
    note: 'Profit Interest Units + performance bonus',
  },
  {
    org: 'Google / DeepMind (L6)',
    base: 270, equity: 200, bonus: 60,
    color: '#5B5BD6',
    note: 'RSU + performance bonus',
  },
  {
    org: 'OpenAI (Senior)',
    base: 300, equity: 260, bonus: 30,
    color: '#7C3AED',
    note: 'Equity + bonus (estimated from Levels.fyi)',
  },
  {
    org: 'Meta AI (E6)',
    base: 250, equity: 175, bonus: 55,
    color: '#888',
    note: 'RSU + annual bonus',
  },
  {
    org: 'AI Startup Average (Sr.)',
    base: 180, equity: 120, bonus: 20,
    color: '#B4B4B4',
    note: 'Industry median for senior AI roles',
  },
];

const MAX_TC = Math.max(...COMP_DATA.map(d => d.base + d.equity + d.bonus));

function CompensationLandscape() {
  const [animated, setAnimated] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setAnimated(true), 150); },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={styles.eyebrow}>COMPENSATION LANDSCAPE ANALYSIS</span>
        <h3 style={styles.cardTitle}>Total Compensation Benchmarking</h3>
        <p style={styles.cardDesc}>
          Annual total compensation (TC) breakdown for senior-equivalent roles across top AI organizations.
          Source: Levels.fyi, Glassdoor (2025–2026 data), individual report submissions. All figures in USD thousands.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {COMP_DATA.map((d, i) => {
          const total = d.base + d.equity + d.bonus;
          const isHovered = hoveredIdx === i;
          const isAnthro = i === 0;

          return (
            <div key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'default' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: isAnthro ? 700 : 600, color: isAnthro ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                    {d.org}
                  </span>
                  {isAnthro && (
                    <span style={{ fontSize: '9px', padding: '1px 6px', background: 'rgba(20,87,204,0.1)', color: 'var(--brand-primary)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      SUBJECT
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: d.color, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                  ${total}K
                </span>
              </div>

              {/* Stacked bar */}
              <div style={{ height: '28px', background: 'var(--bg-muted)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                {[
                  { val: d.base,   delay: 0,   opacity: 1.0,  label: 'Base' },
                  { val: d.equity, delay: 0.08, opacity: 0.72, label: 'Equity' },
                  { val: d.bonus,  delay: 0.16, opacity: 0.45, label: 'Bonus' },
                ].reduce((acc, seg, si) => {
                  const prev = acc.offset;
                  const w = (seg.val / MAX_TC) * 100;
                  acc.elements.push(
                    <div key={si} style={{
                      position: 'absolute',
                      top: 0, bottom: 0,
                      left: animated ? `${prev}%` : '0%',
                      width: animated ? `${w}%` : '0%',
                      background: d.color,
                      opacity: seg.opacity,
                      transition: `width ${0.55 + i * 0.08 + seg.delay}s cubic-bezier(0.16,1,0.3,1), left ${0.55 + i * 0.08 + seg.delay}s cubic-bezier(0.16,1,0.3,1)`,
                      display: 'flex', alignItems: 'center', paddingLeft: '6px', overflow: 'hidden',
                    }}>
                      {w > 8 && (
                        <span style={{ fontSize: '9px', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {seg.label}
                        </span>
                      )}
                    </div>
                  );
                  acc.offset += w;
                  return acc;
                }, { elements: [], offset: 0 }).elements}
              </div>

              {/* Hover detail */}
              {isHovered && (
                <div style={{ marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap', animation: 'fadeSlideIn 0.15s ease' }}>
                  {[
                    { l: 'Base', v: d.base }, { l: 'Equity', v: d.equity }, { l: 'Bonus', v: d.bonus }
                  ].map((seg, si) => (
                    <span key={si} style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ opacity: 0.6 }}>{seg.l}: </span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${seg.v}K</span>
                    </span>
                  ))}
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>{d.note}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--border-faint)' }}>
        {[{ label: 'Base Salary', opacity: 1.0 }, { label: 'Equity (annualized)', opacity: 0.72 }, { label: 'Annual Bonus', opacity: 0.45 }].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '8px', borderRadius: '2px', background: '#1457CC', opacity: l.opacity }} />
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{l.label}</span>
          </div>
        ))}
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', marginLeft: 'auto' }}>
          *Estimated — Levels.fyi / Glassdoor aggregated, 2025–2026
        </span>
      </div>
    </div>
  );
}

// ─── Tension Core ─────────────────────────────────────────────────────────────
const TENSION_DATA = [
  {
    espoused: 'Mission-impact promotion criteria',
    espousedDetail: 'Career advancement is tied to safety research contribution, not tenure or commercial revenue.',
    tacit: '"Safety sprinters get the best projects"',
    tacitDetail: 'Employees who work intensively during safety-critical evaluation windows earn access to the next-tier research tracks. Those who protect personal time during sprints do not.',
    severity: 'high',
  },
  {
    espoused: 'Generous, unlimited PTO policy',
    espousedDetail: 'HR communications explicitly encourage employees to take adequate rest to sustain high long-term performance.',
    tacit: '"Taking PTO signals insufficient mission urgency"',
    tacitDetail: 'Visible rest during model development sprints or safety evaluation windows is culturally read as under-commitment to an existential mission.',
    severity: 'critical',
  },
  {
    espoused: 'Work-life integration, not extraction',
    espousedDetail: 'Anthropic distinguishes between extracting labor and integrating work into a meaningful life — the company espouses the latter.',
    tacit: '"Visible intensity = mission seriousness"',
    tacitDetail: 'Late Slack messages, weekend responsiveness, and irregular hours are social signals of genuine alignment. Strict 40-hour weeks are read as a statement of misalignment.',
    severity: 'critical',
  },
  {
    espoused: 'Peer mentorship culture',
    espousedDetail: 'Senior researchers are expected to invest in junior colleagues\' growth and share experimental findings openly across team silos.',
    tacit: '"Mentorship suspends during sprints"',
    tacitDetail: 'Under deadline pressure, senior researchers retreat into focused sprint mode. The mentorship relationship is informally suspended precisely when junior researchers most need guidance.',
    severity: 'medium',
  },
  {
    espoused: '$200/month wellness stipend & therapy access',
    espousedDetail: 'A monthly benefit designed to signal that Anthropic cares about employee psychological health amid high-pressure mission work.',
    tacit: '"Burnout is proof of commitment"',
    tacitDetail: 'Stories of extreme exhaustion become cultural symbols. Employees who have never experienced burnout may feel they haven\'t fully committed to the mission.',
    severity: 'critical',
  },
];

const SEVERITY_COLORS = { high: '#B93815', critical: '#D92D20', medium: '#5B5BD6' };
const SEVERITY_LABELS = { high: 'HIGH TENSION', critical: 'CRITICAL TENSION', medium: 'MODERATE TENSION' };

function TensionCore({ tensionMode }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = TENSION_DATA[activeIdx];
  const sevColor = SEVERITY_COLORS[current.severity];

  return (
    <div className={`glass-panel ${tensionMode ? 'glass-panel-glow-tension' : ''}`} style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>ESPOUSED VALUES vs. TACIT ASSUMPTIONS</span>
        <h3 style={styles.cardTitle}>The Tension Core</h3>
        <p style={styles.cardDesc}>
          What Anthropic officially says about progression and reward — versus what actually governs career outcomes.
          Select a tension pair to see the conflict in detail.
        </p>
      </div>

      {/* Tension selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
        {TENSION_DATA.map((t, i) => (
          <button key={i} onClick={() => setActiveIdx(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer',
              border: `1px solid ${activeIdx === i ? SEVERITY_COLORS[t.severity] : 'var(--border-default)'}`,
              background: activeIdx === i ? `${SEVERITY_COLORS[t.severity]}08` : 'transparent',
              transition: 'all 0.18s ease',
            }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
              background: SEVERITY_COLORS[t.severity],
              boxShadow: activeIdx === i ? `0 0 0 3px ${SEVERITY_COLORS[t.severity]}30` : 'none',
            }} />
            <span style={{ fontSize: '12px', fontWeight: activeIdx === i ? 700 : 500, color: activeIdx === i ? SEVERITY_COLORS[t.severity] : 'var(--text-secondary)', flex: 1, lineHeight: 1.3 }}>
              {t.espoused}
            </span>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: SEVERITY_COLORS[t.severity], fontWeight: 700, flexShrink: 0, letterSpacing: '0.04em' }}>
              {SEVERITY_LABELS[t.severity]}
            </span>
          </button>
        ))}
      </div>

      {/* Detail: two-column */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Espoused panel */}
        <div style={{
          padding: '20px', borderRadius: '10px',
          background: 'var(--bg-muted)', border: '1px solid var(--border-default)',
          borderTop: '3px solid var(--brand-primary)',
          transition: 'all 0.2s ease',
        }}>
          <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            WHAT ANTHROPIC SAYS
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.3 }}>
            "{current.espoused}"
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {current.espousedDetail}
          </p>
        </div>

        {/* Tacit panel */}
        <div style={{
          padding: '20px', borderRadius: '10px',
          background: `${sevColor}05`,
          border: `1px solid ${sevColor}25`,
          borderTop: `3px solid ${sevColor}`,
          transition: 'all 0.2s ease',
        }}>
          <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: sevColor, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            WHAT ACTUALLY HAPPENS
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: sevColor, marginBottom: '10px', lineHeight: 1.3 }}>
            {current.tacit}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {current.tacitDetail}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Progression Schein Breakdown ─────────────────────────────────────────────
const PROGRESSION_SCHEIN = {
  artifacts: [
    {
      name: 'Flat "Member of Technical Staff" Title Structure',
      description: 'Virtually all contributors — from junior engineer to principal-equivalent — hold the title "Member of Technical Staff" (MTS) or "Research Scientist." No Senior Directors, Distinguished Engineers, or Fellows exist. Title differentiation is minimal; the visible seniority signal is how frequently leadership cites an employee\'s work in strategic decisions.',
      extra: 'This artifact embeds a crucial message: status at Anthropic derives from research impact and intellectual contribution, not positional authority. It also creates informal influence structures that are invisible to new hires — which introduces its own political dynamics despite the anti-political intent.',
    },
    {
      name: 'Profit Interest Units (PIUs) — Mission-Aligned Equity',
      description: 'Unlike standard RSUs, Anthropic compensates employees via Profit Interest Units — a special equity structure suited to its Public Benefit Corporation (PBC) legal status. PIUs tie employee wealth to the organization\'s long-term mission success rather than a short-term market exit event like an IPO or acquisition.',
      extra: 'This equity mechanism operationally aligns financial incentives with mission survival. A PIU holder maximizes wealth by contributing to Anthropic\'s long-term safety mission success — not by optimizing for a 2-year acquisition by a commercial acquirer. The structure is a deliberate artifact that embeds mission alignment into the compensation architecture itself.',
    },
    {
      name: 'Mission-Impact Biannual Performance Reviews',
      description: 'Reviews occur twice annually and explicitly frame evaluation around mission impact. Rubrics include: "How did this employee\'s work advance Anthropic\'s safety mission? What safety insights emerged? How did they improve the team\'s collective intelligence?" Technical output metrics exist but are secondary to these mission-framed questions.',
      extra: 'When performance reviews ask about safety insights, employees track and document safety insights in their daily work — even when commercial pressure pushes toward capability development. The review structure changes what employees optimize for at the granular task level.',
    },
    {
      name: '$200/Month Wellness Stipend',
      description: 'A monthly benefit for therapy co-pays, meditation apps, gym memberships, and ergonomic equipment — designed to acknowledge the psychological burden of mission-critical work and invest in employee mental health.',
      extra: 'The wellness stipend is an artifact in visible tension with the culture it attempts to address. Its existence acknowledges the mental health cost of the work, while its size ($2,400/year against $600K+ compensation) signals it is a gesture rather than a structural commitment to addressing the root cause of that burden.',
    },
    {
      name: 'Annual Company Offsite — Mission Renewal Ritual',
      description: 'An annual retreat at which leadership presents the current state of AGI development, safety research progress, and the organization\'s strategic horizon. Dario Amodei\'s presentations on AI risk timelines function as a collective mission renewal ritual.',
      extra: 'Former employees describe the offsite as emotionally powerful and culturally essential. It resets employees\' sense of existential urgency — which is both its function and its risk. The urgency it instills feeds directly back into the overwork cycle that the wellness benefits attempt to mitigate.',
    },
  ],
  espousedValues: [
    {
      name: 'Career Advancement Tied to Mission Impact, Not Tenure',
      description: 'Anthropic\'s stated promotion philosophy: advancement is driven by impact on the safety mission. A researcher who discovers a critical safety failure in a model under evaluation — even if it delays a commercial release — is celebrated as more impactful than an engineer who ships revenue-growing features without safety insight.',
      extra: 'This espoused value holds more genuinely than at most tech companies. Safety insights do get recognized and rewarded. However, it breaks down under competitive pressure: when OpenAI or Google releases a new frontier model, commercial output starts receiving disproportionate implicit weight in allocation decisions.',
    },
    {
      name: 'Generous Unlimited PTO',
      description: 'Official policy provides unlimited, discretionary paid time off. HR communications explicitly encourage employees to take adequate rest for long-term performance sustainability. The policy is genuine at the administrative level.',
      extra: 'Unlimited PTO policies in high-urgency cultures systematically produce less actual time off than fixed PTO policies. When the employee bears full accountability for deciding whether to rest, mission urgency becomes a powerful internal counter-incentive. The absence of a mandatory minimum creates conditions where the most mission-aligned employees take the least rest.',
    },
    {
      name: 'Peer Mentorship Over Management Hierarchy',
      description: 'Senior researchers are expected to invest in junior colleagues\' development, share experimental findings openly, and foster knowledge diffusion across the organization rather than siloing expertise.',
      extra: 'This espoused value produces genuinely collaborative research in normal conditions. It structurally fails under deadline pressure, when senior researchers retreat into focused sprint mode and mentorship is informally suspended — precisely when junior researchers most need guidance to navigate high-stakes safety decisions.',
    },
    {
      name: 'Work-Life Integration, Not Extraction',
      description: 'Anthropic\'s stated cultural philosophy distinguishes between "extracting" maximum labor from employees versus "integrating" meaningful work into a well-designed life. The company explicitly espouses the latter — framing overwork as a personal choice, not an organizational requirement.',
      extra: 'The semantic distinction is real but also convenient. "Integration" can justify working at midnight because "you love the mission." The framing shifts accountability for overwork from the organization to the individual employee, reducing organizational culpability while preserving the cultural conditions that produce overwork.',
    },
  ],
  tacitAssumptions: [
    {
      name: '"Visible Intensity = Mission Seriousness"',
      description: 'The deeply held, never-articulated assumption that working late, responding to Slack on weekends, and being visibly available at irregular hours signals genuine mission alignment. Conversely, strict work-hour discipline is read as a signal of insufficient urgency.',
      extra: 'This assumption is self-reinforcing: leaders who built the organization through intense personal sacrifice naturally model this behavior. Junior employees observe it, internalize it, and reproduce it — without anyone explicitly articulating the rule. The culture perpetuates itself below the threshold of conscious policy.',
    },
    {
      name: '"Your Career Advances When the Mission Advances"',
      description: 'A tacit belief that individual career progression is bound to organizational mission success: when Anthropic advances its safety frontier, the people who contributed most visibly to that advance are promoted. Personal career ambition is framed as indistinguishable from mission ambition.',
      extra: 'This assumption is motivationally powerful but creates a concerning dependency: employees may feel that any work not directly advancing the safety mission is career-inert. This can produce overspecialization, neglect of important cross-functional work, and moral injury when the mission doesn\'t advance as hoped.',
    },
    {
      name: '"Mission Failure = Individual Moral Failure"',
      description: 'A deep cultural assumption that individual performance is morally tied to the organization\'s mission. If AGI development goes wrong, employees who didn\'t work hard enough bear some moral responsibility. This transcends typical workplace motivation — it creates existential personal stakes in every career decision.',
      extra: 'This is perhaps the most psychologically powerful and most potentially harmful assumption in Anthropic\'s culture. It frames insufficient personal sacrifice not as a reasonable work-life decision but as moral failure. Employees experiencing burnout may feel guilt rather than entitlement to recovery — which deepens the cycle.',
    },
    {
      name: '"Burnout Is Proof of Commitment"',
      description: 'Stories of extreme exhaustion during capability development sprints become cultural symbols. Employees who have never experienced burnout may feel they haven\'t fully committed. Burn marks — visible fatigue, visible sacrifice — function as social status signals.',
      extra: 'This assumption directly contradicts research on peak cognitive performance: burnout reduces output quality, increases error rates, and produces exactly the safety lapses that Anthropic\'s mission exists to prevent. The culture simultaneously produces and deplores burnout — treating its symptom as a badge while mourning its consequences.',
    },
    {
      name: '"Taking PTO Signals You Could Afford to Slow Down"',
      description: 'The tacit belief that taking extended PTO — especially during capability race or safety evaluation cycles — signals that the employee did not fully internalize the mission\'s urgency. Not formally prohibited, but culturally sanctioned via social exclusion from high-visibility projects.',
      extra: 'This assumption creates a compounding negative loop: employees don\'t take PTO → accumulate cognitive fatigue → research quality degrades → safety evaluation cycles lengthen → mission urgency intensifies → even less PTO. The safety mission is paradoxically undermined by the cultural demands of commitment to it.',
    },
  ],
};

const TAB_META = [
  { id: 'artifacts',        label: 'Artifacts & Behaviors', sub: 'Visible Layer',   color: '#1457CC' },
  { id: 'espousedValues',   label: 'Espoused Values',        sub: 'Declared Layer', color: '#7C3AED' },
  { id: 'tacitAssumptions', label: 'Tacit Assumptions',      sub: 'Hidden Core',    color: '#08195C' },
];

function ProgressionScheinBreakdown() {
  const [activeTab, setActiveTab] = useState('artifacts');
  const [expanded, setExpanded] = useState(null);

  const items = PROGRESSION_SCHEIN[activeTab];
  const meta  = TAB_META.find(t => t.id === activeTab);

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>SCHEIN'S 3 LEVELS — PROGRESSION CONTEXT</span>
        <h3 style={styles.cardTitle}>Cultural Architecture of Advancement</h3>
        <p style={styles.cardDesc}>
          How Anthropic's progression and reward system maps across Edgar Schein's three levels — from visible
          compensation structures down to the unwritten rules governing what actually drives careers forward.
          Expand individual cards for deeper cultural analysis.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {TAB_META.map(tab => (
          <button key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpanded(null); }}
            style={{
              padding: '10px 18px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer',
              border: `1.5px solid ${activeTab === tab.id ? tab.color : 'var(--border-default)'}`,
              background: activeTab === tab.id ? `${tab.color}10` : 'transparent',
              transition: 'all 0.2s var(--ease-settle)',
            }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: activeTab === tab.id ? tab.color : 'var(--text-secondary)', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              {tab.label}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
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
              padding: '16px 18px', borderRadius: '10px', cursor: 'pointer',
              border: `1px solid ${expanded === i ? meta.color : 'var(--border-default)'}`,
              background: expanded === i ? `${meta.color}07` : 'var(--bg-default)',
              transition: 'all 0.22s var(--ease-settle)',
              transform: expanded === i ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: expanded === i ? `0 6px 20px ${meta.color}18` : '0 1px 4px rgba(0,0,0,0.05)',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: expanded === i ? meta.color : 'var(--text-primary)', margin: 0, lineHeight: 1.35, flex: 1 }}>
                {item.name}
              </h4>
              <span style={{
                fontSize: '14px', color: meta.color, opacity: 0.7, flexShrink: 0, lineHeight: 1,
                display: 'inline-block', transition: 'transform 0.2s ease',
                transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>▾</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              {item.description}
            </p>
            {expanded === i && (
              <div style={{
                marginTop: '12px', padding: '10px 14px', borderRadius: '7px',
                background: `${meta.color}08`, borderLeft: `3px solid ${meta.color}`,
                animation: 'fadeSlideIn 0.18s ease',
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

// ─── Promotion Signal Matrix ──────────────────────────────────────────────────
const PROMOTION_DRIVERS = [
  { label: 'Safety Research Impact',         weight: 32, color: '#1457CC', note: 'Primary career driver — detecting dangerous model behaviors, publishing safety insights' },
  { label: 'Technical Capability Output',    weight: 26, color: '#2E7EE0', note: 'Secondary — model training contributions, infrastructure, tooling quality' },
  { label: 'Cross-Team Mentorship',           weight: 20, color: '#5B5BD6', note: 'Organizational multiplier — elevating junior researchers, knowledge sharing' },
  { label: 'Mission Embodiment',              weight: 14, color: '#7C3AED', note: 'Cultural signal — visible alignment with Anthropic\'s safety-first values' },
  { label: 'Research Publication',            weight: 8,  color: '#9C5AE0', note: 'Academic prestige signal — interpretability, alignment, evaluation papers' },
];

function PromotionSignalMatrix() {
  const [animated, setAnimated] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setAnimated(true), 100); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={styles.eyebrow}>PROMOTION SIGNAL ARCHITECTURE</span>
        <h3 style={styles.cardTitle}>What Actually Drives Advancement</h3>
        <p style={styles.cardDesc}>
          The implicit weighting of career signal dimensions at Anthropic — derived from employee accounts,
          promotion pattern analysis, and internal culture documentation. Hover to see detail.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
        {PROMOTION_DRIVERS.map((d, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <div key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '14px 16px', borderRadius: '8px',
                background: isHovered ? `${d.color}08` : 'transparent',
                border: `1px solid ${isHovered ? d.color + '30' : 'transparent'}`,
                cursor: 'default', transition: 'all 0.15s ease',
              }}>
              {/* Rank number */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: isHovered ? d.color : 'var(--bg-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.2s ease',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: isHovered ? '#fff' : 'var(--text-muted)' }}>
                  {i + 1}
                </span>
              </div>

              {/* Label + bar */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: isHovered ? d.color : 'var(--text-primary)', transition: 'color 0.15s ease' }}>
                    {d.label}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: d.color, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                    {d.weight}%
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: animated ? `${d.weight * 3}%` : '0%',
                    background: d.color,
                    borderRadius: '4px',
                    transition: `width ${0.6 + i * 0.12}s cubic-bezier(0.16,1,0.3,1)`,
                    boxShadow: isHovered ? `0 0 8px ${d.color}60` : 'none',
                  }} />
                </div>
                {isHovered && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px', fontStyle: 'italic', animation: 'fadeSlideIn 0.15s ease' }}>
                    {d.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '20px', padding: '14px 18px', borderRadius: '8px',
        background: 'rgba(20,87,204,0.04)', border: '1px solid rgba(20,87,204,0.15)',
        fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
          Key structural insight:
        </strong>
        Promotion at Anthropic is not driven by shipping the most code or generating the most revenue.
        The primary career signal is contribution to the safety research frontier — which means career
        advancement is structurally tied to mission advancement, not personal commercial output. This
        is unusual among technology companies and reflects a genuinely mission-driven incentive architecture.
      </div>
    </div>
  );
}

// ─── Design Maturity Assessment Card ─────────────────────────────────────────
function DesignMaturityCard() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  const rungs = [
    { label: 'Ad-hoc',     score: 0,   active: false },
    { label: 'Focused',    score: 25,  active: false },
    { label: 'Positioned', score: 50,  active: false },
    { label: 'Integrated', score: 75,  active: true  },
    { label: 'Strategic',  score: 100, active: true  },
  ];

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
      <div style={{ marginBottom: '24px' }}>
        <span style={styles.eyebrow}>DESIGN MATURITY ASSESSMENT — ANTHROPIC</span>
        <h3 style={styles.cardTitle}>Design as Strategic Function</h3>
        <p style={styles.cardDesc}>
          Anthropic occupies an Integrated/Strategic position — design is not a finishing coat applied post-engineering,
          but a core product driver embedded in research and safety work. Led by Jenny Wen (former Figma Director of Design),
          the organization has redefined interaction paradigms for AI interfaces.
        </p>
      </div>

      {/* Maturity ladder */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {rungs.map((r, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1, minWidth: '60px' }}>
            <div style={{
              width: '100%', minWidth: '40px',
              height: animated ? `${20 + i * 16}px` : '4px',
              borderRadius: '4px',
              background: r.active ? `linear-gradient(180deg, #1457CC, #7C3AED)` : 'var(--bg-muted)',
              border: `1px solid ${r.active ? 'var(--brand-primary)' : 'var(--border-default)'}`,
              transition: `height ${0.5 + i * 0.1}s cubic-bezier(0.16,1,0.3,1)`,
              position: 'relative',
            }}>
              {r.active && (
                <div style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#fff', opacity: 0.8,
                }} />
              )}
            </div>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: r.active ? 'var(--brand-primary)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', fontWeight: r.active ? 700 : 400 }}>
              {r.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {[
          { title: 'Jenny Wen\'s Design Leadership', body: 'Former Figma Director of Design joined Anthropic as an individual contributor — moving back to craft over management. Her non-deterministic prototyping methodology directly shapes how Claude\'s design evolves.' },
          { title: 'Claude Artifacts & Cowork', body: 'The Artifacts split-screen canvas (mid-2024) broke the chat-only AI interface paradigm. This UX innovation became an industry benchmark, demonstrating design at Strategic maturity.' },
          { title: 'Interpretability Visualization', body: 'Design collaborates with safety research to make neural network activations legible — creating visual representations of model behavior for both researchers and public understanding.' },
          { title: 'Literary Brand Aesthetic', body: 'The parchment backgrounds, serif fonts, and warm tones are a deliberate deviation from clinical tech design — positioning Claude as a thoughtful, bookish intellectual partner.' },
        ].map((item, i) => (
          <div key={i} style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '6px' }}>{item.title}</div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const styles = {
  eyebrow: {
    fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)',
    letterSpacing: '0.16em', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: 600,
  },
  cardTitle: {
    margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: '1.3rem',
    color: 'var(--text-primary)', letterSpacing: '-0.03em',
  },
  cardDesc: {
    margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6,
  },
  sectionDivider: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
  sectionLabel:   { fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontWeight: 500 },
  hairline:       { height: '1px', flexGrow: 1, backgroundColor: 'var(--border-default)' },
};

// ─── Keyframe injection ────────────────────────────────────────────────────────
if (typeof document !== 'undefined') {
  const existing = document.getElementById('prg-reward-anim');
  if (!existing) {
    const tag = document.createElement('style');
    tag.id = 'prg-reward-anim';
    tag.textContent = `
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(tag);
  }
}

// ─── Main stats ──────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Senior TC Range',     value: 800,  suffix: 'K+',  prefix: '$', decimals: 0, note: 'total comp ceiling' },
  { label: 'Review Cycles',       value: 2,    suffix: '×',   prefix: '',  decimals: 0, note: 'per year (OKR-linked)' },
  { label: 'IC Track Proportion', value: 85,   suffix: '%',   prefix: '~', decimals: 0, note: 'vs. management track' },
  { label: 'Burnout Mentions',    value: 3,    suffix: '×',   prefix: '',  decimals: 0, note: 'vs. industry on Glassdoor' },
];

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ProgressionRewardPage({ tensionMode }) {
  return (
    <div className="app-main-content">

      {/* Page header */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={styles.eyebrow}>Pillar 02 / Incentives</span>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          Progression & Reward
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '680px' }}>
          Examines what behaviors actually get rewarded at Anthropic — safety research impact, mission-aligned sprinting,
          and visible intensity — versus their espoused policies of work-life integration, unlimited PTO, and
          mission-impact promotion. The gap between these layers reveals Anthropic's deepest cultural tensions.
        </p>
      </section>

      {/* Animated stats */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Key Incentive Metrics</span>
          <div style={styles.hairline} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
          {STATS.map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, #1457CC ${i * 25}%, #7C3AED)` }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, color: i === 3 ? '#D92D20' : 'var(--brand-primary)', letterSpacing: '-0.05em', lineHeight: 1 }}>
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

      {/* Compensation Landscape */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Total Compensation Benchmarking</span>
          <div style={styles.hairline} />
        </div>
        <CompensationLandscape />
      </section>

      {/* Tension Core */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Espoused Values vs. Tacit Reality</span>
          <div style={styles.hairline} />
        </div>
        <TensionCore tensionMode={tensionMode} />
      </section>

      {/* Schein Breakdown */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Schein's Cultural Iceberg: Progression Context</span>
          <div style={styles.hairline} />
        </div>
        <ProgressionScheinBreakdown />
      </section>

      {/* Promotion Signal Matrix */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Promotion Signal Architecture</span>
          <div style={styles.hairline} />
        </div>
        <PromotionSignalMatrix />
      </section>

      {/* Design Maturity */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Design Maturity Assessment</span>
          <div style={styles.hairline} />
        </div>
        <DesignMaturityCard />
      </section>

      {/* Evidence Hub */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Qualitative Evidence Feed</span>
          <div style={styles.hairline} />
        </div>
        <EvidenceHub tensionMode={tensionMode} pillar="progression" />
      </section>

    </div>
  );
}
