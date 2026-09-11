import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useAnalytics } from '../context/AnalyticsContext';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, Layers, BarChart2 } from 'lucide-react';

export default function RevenueChart() {
  const { revenueHistory, currency, currentProfile } = useAnalytics();
  const [viewMode, setViewMode] = useState('dynamics'); // 'dynamics', 'arr_trend', 'net_mrr'

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="custom-chart-tooltip">
          <div style={{ fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
            {label} Revenue Analysis
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.775rem' }}>
            {viewMode === 'dynamics' && (
              <>
                <div style={{ color: '#10b981', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span>+ New MRR:</span>
                  <strong className="mono-val">{formatCurrency(data.newMRR, currency)}</strong>
                </div>
                <div style={{ color: '#06b6d4', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span>+ Expansion MRR:</span>
                  <strong className="mono-val">{formatCurrency(data.expansionMRR, currency)}</strong>
                </div>
                <div style={{ color: '#8b5cf6', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span>+ Reactivation:</span>
                  <strong className="mono-val">{formatCurrency(data.reactivationMRR, currency)}</strong>
                </div>
                <div style={{ color: '#f59e0b', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span>- Contraction:</span>
                  <strong className="mono-val">{formatCurrency(Math.abs(data.contractionMRR), currency)}</strong>
                </div>
                <div style={{ color: '#f43f5e', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span>- Churn MRR:</span>
                  <strong className="mono-val">{formatCurrency(Math.abs(data.churnMRR), currency)}</strong>
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', marginTop: '2px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span>Total Ending MRR:</span>
                  <strong className="mono-val" style={{ color: '#6366f1' }}>{formatCurrency(data.totalMRR, currency)}</strong>
                </div>
              </>
            )}

            {viewMode === 'arr_trend' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#6366f1' }}>
                  <span>Ending ARR:</span>
                  <strong className="mono-val">{formatCurrency(data.arr, currency)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#10b981' }}>
                  <span>Cash in Treasury:</span>
                  <strong className="mono-val">{formatCurrency(data.cash, currency)}</strong>
                </div>
              </>
            )}

            {viewMode === 'net_mrr' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#10b981' }}>
                  <span>Net New MRR:</span>
                  <strong className="mono-val">+{formatCurrency(data.netNewMRR, currency)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#6366f1' }}>
                  <span>Total MRR:</span>
                  <strong className="mono-val">{formatCurrency(data.totalMRR, currency)}</strong>
                </div>
              </>
            )}
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
            <BarChart2 size={20} style={{ color: 'var(--primary)' }} />
            Revenue Dynamics & MRR Waterfall
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            MoM breakdown of New Bookings, Expansions, Churn, and Net ARR growth
          </p>
        </div>

        {/* View Toggle */}
        <div className="segmented-control">
          <button
            className={`segment-btn ${viewMode === 'dynamics' ? 'active' : ''}`}
            onClick={() => setViewMode('dynamics')}
          >
            MRR Dynamics Waterfall
          </button>
          <button
            className={`segment-btn ${viewMode === 'arr_trend' ? 'active' : ''}`}
            onClick={() => setViewMode('arr_trend')}
          >
            Cumulative ARR
          </button>
          <button
            className={`segment-btn ${viewMode === 'net_mrr' ? 'active' : ''}`}
            onClick={() => setViewMode('net_mrr')}
          >
            Net New MRR
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: '340px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'dynamics' ? (
            <ComposedChart data={revenueHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={val => formatCurrency(val, currency, true)}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '0.75rem' }}
              />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
              <Bar dataKey="newMRR" name="New MRR" fill="#10b981" stackId="positive" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expansionMRR" name="Expansion" fill="#06b6d4" stackId="positive" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reactivationMRR" name="Reactivation" fill="#8b5cf6" stackId="positive" radius={[4, 4, 0, 0]} />
              <Bar dataKey="contractionMRR" name="Contraction" fill="#f59e0b" stackId="negative" radius={[0, 0, 4, 4]} />
              <Bar dataKey="churnMRR" name="Churn" fill="#f43f5e" stackId="negative" radius={[0, 0, 4, 4]} />
              <Line
                type="monotone"
                dataKey="totalMRR"
                name="Total MRR"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1' }}
              />
            </ComposedChart>
          ) : viewMode === 'arr_trend' ? (
            <AreaChart data={revenueHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={val => formatCurrency(val, currency, true)}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="arr"
                name="ARR"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#arrGradient)"
              />
            </AreaChart>
          ) : (
            <ComposedChart data={revenueHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={val => formatCurrency(val, currency, true)}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="netNewMRR" name="Net New MRR" fill="#10b981" radius={[6, 6, 0, 0]} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Mini Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Latest MRR: </span>
            <strong className="mono-val" style={{ color: '#10b981' }}>{formatCurrency(currentProfile.mrr, currency)}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Annual Run-Rate: </span>
            <strong className="mono-val" style={{ color: '#6366f1' }}>{formatCurrency(currentProfile.arr, currency)}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Net Margin: </span>
            <strong className="mono-val" style={{ color: '#06b6d4' }}>{currentProfile.grossMargin}%</strong>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '700' }}>
          <TrendingUp size={16} />
          <span>MoM Growth: +{currentProfile.mrrGrowthMoM}%</span>
        </div>
      </div>
    </div>
  );
}
