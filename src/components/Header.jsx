import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  Building2,
  ChevronDown,
  Sparkles,
  Download,
  Moon,
  Sun,
  Radio,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function Header() {
  const {
    currentProfile,
    profiles,
    setSelectedProfileId,
    currency,
    setCurrency,
    dateRange,
    setDateRange,
    theme,
    toggleTheme,
    isLiveTelemetryActive,
    setIsLiveTelemetryActive,
    setShowAiModal,
    setShowExportModal,
    investorReadinessScore,
    triggerToast,
  } = useAnalytics();

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  const dateRanges = ['30D', '90D', 'YTD', '1Y', 'ALL'];
  const currencies = ['USD', 'EUR', 'GBP', 'INR'];

  return (
    <header className="dashboard-header">
      <div className="header-left">
        {/* Company Profile Switcher */}
        <div style={{ position: 'relative' }}>
          <div
            className="company-selector"
            onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
          >
            <div
              className="company-avatar"
              style={{ backgroundColor: currentProfile.logoColor }}
            >
              {currentProfile.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="company-meta">
              <h2>
                {currentProfile.name}
                <span className="badge badge-indigo">{currentProfile.stage}</span>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </h2>
              <p>{currentProfile.industry} • {currentProfile.headcount} Team</p>
            </div>
          </div>

          {companyDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '8px',
                width: '320px',
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                zIndex: 100,
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Select Startup Demo Profile
              </div>
              {profiles.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProfileId(p.id);
                    setCompanyDropdownOpen(false);
                    triggerToast(`Switched profile to ${p.name} (${p.stage})`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: p.id === currentProfile.id ? 'var(--bg-elevated)' : 'transparent',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: p.logoColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                    }}
                  >
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {p.stage} • ${Math.round(p.arr / 1000)}k ARR
                    </div>
                  </div>
                  {p.id === currentProfile.id && (
                    <span className="badge badge-emerald">Active</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Readiness Score Pill */}
        <div
          className="badge badge-purple"
          style={{ cursor: 'pointer', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={() => setShowAiModal(true)}
          title="Click to view AI Executive Summary & Investor Readiness report"
        >
          <Award size={14} />
          <span>Investor Readiness: {investorReadinessScore}/100</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="header-actions">
        {/* Currency Switcher */}
        <div className="segmented-control">
          {currencies.map(c => (
            <button
              key={c}
              className={`segment-btn ${currency === c ? 'active' : ''}`}
              onClick={() => {
                setCurrency(c);
                triggerToast(`Currency converted to ${c}`);
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Date Range Selector */}
        <div className="segmented-control">
          {dateRanges.map(d => (
            <button
              key={d}
              className={`segment-btn ${dateRange === d ? 'active' : ''}`}
              onClick={() => {
                setDateRange(d);
                triggerToast(`Timeline filtered to ${d}`);
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Live Telemetry Pulse */}
        <button
          className={`btn btn-secondary btn-sm ${isLiveTelemetryActive ? '' : ''}`}
          onClick={() => {
            setIsLiveTelemetryActive(!isLiveTelemetryActive);
            triggerToast(isLiveTelemetryActive ? 'Live telemetry paused' : 'Live telemetry resumed');
          }}
          style={{
            borderColor: isLiveTelemetryActive ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)',
          }}
          title="Toggle live event stream simulation"
        >
          <Radio
            size={14}
            color={isLiveTelemetryActive ? '#10b981' : 'var(--text-muted)'}
            style={{ animation: isLiveTelemetryActive ? 'pulse 1.5s infinite' : 'none' }}
          />
          <span style={{ fontSize: '0.775rem' }}>
            {isLiveTelemetryActive ? 'Live Sync' : 'Paused'}
          </span>
        </button>

        {/* AI Copilot Brief */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAiModal(true)}
        >
          <Sparkles size={14} />
          <span>AI Executive Brief</span>
        </button>

        {/* Export Report */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowExportModal(true)}
        >
          <Download size={14} />
          <span>Export</span>
        </button>

        {/* Theme Toggle */}
        <button
          className="btn btn-secondary btn-icon-only"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
