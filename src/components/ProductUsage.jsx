import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Users, Activity, ShieldCheck, AlertTriangle, ArrowUpRight, Search } from 'lucide-react';

export default function ProductUsage() {
  const { customerSegments, topCustomers, currentProfile, currency, triggerToast } = useAnalytics();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('ALL');

  const stickiness = parseFloat(((currentProfile.dau / currentProfile.mau) * 100).toFixed(1));

  const filteredCustomers = topCustomers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(filterQuery.toLowerCase()) || c.plan.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesPlan = selectedPlanFilter === 'ALL' || c.plan.toLowerCase().includes(selectedPlanFilter.toLowerCase());
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} style={{ color: '#06b6d4' }} />
            Customer Segments &amp; Product Stickiness
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            User engagement ratios (DAU/MAU), tier distribution, and high-value account health monitoring
          </p>
        </div>

        {/* Stickiness Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)', padding: '6px 14px', borderRadius: 'var(--radius-md)' }}>
          <Activity size={16} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stickiness (DAU/MAU):</span>
          <strong className="mono-val" style={{ color: '#10b981', fontSize: '0.95rem' }}>{stickiness}%</strong>
          <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Top Decile</span>
        </div>
      </div>

      {/* Segments Cards */}
      <div className="grid-metrics" style={{ marginBottom: '24px' }}>
        {customerSegments.map(seg => (
          <div
            key={seg.segment}
            style={{
              background: 'var(--bg-elevated)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{seg.segment}</span>
              <span
                className={`badge ${
                  seg.health === 'Excellent' ? 'badge-emerald' : seg.health === 'Good' ? 'badge-indigo' : 'badge-amber'
                }`}
                style={{ fontSize: '0.65rem' }}
              >
                {seg.health}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
              <span className="mono-val" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {formatCurrency(seg.mrrTotal, currency, true)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {seg.count} accounts ({formatCurrency(seg.arpu, currency)}/mo)
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
              <span>NRR: <strong style={{ color: '#10b981' }}>{seg.nrr}%</strong></span>
              <span>Growth: <strong style={{ color: '#6366f1' }}>{seg.growth}</strong></span>
              <span>Risk: <strong>{seg.churnRisk}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Customer Accounts Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Strategic Customer Accounts &amp; Health Radar
          </h4>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search account..."
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                width: '140px',
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 12px' }}>Customer Account</th>
                <th style={{ padding: '10px 12px' }}>Tier / Plan</th>
                <th style={{ padding: '10px 12px' }}>Seats</th>
                <th style={{ padding: '10px 12px' }}>Monthly MRR</th>
                <th style={{ padding: '10px 12px' }}>Health Score</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => {
                const isDanger = c.healthScore < 70;
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                    className="benchmark-row-hover"
                  >
                    <td style={{ padding: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      <div>{c.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.id} • {c.lastActive}</div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{c.plan}</td>
                    <td style={{ padding: '12px', fontWeight: '600' }} className="mono-val">{c.seats} seats</td>
                    <td style={{ padding: '12px', fontWeight: '800', color: '#10b981' }} className="mono-val">
                      {formatCurrency(c.mrr, currency)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${c.healthScore}%`,
                              height: '100%',
                              backgroundColor: isDanger ? '#f43f5e' : c.healthScore > 85 ? '#10b981' : '#f59e0b',
                            }}
                          />
                        </div>
                        <span className="mono-val" style={{ fontWeight: '700', fontSize: '0.75rem' }}>{c.healthScore}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        className={`badge ${
                          c.status === 'Expanding' ? 'badge-emerald' : isDanger ? 'badge-rose' : 'badge-indigo'
                        }`}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                        onClick={() => triggerToast(`Contacting account owner for ${c.name}`)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
