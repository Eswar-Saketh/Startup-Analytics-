import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useAnalytics } from '../context/AnalyticsContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  Flame,
  DollarSign,
  Users,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';

export default function ScenarioSimulator() {
  const {
    simulatorParams,
    setSimulatorParams,
    simulationResults,
    currentProfile,
    currency,
    triggerToast,
  } = useAnalytics();

  const handleSliderChange = (key, value) => {
    setSimulatorParams(prev => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const applyPreset = (presetName) => {
    if (presetName === 'aggressive') {
      setSimulatorParams({
        newHiresPerMonth: 2,
        growthRatePct: 22,
        marketingSpendDelta: 45000,
        arpuDeltaPct: 20,
        newCapitalInfusion: 5000000,
        infusionMonth: 4,
        simulationMonths: 24,
      });
      triggerToast('Applied "Aggressive Scale" Scenario');
    } else if (presetName === 'conservative') {
      setSimulatorParams({
        newHiresPerMonth: 0,
        growthRatePct: 8,
        marketingSpendDelta: 5000,
        arpuDeltaPct: 5,
        newCapitalInfusion: 1000000,
        infusionMonth: 8,
        simulationMonths: 24,
      });
      triggerToast('Applied "Conservative Runway" Scenario');
    } else {
      setSimulatorParams({
        newHiresPerMonth: 1,
        growthRatePct: currentProfile.mrrGrowthMoM || 14.8,
        marketingSpendDelta: 15000,
        arpuDeltaPct: 10,
        newCapitalInfusion: 2000000,
        infusionMonth: 6,
        simulationMonths: 24,
      });
      triggerToast('Reset to Base Scenario');
    }
  };

  const CustomSimTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="custom-chart-tooltip">
          <div style={{ fontWeight: '800', marginBottom: '8px', color: '#ffffff', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
            Month {data.month} ({data.monthLabel}) Forecast
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.775rem' }}>
            <div style={{ color: '#10b981', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>Projected Cash:</span>
              <strong className="mono-val">{formatCurrency(data.cash, currency)}</strong>
            </div>
            <div style={{ color: '#6366f1', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>Projected ARR:</span>
              <strong className="mono-val">{formatCurrency(data.arr, currency)}</strong>
            </div>
            <div style={{ color: '#f59e0b', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>Monthly Gross Burn:</span>
              <strong className="mono-val">{formatCurrency(data.grossBurn, currency)}</strong>
            </div>
            <div style={{ color: '#06b6d4', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>Team Headcount:</span>
              <strong className="mono-val">{data.headcount} team</strong>
            </div>
            {data.isCapitalMonth && (
              <div style={{ color: '#a855f7', fontWeight: '800', marginTop: '4px' }}>
                ⭐ Capital Inflow: +{formatCurrency(simulatorParams.newCapitalInfusion, currency)}
              </div>
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
            <Sliders size={20} style={{ color: '#f59e0b' }} />
            Runway & Valuation Scenario Simulator
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Interactive What-If financial model to test hiring pace, burn sensitivity, revenue growth, and fundraising needs.
          </p>
        </div>

        {/* Preset scenario shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => applyPreset('conservative')}>
            Conservative Runway
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => applyPreset('aggressive')}>
            Aggressive Scale
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => applyPreset('default')} title="Reset to standard defaults">
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Interactive Sliders Grid */}
      <div className="simulator-controls">
        {/* Hiring Pace */}
        <div className="slider-group">
          <div className="slider-label">
            <span>Hiring Pace:</span>
            <strong className="mono-val" style={{ color: '#6366f1' }}>+{simulatorParams.newHiresPerMonth} hires/mo</strong>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            className="slider-input"
            value={simulatorParams.newHiresPerMonth}
            onChange={e => handleSliderChange('newHiresPerMonth', e.target.value)}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fully burdened payroll ~$11k/employee/mo</span>
        </div>

        {/* Growth Rate Target */}
        <div className="slider-group">
          <div className="slider-label">
            <span>Target MoM Growth:</span>
            <strong className="mono-val" style={{ color: '#10b981' }}>{simulatorParams.growthRatePct}% MoM</strong>
          </div>
          <input
            type="range"
            min="2"
            max="30"
            step="1"
            className="slider-input"
            value={simulatorParams.growthRatePct}
            onChange={e => handleSliderChange('growthRatePct', e.target.value)}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Compounding monthly revenue expansion</span>
        </div>

        {/* Marketing / Ad Budget */}
        <div className="slider-group">
          <div className="slider-label">
            <span>Monthly Growth Spend:</span>
            <strong className="mono-val" style={{ color: '#06b6d4' }}>{formatCurrency(simulatorParams.marketingSpendDelta, currency, true)}/mo</strong>
          </div>
          <input
            type="range"
            min="0"
            max="80000"
            step="5000"
            className="slider-input"
            value={simulatorParams.marketingSpendDelta}
            onChange={e => handleSliderChange('marketingSpendDelta', e.target.value)}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Paid campaigns, events, partner spend</span>
        </div>

        {/* ARPU Expansion */}
        <div className="slider-group">
          <div className="slider-label">
            <span>Pricing / ARPU Shift:</span>
            <strong className="mono-val" style={{ color: '#f59e0b' }}>+{simulatorParams.arpuDeltaPct}%</strong>
          </div>
          <input
            type="range"
            min="-10"
            max="40"
            step="5"
            className="slider-input"
            value={simulatorParams.arpuDeltaPct}
            onChange={e => handleSliderChange('arpuDeltaPct', e.target.value)}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tier restructuring and add-on attach rate</span>
        </div>

        {/* Capital Infusion Check */}
        <div className="slider-group">
          <div className="slider-label">
            <span>Next Funding Round Check:</span>
            <strong className="mono-val" style={{ color: '#a855f7' }}>{formatCurrency(simulatorParams.newCapitalInfusion, currency, true)}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="10000000"
            step="500000"
            className="slider-input"
            value={simulatorParams.newCapitalInfusion}
            onChange={e => handleSliderChange('newCapitalInfusion', e.target.value)}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Simulate cash in Month {simulatorParams.infusionMonth}</span>
        </div>
      </div>

      {/* Real-time Projected Outputs */}
      <div className="simulator-kpis">
        <div className="sim-kpi-card">
          <div className="sim-kpi-title">24-Month Ending ARR</div>
          <div className="sim-kpi-val mono-val" style={{ color: '#6366f1' }}>
            {formatCurrency(simulationResults.finalARR, currency, true)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            vs Current {formatCurrency(currentProfile.arr, currency, true)}
          </div>
        </div>

        <div className="sim-kpi-card">
          <div className="sim-kpi-title">Estimated Next Valuation</div>
          <div className="sim-kpi-val mono-val" style={{ color: '#10b981' }}>
            {formatCurrency(simulationResults.estimatedValuation, currency, true)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Multiple: {simulationResults.valuationMultiple}x ARR
          </div>
        </div>

        <div className="sim-kpi-card">
          <div className="sim-kpi-title">Zero-Cash Month</div>
          <div className="sim-kpi-val mono-val" style={{ color: simulationResults.zeroCashMonth ? '#f43f5e' : '#10b981' }}>
            {simulationResults.zeroCashMonth ? `Month ${simulationResults.zeroCashMonth}` : '> 24 Months'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {simulationResults.zeroCashMonth ? 'Needs capital before' : 'Fully Funded / Sustainable'}
          </div>
        </div>

        <div className="sim-kpi-card">
          <div className="sim-kpi-title">Break-Even Status</div>
          <div className="sim-kpi-val mono-val" style={{ color: simulationResults.breakEvenMonth ? '#06b6d4' : '#f59e0b' }}>
            {simulationResults.breakEvenMonth ? `Month ${simulationResults.breakEvenMonth}` : 'Post-24M'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Cash-flow positive milestone
          </div>
        </div>
      </div>

      {/* 24-Month Forecast Chart */}
      <div style={{ width: '100%', height: '300px', marginTop: '24px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={simulationResults.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="simCashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="monthLabel" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickFormatter={val => formatCurrency(val, currency, true)}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomSimTooltip />} />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '8px', fontSize: '0.75rem' }} />
            <Area
              type="monotone"
              dataKey="cash"
              name="Projected Treasury Cash"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#simCashGrad)"
            />
            <Line
              type="monotone"
              dataKey="arr"
              name="Projected ARR"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 3, fill: '#6366f1' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
