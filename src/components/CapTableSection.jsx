import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useAnalytics } from '../context/AnalyticsContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { PieChart as PieIcon, ShieldCheck, DollarSign, Calculator, Award } from 'lucide-react';

export default function CapTableSection() {
  const { capTable, currentProfile, currency } = useAnalytics();

  // Dilution Calculator State
  const [newCheckAmount, setNewCheckAmount] = useState(3000000);
  const [preMoneyValuation, setPreMoneyValuation] = useState(currentProfile.valuationLastRound || 25000000);

  const postMoney = preMoneyValuation + newCheckAmount;
  const newInvestorDilution = parseFloat(((newCheckAmount / postMoney) * 100).toFixed(1));

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <div style={{ fontWeight: '800', color: data.color, marginBottom: '4px' }}>{data.name}</div>
          <div style={{ fontSize: '0.775rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>Ownership: <strong>{data.equityPct}%</strong></div>
            <div>Shares: <strong>{formatNumber(data.shares)}</strong> ({data.type})</div>
            <div>Implied Value: <strong>{formatCurrency(data.value, currency)}</strong></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieIcon size={20} style={{ color: '#8b5cf6' }} />
            Capitalization Table &amp; Equity Ownership
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Share classes, investor syndicate stakes, unallocated ESOP pool, and dilution simulator
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge badge-indigo">
            Last Round Val: {formatCurrency(currentProfile.valuationLastRound, currency, true)}
          </span>
          <span className="badge badge-emerald">
            Total Capital: {formatCurrency(currentProfile.totalFunding, currency, true)}
          </span>
        </div>
      </div>

      <div className="grid-equal-two">
        {/* Left: Donut Chart & Stake List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={capTable}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="equityPct"
                >
                  {capTable.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-card-solid)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {capTable.map(item => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({item.type})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="mono-val" style={{ fontWeight: '800', color: item.color }}>{item.equityPct}%</span>
                  <span className="mono-val" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {formatCurrency(item.value, currency, true)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Round Dilution Calculator */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            <Calculator size={18} style={{ color: '#06b6d4' }} />
            Next Round Dilution Calculator
          </div>

          <div className="slider-group">
            <div className="slider-label">
              <span>Proposed Check / Round Size:</span>
              <strong className="mono-val" style={{ color: '#10b981' }}>{formatCurrency(newCheckAmount, currency, true)}</strong>
            </div>
            <input
              type="range"
              min="500000"
              max="15000000"
              step="250000"
              className="slider-input"
              value={newCheckAmount}
              onChange={e => setNewCheckAmount(Number(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <div className="slider-label">
              <span>Agreed Pre-Money Valuation:</span>
              <strong className="mono-val" style={{ color: '#6366f1' }}>{formatCurrency(preMoneyValuation, currency, true)}</strong>
            </div>
            <input
              type="range"
              min="5000000"
              max="50000000"
              step="1000000"
              className="slider-input"
              value={preMoneyValuation}
              onChange={e => setPreMoneyValuation(Number(e.target.value))}
            />
          </div>

          {/* Dilution Summary */}
          <div
            style={{
              background: 'var(--bg-input)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Implied Post-Money Valuation:</span>
              <strong className="mono-val" style={{ color: '#ffffff' }}>{formatCurrency(postMoney, currency, true)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>New Lead Investor Ownership:</span>
              <strong className="mono-val" style={{ color: '#10b981' }}>{newInvestorDilution}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Founders Post-Round Ownership:</span>
              <strong className="mono-val" style={{ color: '#6366f1' }}>
                {(54 * (1 - newInvestorDilution / 100)).toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
