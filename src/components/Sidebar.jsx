import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  LayoutDashboard,
  TrendingUp,
  Grid3X3,
  Sliders,
  Award,
  PieChart,
  Users,
  Activity,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency, calculateRunwayMonths, calculateZeroCashDate } from '../utils/formatters';

export default function Sidebar() {
  const { activeTab, setActiveTab, currentProfile, currency } = useAnalytics();

  const navItems = [
    { id: 'overview', label: 'Executive Cockpit', icon: LayoutDashboard },
    { id: 'revenue', label: 'Revenue Dynamics', icon: TrendingUp },
    { id: 'cohorts', label: 'Cohort Retention', icon: Grid3X3 },
    { id: 'simulator', label: 'Runway Modeler', icon: Sliders, badge: 'What-If' },
    { id: 'benchmarks', label: 'Series A Benchmarks', icon: Award },
    { id: 'captable', label: 'Cap Table & Equity', icon: PieChart },
    { id: 'customers', label: 'Segments & Usage', icon: Users },
  ];

  const runwayMonths = calculateRunwayMonths(currentProfile.cashInBank, currentProfile.monthlyNetBurn);
  const runwayPct = Math.min(100, Math.max(10, (runwayMonths / 36) * 100));

  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Activity size={22} />
        </div>
        <div>
          <div className="brand-title">FoundryIQ</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.06em' }}>
            STARTUP INTELLIGENCE OS
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Runway Widget */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '6px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '6px', color: '#10b981' }}>
            <Flame size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Runway Health
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Net Burn: {formatCurrency(currentProfile.monthlyNetBurn, currency, true)}/mo
            </div>
          </div>
        </div>

        <div className="runway-gauge-label" style={{ marginTop: '4px' }}>
          <span>{runwayMonths >= 900 ? 'Infinite' : `${runwayMonths} Months`}</span>
          <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(currentProfile.cashInBank, currency, true)} Cash</span>
        </div>

        <div className="runway-bar-bg">
          <div
            className="runway-bar-fill"
            style={{
              width: `${runwayPct}%`,
              background: runwayMonths < 12 ? 'linear-gradient(90deg, #f43f5e 0%, #fb7185 100%)' :
                          runwayMonths < 18 ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' :
                          'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
            }}
          />
        </div>

        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2px' }}>
          Zero-Cash: <strong style={{ color: 'var(--text-secondary)' }}>{calculateZeroCashDate(runwayMonths)}</strong>
        </div>
      </div>
    </aside>
  );
}
