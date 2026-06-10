import React, { useState } from 'react';
import GoffeeJonesGrid from './GoffeeJonesGrid';
import DesignMaturity from './DesignMaturity';

// ─── Synthesis Pillar Linkage Cards ──────────────────────────────────────────
const PILLAR_LINKAGES = [
  {
    pillar: 'Pillar 01 / Selection',
    title: 'Hiring as Culture Pre-Filter',
    accent: 'var(--brand-primary)',
    body: 'The 6–8 round recruitment pipeline (featuring the mission-fit panel and take-home safety case study) acts as a strict selector. By filtering out commercial opportunists and selecting only true alignment believers, Anthropic pre-engineers its High Solidarity before Day 1. By vetting for low-ego intellectual humility, they secure the High Sociability that anchors them in the Communal quadrant.',
  },
  {
    pillar: 'Pillar 02 / Progression',
    title: 'The Incentive-Burnout Loop',
    accent: 'var(--brand-primary-dark)',
    body: 'Flat title hierarchies (MTS) and compensation PIUs focus efforts entirely on long-term safety research frontiers. However, because individual career progression is tied to safety sprint outputs, the unlimited PTO policy becomes a liability: the unwritten rule remains "burnout proves commitment," causing boundary collapse under the guise of existential urgency.',
  },
  {
    pillar: 'Pillar 03 / Governance',
    title: 'Charter Duty vs. Compute Debt',
    accent: 'var(--accent-orange)',
    body: 'Delaware PBC fiduciary shields protect safety delay decisions from standard shareholder lawsuits. Yet, the $100B+ compute mortgages to Google and Amazon create commercial monetization loops. This compute trap resulted in the dilution of the RSP (v3.0+) from unilateral hard pauses to flexible risk mitigation reporting, forcing safety teams to run in competitor velocity cycles.',
  },
  {
    pillar: 'Pillar 04 / Rituals',
    title: 'Greenhouse Biophilia vs. Panama Sourcing',
    accent: 'var(--brand-primary)',
    body: 'Claude\'s clay-pulp typography (Lora serifs) and SF Howard Street plant installations project a scholarly library vibe designed to build public trust. This digital and physical biophilic brand stands in direct contradiction with aggressive data harvesting behaviors, such as the scan-and-destroy book ingestion of Project Panama.',
  },
];

const GROUP2_RECOMMENDATIONS = [
  {
    title: '1. Establish Mandatory Annual Rest Minimums',
    body: 'Abolish the unlimited PTO policy in favor of mandatory quarterly rest weeks to break the tacit assumption that burnout is a badge of mission alignment.',
  },
  {
    title: '2. Formalize Product Management Authority',
    body: 'Grant product managers equal authority to safety researchers on launch timelines, reducing the consensus gridlock that slows down API and feature delivery.',
  },
  {
    title: '3. Fiduciary Isolation of Compute Liabilities',
    body: 'Appoint an independent LTBT audit committee to review pre-training cluster allocations, ensuring that cloud partner debts do not compress safety evaluation windows.',
  },
];

export default function SynthesisPage({ tensionMode }) {
  const [selectedPillar, setSelectedPillar] = useState(0);

  return (
    <div className="app-main-content">
      {/* Page header */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={styles.eyebrow}>Pillar 05 / Evaluation</span>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          Synthesis & Typology
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '680px', fontFamily: 'var(--font-sans)' }}>
          Integrates our diagnostic findings across all four pillars. Explore where Anthropic plots on the Goffee-Jones grid relative to competitors, review design maturity radar parameters, and trace how selection, incentives, governance, and branding compound into a cohesive but fragile Communal culture.
        </p>
      </section>

      {/* Synthesis Metric Stats */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Diagnostic Summary</span>
          <div style={styles.hairline} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {[
            { label: 'Typology quadrant', value: 'COMMUNAL', note: 'High Soc. / High Sol.', color: 'var(--brand-primary)' },
            { label: 'Tension Spotlight Index', value: 'CRITICAL', note: 'Active Burnout & Compute Traps', color: 'var(--accent-red)' },
            { label: 'Design Maturity Score', value: '4.2 / 5.0', note: 'Integrated / Strategic', color: 'var(--brand-primary-dark)' },
            { label: 'Diagnostic Coverage', value: '100%', note: '4 Pillars Audited', color: 'var(--brand-primary)' },
          ].map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: s.color }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', letterSpacing: '-0.01em', fontFamily: 'var(--font-sans)' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-Pillar Linkage Synthesis */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Cross-Pillar Linkage Analysis</span>
          <div style={styles.hairline} />
        </div>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={styles.eyebrow}>ORGANIZATIONAL SYSTEM INTEGRATION</span>
            <h3 style={styles.cardTitle}>How the Pillars Interlock</h3>
            <p style={styles.cardDesc}>
              Select a pillar below to analyze how hiring screening, promotion rules, legal governance, and workspace rituals integrate to shape Anthropic's cultural archetype.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', lgDirection: 'row', gap: '20px' }}>
            {/* Left selector buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
              {PILLAR_LINKAGES.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPillar(idx)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--r-md)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: `1.5px solid ${selectedPillar === idx ? link.accent : 'var(--border-default)'}`,
                    background: selectedPillar === idx ? 'var(--bg-muted)' : 'transparent',
                    transition: 'all 0.2s var(--ease-settle)',
                  }}
                >
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {link.pillar}
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: selectedPillar === idx ? link.accent : 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                    {link.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Right details display */}
            <div style={{ flex: 1 }}>
              <div style={{
                padding: '24px',
                borderRadius: 'var(--r-md)',
                background: 'var(--bg-muted)',
                border: `1px solid var(--border-default)`,
                borderLeft: `5px solid ${PILLAR_LINKAGES[selectedPillar].accent}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: PILLAR_LINKAGES[selectedPillar].accent, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                  Typology Integration Signal
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px', fontFamily: 'var(--font-sans)' }}>
                  {PILLAR_LINKAGES[selectedPillar].title}
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65, fontFamily: 'var(--font-sans)' }}>
                  {PILLAR_LINKAGES[selectedPillar].body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goffee-Jones Interactive Matrix */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Goffee-Jones Sociability vs. Solidarity Grid</span>
          <div style={styles.hairline} />
        </div>
        <GoffeeJonesGrid tensionMode={tensionMode} />
      </section>

      {/* Design Maturity Radar */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Design Maturity Radar Metrics</span>
          <div style={styles.hairline} />
        </div>
        <DesignMaturity tensionMode={tensionMode} />
      </section>

      {/* Strategic Recommendations Panel */}
      <section>
        <div style={styles.sectionDivider}>
          <span style={styles.sectionLabel}>Group 2 Strategic Recommendations</span>
          <div style={styles.hairline} />
        </div>
        <div className="glass-panel" style={{ padding: '32px', borderTop: '3px solid var(--brand-primary)' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={styles.eyebrow}>LbD CLASS GROUP 2 RECOMMENDATIONS</span>
            <h3 style={styles.cardTitle}>Addressing the Communal Fragility</h3>
            <p style={styles.cardDesc}>
              Actionable governance and operational updates designed by Group 2 to stabilize work-life balance and operational efficiency while preserving the safety mission.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {GROUP2_RECOMMENDATIONS.map((rec, i) => (
              <div key={i} style={{ padding: '18px', borderRadius: 'var(--r-md)', background: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                  {rec.title}
                </h4>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55, fontFamily: 'var(--font-sans)' }}>
                  {rec.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

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
