import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Grid3X3, ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';

export default function CohortHeatmap() {
  const { cohorts, currency } = useAnalytics();
  const [metricMode, setMetricMode] = useState('revenue'); // 'revenue' (NRR %) or 'logo' (User count %)
  const [hoveredCell, setHoveredCell] = useState(null);

  const months = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11'];

  const getCellColor = (val) => {
    if (val === null || val === undefined) return 'transparent';

    if (val >= 120) return 'rgba(16, 185, 129, 0.85)'; // Radiant Emerald (>120% expansion)
    if (val >= 110) return 'rgba(16, 185, 129, 0.65)';
    if (val >= 100) return 'rgba(6, 182, 212, 0.60)'; // Teal
    if (val >= 95) return 'rgba(99, 102, 241, 0.55)'; // Indigo
    if (val >= 90) return 'rgba(99, 102, 241, 0.35)';
    if (val >= 80) return 'rgba(245, 158, 11, 0.45)'; // Amber
    return 'rgba(244, 63, 94, 0.5)'; // Rose (<80%)
  };

  const getTextColor = (val) => {
    if (val === null || val === undefined) return 'var(--text-muted)';
    if (val >= 95) return '#ffffff';
    return '#f1f5f9';
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Grid3X3 size={20} style={{ color: '#06b6d4' }} />
            Cohort Retention & Expansion Matrix
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Track how customer cohorts expand over time. Values &gt; 100% indicate net negative churn (expansion).
          </p>
        </div>

        {/* View mode toggle */}
        <div className="segmented-control">
          <button
            className={`segment-btn ${metricMode === 'revenue' ? 'active' : ''}`}
            onClick={() => setMetricMode('revenue')}
          >
            Net Revenue Retention ($)
          </button>
          <button
            className={`segment-btn ${metricMode === 'logo' ? 'active' : ''}`}
            onClick={() => setMetricMode('logo')}
          >
            Logo Retention (%)
          </button>
        </div>
      </div>

      {/* Cohort Matrix Table */}
      <div className="cohort-container">
        <table className="cohort-table">
          <thead>
            <tr>
              <th className="cohort-th" style={{ textAlign: 'left', minWidth: '110px' }}>Cohort</th>
              <th className="cohort-th" style={{ minWidth: '80px' }}>Size</th>
              <th className="cohort-th" style={{ minWidth: '90px' }}>Initial MRR</th>
              {months.map((m, i) => (
                <th key={m} className="cohort-th" style={{ minWidth: '55px' }}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((row, rIdx) => (
              <tr key={row.cohort}>
                <td className="cohort-row-header">{row.cohort}</td>
                <td style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {row.size} accounts
                </td>
                <td style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {formatCurrency(row.initialMRR, currency, true)}
                </td>
                {months.map((m, cIdx) => {
                  const key = `m${cIdx}`;
                  let val = row[key];

                  // In logo mode, simulate logo retention (starts at 100%, slightly decays to 85-92%)
                  if (metricMode === 'logo' && val !== null) {
                    val = Math.max(75, Math.round(100 - cIdx * 1.8 - (rIdx % 3)));
                  }

                  const hasVal = val !== null && val !== undefined;

                  return (
                    <td
                      key={key}
                      className="cohort-cell mono-val"
                      style={{
                        backgroundColor: getCellColor(val),
                        color: getTextColor(val),
                        border: hasVal ? '1px solid rgba(255,255,255,0.08)' : '1px dashed rgba(255,255,255,0.03)',
                      }}
                      onMouseEnter={() => setHoveredCell({ row, month: m, val, monthIndex: cIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {hasVal ? `${val}%` : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dynamic Hover Details / Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.775rem',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {hoveredCell ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-elevated)', padding: '6px 14px', borderRadius: '8px' }}>
            <span style={{ color: '#06b6d4', fontWeight: '700' }}>{hoveredCell.row.cohort} • {hoveredCell.month}</span>
            <span>Retained: <strong>{hoveredCell.val}%</strong></span>
            <span>Est. MRR: <strong>{formatCurrency(Math.round(hoveredCell.row.initialMRR * (hoveredCell.val / 100)), currency)}</strong></span>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>
            Hover over any cell to see real-time expansion analytics
          </div>
        )}

        {/* Color Intensity Scale Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Intensity:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(244, 63, 94, 0.5)', color: '#fff', fontSize: '0.7rem' }}>&lt;80%</span>
            <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.45)', color: '#fff', fontSize: '0.7rem' }}>80-94%</span>
            <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.55)', color: '#fff', fontSize: '0.7rem' }}>95-100%</span>
            <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.85)', color: '#fff', fontSize: '0.7rem' }}>&gt;110% (Expansion)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
