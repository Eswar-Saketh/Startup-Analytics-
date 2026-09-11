import React, { useEffect } from 'react';
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import RevenueChart from './components/RevenueChart';
import CohortHeatmap from './components/CohortHeatmap';
import FunnelChart from './components/FunnelChart';
import ScenarioSimulator from './components/ScenarioSimulator';
import CapTableSection from './components/CapTableSection';
import InvestorBenchmark from './components/InvestorBenchmark';
import ProductUsage from './components/ProductUsage';
import LiveActivityFeed from './components/LiveActivityFeed';
import AIInsightsModal from './components/AIInsightsModal';
import ExportReportModal from './components/ExportReportModal';
import {
  DollarSign,
  TrendingUp,
  Users,
  Flame,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  Layers,
  PieChart,
  CheckCircle,
  Compass,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency, calculateRunwayMonths, calculateLTVtoCAC } from './utils/formatters';

function DashboardContent() {
  const {
    theme,
    activeTab,
    currentProfile,
    currency,
    toastMessage,
    investorReadinessScore,
    setShowAiModal,
  } = useAnalytics();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const runwayMonths = calculateRunwayMonths(currentProfile.cashInBank, currentProfile.monthlyNetBurn);
  const ltvCacRatio = calculateLTVtoCAC(currentProfile.ltv, currentProfile.cac);

  // Target ARR for stage milestone
  const targetARR = currentProfile.stage.includes('Series B') ? 10000000 : currentProfile.stage.includes('Series A') ? 5000000 : 1500000;
  const progressToTarget = Math.min(100, Math.round((currentProfile.arr / targetARR) * 100));

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="dashboard-body">
          {/* Executive Hero Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(14, 20, 38, 0.9) 0%, rgba(9, 14, 28, 0.95) 100%)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: '25%',
                width: '200px',
                height: '100%',
                background: 'radial-gradient(ellipse at center, rgba(0, 245, 160, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #00f5a0 0%, #00d2ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#060913',
                  boxShadow: '0 4px 16px rgba(0, 245, 160, 0.35)',
                }}
              >
                <Compass size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {currentProfile.name} Venture Command
                  </h1>
                  <span className="badge badge-emerald">{currentProfile.stage}</span>
                  <span className="badge badge-indigo">Post-Money: {formatCurrency(currentProfile.valuationLastRound, currency, true)}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {currentProfile.tagline}
                </p>
              </div>
            </div>

            {/* Stage ARR milestone progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Milestone Target ({formatCurrency(targetARR, currency, true)})</span>
                  <span style={{ color: '#00f5a0' }}>{progressToTarget}%</span>
                </div>
                <div style={{ width: '100%', height: '7px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${progressToTarget}%`,
                      background: 'linear-gradient(90deg, #00f5a0 0%, #00d2ff 100%)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAiModal(true)}
              >
                <Sparkles size={14} />
                <span>AI Growth Brief</span>
              </button>
            </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* Top Vital Metric Cards */}
              <div className="grid-metrics">
                <MetricCard
                  title="Annual Recurring Revenue (ARR)"
                  value={formatCurrency(currentProfile.arr, currency)}
                  trend={currentProfile.mrrGrowthMoM}
                  secondaryValue={`MRR: ${formatCurrency(currentProfile.mrr, currency)}`}
                  icon={TrendingUp}
                  iconColor="#00f5a0"
                  iconBg="rgba(0, 245, 160, 0.15)"
                  benchmarkBadge={{ text: 'Top 10% Growth', type: 'emerald' }}
                  tooltip="Total contracted recurring revenue normalized to a one-year period."
                  highlight={true}
                />

                <MetricCard
                  title="Net Revenue Retention (NRR)"
                  value={`${currentProfile.nrr}%`}
                  trend={currentProfile.nrr > 120 ? 3.4 : 1.2}
                  secondaryValue="Top Quartile > 120%"
                  icon={ShieldCheck}
                  iconColor="#00d2ff"
                  iconBg="rgba(0, 210, 255, 0.15)"
                  benchmarkBadge={{ text: 'Expansion Mode', type: 'cyan' }}
                  tooltip="Percentage of recurring revenue retained from existing customers over a given period, including expansions and upgrades."
                />

                <MetricCard
                  title="Cash Runway Remaining"
                  value={runwayMonths >= 900 ? 'Infinite' : `${runwayMonths} mos`}
                  secondaryValue={`Net Burn: ${formatCurrency(currentProfile.monthlyNetBurn, currency, true)}/mo`}
                  icon={Flame}
                  iconColor={runwayMonths < 12 ? '#ff3366' : '#ffb020'}
                  iconBg={runwayMonths < 12 ? 'rgba(255, 51, 102, 0.15)' : 'rgba(255, 176, 32, 0.15)'}
                  benchmarkBadge={{ text: `${formatCurrency(currentProfile.cashInBank, currency, true)} Cash`, type: 'amber' }}
                  tooltip="Number of months before cash reserves reach zero based on current monthly net burn rate."
                />

                <MetricCard
                  title="LTV : CAC Ratio"
                  value={`${ltvCacRatio}x`}
                  secondaryValue={`CAC: ${formatCurrency(currentProfile.cac, currency)} • LTV: ${formatCurrency(currentProfile.ltv, currency, true)}`}
                  icon={Zap}
                  iconColor="#818cf8"
                  iconBg="rgba(99, 102, 241, 0.15)"
                  benchmarkBadge={{ text: 'Payback 7.2 mos', type: 'indigo' }}
                  tooltip="Ratio of Customer Lifetime Value to Customer Acquisition Cost. Healthy SaaS benchmark is > 3.0x."
                />

                <MetricCard
                  title="Rule of 40 & Magic Number"
                  value={`${currentProfile.ruleOf40}%`}
                  secondaryValue={`Magic Number: ${currentProfile.magicNumber}x`}
                  icon={Award}
                  iconColor="#c084fc"
                  iconBg="rgba(157, 78, 221, 0.15)"
                  benchmarkBadge={{ text: 'Elite Efficiency', type: 'purple' }}
                  tooltip="Rule of 40 = YoY Growth % + Profit Margin %. Magic Number = Net New ARR / S&M Spend."
                />
              </div>

              {/* Main Charts Row */}
              <div className="grid-two-col">
                <RevenueChart />
                <LiveActivityFeed />
              </div>

              {/* Funnel & Product Usage Row */}
              <div className="grid-equal-two">
                <FunnelChart />
                <CohortHeatmap />
              </div>

              {/* Customer Segments & Accounts */}
              <ProductUsage />
            </>
          )}

          {/* REVENUE TAB */}
          {activeTab === 'revenue' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <RevenueChart />
              <div className="grid-equal-two">
                <FunnelChart />
                <ProductUsage />
              </div>
            </div>
          )}

          {/* COHORT RETENTION TAB */}
          {activeTab === 'cohorts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <CohortHeatmap />
              <div className="grid-equal-two">
                <RevenueChart />
                <ProductUsage />
              </div>
            </div>
          )}

          {/* SCENARIO SIMULATOR TAB */}
          {activeTab === 'simulator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <ScenarioSimulator />
              <div className="grid-equal-two">
                <InvestorBenchmark />
                <CapTableSection />
              </div>
            </div>
          )}

          {/* INVESTOR BENCHMARKS TAB */}
          {activeTab === 'benchmarks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <InvestorBenchmark />
              <div className="grid-equal-two">
                <ScenarioSimulator />
                <CapTableSection />
              </div>
            </div>
          )}

          {/* CAP TABLE TAB */}
          {activeTab === 'captable' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <CapTableSection />
              <div className="grid-equal-two">
                <InvestorBenchmark />
                <ScenarioSimulator />
              </div>
            </div>
          )}

          {/* CUSTOMERS & USAGE TAB */}
          {activeTab === 'customers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <ProductUsage />
              <div className="grid-equal-two">
                <FunnelChart />
                <CohortHeatmap />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <AIInsightsModal />
      <ExportReportModal />

      {toastMessage && (
        <div className="toast-banner">
          <Sparkles size={16} color="#00f5a0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AnalyticsProvider>
      <DashboardContent />
    </AnalyticsProvider>
  );
}
