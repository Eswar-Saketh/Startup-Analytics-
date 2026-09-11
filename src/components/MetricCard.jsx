import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info, CheckCircle2 } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  secondaryValue,
  trend,
  trendPeriod = 'vs last mo',
  icon: Icon,
  iconColor = '#6366f1',
  iconBg = 'rgba(99, 102, 241, 0.15)',
  benchmarkBadge,
  tooltip,
  highlight = false,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isPositive = trend >= 0;

  return (
    <div className={`glass-card metric-card ${highlight ? 'highlight' : ''}`}>
      <div className="metric-header">
        <div className="metric-title-group">
          {Icon && (
            <div className="metric-icon-wrap" style={{ backgroundColor: iconBg, color: iconColor }}>
              <Icon size={18} />
            </div>
          )}
          <span className="metric-name">{title}</span>
        </div>

        {tooltip && (
          <div style={{ position: 'relative' }}>
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              aria-label="Metric details"
            >
              <Info size={14} />
            </button>

            {showTooltip && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '240px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  zIndex: 50,
                  lineHeight: 1.4,
                  marginTop: '4px',
                }}
              >
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="metric-value-group">
        <div className="metric-value mono-val">{value}</div>
        {trend !== undefined && (
          <div className={`metric-trend ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{isPositive ? `+${trend}%` : `${trend}%`}</span>
          </div>
        )}
      </div>

      <div className="metric-footer">
        {secondaryValue ? (
          <span>{secondaryValue}</span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>{trendPeriod}</span>
        )}

        {benchmarkBadge && (
          <span
            className={`badge ${
              benchmarkBadge.type === 'emerald'
                ? 'badge-emerald'
                : benchmarkBadge.type === 'amber'
                ? 'badge-amber'
                : benchmarkBadge.type === 'rose'
                ? 'badge-rose'
                : 'badge-cyan'
            }`}
          >
            {benchmarkBadge.text}
          </span>
        )}
      </div>
    </div>
  );
}
