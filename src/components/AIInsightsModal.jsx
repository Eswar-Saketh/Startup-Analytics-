import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { formatCurrency } from '../utils/formatters';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Copy,
  TrendingUp,
  Flame,
} from 'lucide-react';

export default function AIInsightsModal() {
  const { showAiModal, setShowAiModal, currentProfile, investorReadinessScore, currency, triggerToast } = useAnalytics();

  if (!showAiModal) return null;

  const copyToClipboard = () => {
    const text = `FoundryIQ AI Executive Intelligence Brief for ${currentProfile.name} (${currentProfile.stage}):
• ARR: ${formatCurrency(currentProfile.arr, currency)} (${currentProfile.mrrGrowthMoM}% MoM Growth)
• NRR: ${currentProfile.nrr}% (Top Decile SaaS Benchmark)
• Burn Efficiency: Burn Multiple ${currentProfile.burnMultiple}x with ${currentProfile.cacPaybackMonths}mo CAC Payback
• Investor Readiness Score: ${investorReadinessScore}/100`;

    navigator.clipboard?.writeText(text);
    triggerToast('Copied AI Executive Brief to clipboard!');
  };

  return (
    <div className="modal-backdrop" onClick={() => setShowAiModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                AI Executive Intelligence Brief
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Synthesized telemetry analysis for {currentProfile.name} • {currentProfile.stage}
              </p>
            </div>
          </div>

          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
            onClick={() => setShowAiModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Readiness Score Highlight Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>
              Fundraising Index
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
              Series A Readiness: <span style={{ color: '#10b981' }}>{investorReadinessScore}/100</span> (Strong Outperformer)
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Current trajectory exceeds 88% of B2B SaaS startups in the same ARR cohort.
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={copyToClipboard}>
            <Copy size={14} />
            <span>Copy Brief</span>
          </button>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. Key Strengths */}
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#10b981', fontWeight: '700', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} />
              <span>Core Operational Strengths</span>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong>World-class Net Revenue Retention ({currentProfile.nrr}%):</strong> Existing customer cohorts expand naturally without heavy sales overhead, indicating deep workflow integration.
              </li>
              <li>
                <strong>Capital-Efficient Burn Multiple ({currentProfile.burnMultiple}x):</strong> Every dollar of net burn generates over $1.38 in net-new ARR.
              </li>
              <li>
                <strong>Short CAC Payback Period ({currentProfile.cacPaybackMonths} Months):</strong> Fast payback cycle enables aggressive self-funded reinvestment into outbound channels.
              </li>
            </ul>
          </div>

          {/* 2. Critical Friction Points */}
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#f59e0b', fontWeight: '700', fontSize: '0.9rem' }}>
              <AlertTriangle size={18} />
              <span>Identified Growth Bottlenecks</span>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong>PQL-to-Paid Conversion Drop (58% drop-off):</strong> Free trial users hit onboarding fatigue at the webhook configuration stage.
              </li>
              <li>
                <strong>Mid-Market Pricing Compression:</strong> Average ARPU (${currentProfile.arpu}) is slightly below median for enterprise automation peers.
              </li>
            </ul>
          </div>

          {/* 3. Actionable Recommendations */}
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#06b6d4', fontWeight: '700', fontSize: '0.9rem' }}>
              <Lightbulb size={18} />
              <span>High-ROI Strategic Action Items</span>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong>Implement Usage-Based Add-ons:</strong> Introduce consumption-based overage charges for AI queries to capture additional expansion upside.
              </li>
              <li>
                <strong>Automated In-App Activation Playbook:</strong> Trigger automated interactive walkthroughs when a team invites 3+ members within 48 hours.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button className="btn btn-secondary" onClick={() => setShowAiModal(false)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => { setShowAiModal(false); triggerToast('Applied AI recommendations to Scenario Modeler!'); }}>
            Simulate Strategy in Modeler
          </button>
        </div>
      </div>
    </div>
  );
}
