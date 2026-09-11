import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { formatNumber } from '../utils/formatters';
import { Filter, ArrowDown, Zap, Clock, AlertCircle } from 'lucide-react';

export default function FunnelChart() {
  const { funnel } = useAnalytics();

  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={20} style={{ color: '#ec4899' }} />
            Product-Led Growth (PLG) Conversion Funnel
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Conversion velocity, bottleneck drop-offs, and cycle time across customer lifecycle
          </p>
        </div>

        <span className="badge badge-emerald">Overall Conversion: 0.79% (Top 15%)</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {funnel.map((item, index) => {
          const widthPct = Math.max(18, Math.min(100, (item.count / funnel[0].count) * 100));
          const isBottleneck = index === 3; // PQL conversion stage

          return (
            <div
              key={item.stage}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                background: 'var(--bg-elevated)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                border: isBottleneck ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: colors[index % colors.length],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                    }}
                  >
                    {index + 1}
                  </span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.stage}</span>
                  {isBottleneck && (
                    <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      Primary Optimization Leak
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono-val" style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {formatNumber(item.count)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {item.avgTime !== '-' ? `Avg: ${item.avgTime}` : 'Baseline'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress visual bar */}
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${widthPct}%`,
                    background: `linear-gradient(90deg, ${colors[index % colors.length]} 0%, ${colors[(index + 1) % colors.length]} 100%)`,
                    borderRadius: '4px',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                <span>Step Conversion: <strong style={{ color: colors[index % colors.length] }}>{item.rate}%</strong></span>
                <span>Drop-off: <strong style={{ color: '#f43f5e' }}>{item.drop}</strong></span>
                <span>Benchmark: <strong style={{ color: 'var(--text-secondary)' }}>{item.benchmark}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
