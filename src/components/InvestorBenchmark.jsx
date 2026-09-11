import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { SAAS_BENCHMARKS } from '../data/benchmarks';
import { formatCurrency } from '../utils/formatters';
import { Award, CheckCircle, AlertTriangle, ArrowUpRight, HelpCircle, Shield } from 'lucide-react';

export default function InvestorBenchmark() {
  const { currentProfile, benchmarks, investorReadinessScore, currency } = useAnalytics();

  const getMetricActual = (key) => {
    switch (key) {
      case 'arrGrowth':
        return `${currentProfile.mrrGrowthMoM * 12}%`;
      case 'nrr':
        return `${currentProfile.nrr}%`;
      case 'grossMargin':
        return `${currentProfile.grossMargin}%`;
      case 'cacPayback':
        return `${currentProfile.cacPaybackMonths} mo`;
      case 'magicNumber':
        return `${currentProfile.magicNumber}x`;
      case 'ruleOf40':
        return `${currentProfile.ruleOf40}%`;
      case 'burnMultiple':
        return `${currentProfile.burnMultiple}x`;
      default:
        return '—';
    }
  };

  const getMetricRawValue = (key) => {
    switch (key) {
      case 'arrGrowth':
        return currentProfile.mrrGrowthMoM * 12;
      case 'nrr':
        return currentProfile.nrr;
      case 'grossMargin':
        return currentProfile.grossMargin;
      case 'cacPayback':
        return currentProfile.cacPaybackMonths;
      case 'magicNumber':
        return currentProfile.magicNumber;
      case 'ruleOf40':
        return currentProfile.ruleOf40;
      case 'burnMultiple':
        return currentProfile.burnMultiple;
      default:
        return 0;
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { text: 'Top 10% (Elite)', class: 'badge-emerald' };
    if (score >= 75) return { text: 'Top Quartile (Strong)', class: 'badge-indigo' };
    if (score >= 50) return { text: 'Median (Fair)', class: 'badge-amber' };
    return { text: 'Needs Improvement', class: 'badge-rose' };
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} style={{ color: '#a855f7' }} />
            Series A & B Investor Readiness Scorecard
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Benchmark comparison against Top Quartile Bessemer &amp; Y Combinator SaaS standards
          </p>
        </div>

        {/* Big Overall Grade Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-elevated)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Series A Readiness Index
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: investorReadinessScore >= 85 ? '#10b981' : '#f59e0b' }}>
              {investorReadinessScore}/100 Grade {investorReadinessScore >= 90 ? 'A+' : investorReadinessScore >= 80 ? 'A' : 'B'}
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Shield size={22} />
          </div>
        </div>
      </div>

      {/* Benchmark Rows Table */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '700px' }}>
          {/* Header */}
          <div className="benchmark-row" style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
            <div>KPI Metric &amp; Calculation</div>
            <div style={{ textAlign: 'center' }}>Current Startup</div>
            <div style={{ textAlign: 'center' }}>Top Quartile Standard</div>
            <div style={{ textAlign: 'center' }}>Median Baseline</div>
            <div style={{ textAlign: 'center' }}>Evaluation</div>
          </div>

          {/* Rows */}
          {benchmarks.map(bm => {
            const rawVal = getMetricRawValue(bm.key);
            const score = bm.getScore(rawVal);
            const badge = getScoreBadge(score);

            return (
              <div key={bm.key} className="benchmark-row">
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {bm.name}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {bm.description}
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontWeight: '800', fontSize: '0.95rem' }} className="mono-val">
                  <span style={{ color: score >= 75 ? '#10b981' : '#f59e0b' }}>
                    {getMetricActual(bm.key)}
                  </span>
                </div>

                <div style={{ textAlign: 'center', color: '#818cf8', fontWeight: '600', fontSize: '0.8rem' }}>
                  {bm.topQuartile}
                </div>

                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {bm.median}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span className={`badge ${badge.class}`} style={{ fontSize: '0.7rem' }}>
                    {badge.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Takeaway Banner */}
      <div
        style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.825rem',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={18} style={{ color: '#10b981' }} />
          <span>
            <strong>Fundraising Readiness Verdict:</strong> Current trajectory exhibits strong product-market fit with {currentProfile.nrr}% NRR and {currentProfile.cacPaybackMonths}mo payback, well exceeding Series A minimum thresholds.
          </span>
        </div>
      </div>
    </div>
  );
}
