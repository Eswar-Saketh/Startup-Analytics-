import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  STARTUP_PROFILES,
  REVENUE_HISTORY_DATA,
  COHORT_RETENTION_DATA,
  FUNNEL_STAGES,
  CAP_TABLE_DATA,
  CUSTOMER_SEGMENTS,
  TOP_CUSTOMERS,
  SIMULATED_ACTIVITY_TEMPLATES,
} from '../data/startupDatasets';
import { SAAS_BENCHMARKS } from '../data/benchmarks';
import { simulateRunwayAndARR } from '../utils/financialCalculations';

const AnalyticsContext = createContext();

export function AnalyticsProvider({ children }) {
  // Theme
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Active Profile
  const [selectedProfileId, setSelectedProfileId] = useState('pulse-ai');
  const currentProfile = STARTUP_PROFILES.find(p => p.id === selectedProfileId) || STARTUP_PROFILES[0];

  // Currency
  const [currency, setCurrency] = useState('USD');

  // Filters
  const [dateRange, setDateRange] = useState('YTD'); // '30D', '90D', 'YTD', '1Y', 'ALL'
  const [customerSegment, setCustomerSegment] = useState('ALL'); // 'ALL', 'Enterprise', 'Mid-Market', 'Growth', 'Starter'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'revenue', 'cohorts', 'simulator', 'benchmarks', 'captable', 'customers'

  // Modals
  const [showAiModal, setShowAiModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Live Activity Stream
  const [isLiveTelemetryActive, setIsLiveTelemetryActive] = useState(true);
  const [activities, setActivities] = useState([
    {
      id: 1,
      timestamp: 'Just now',
      type: 'upgrade',
      title: 'Enterprise Expansion Closed',
      desc: 'Acme Corp upgraded from Mid-Market to Enterprise (+40 seats)',
      impact: '+$1,800 MRR',
      tag: 'Revenue Spike',
      color: '#10b981',
    },
    {
      id: 2,
      timestamp: '4 mins ago',
      type: 'payment',
      title: 'Annual Upfront Payment Processed',
      desc: 'Stripe processed $48,000 for NovaScale 12-month commitment',
      impact: '+$48,000 Cash',
      tag: 'Cash Flow',
      color: '#6366f1',
    },
    {
      id: 3,
      timestamp: '18 mins ago',
      type: 'new_customer',
      title: 'New Organic Signup Converted',
      desc: 'FoundersHub signed up for Pro Tier via Search campaign',
      impact: '+$450 MRR',
      tag: 'New Logo',
      color: '#06b6d4',
    },
    {
      id: 4,
      timestamp: '42 mins ago',
      type: 'activation',
      title: 'High-Value PQL Milestone',
      desc: 'HyperCloud activated AI Agent pipeline with 1,200 requests/day',
      impact: 'PQL Score 96',
      tag: 'Activation',
      color: '#f59e0b',
    },
  ]);

  // Scenario Simulator Parameters
  const [simulatorParams, setSimulatorParams] = useState({
    newHiresPerMonth: 1,
    growthRatePct: currentProfile.mrrGrowthMoM || 14.8,
    marketingSpendDelta: 15000,
    arpuDeltaPct: 10,
    newCapitalInfusion: 2000000,
    infusionMonth: 6,
    simulationMonths: 24,
  });

  // Sync simulator defaults when profile changes
  useEffect(() => {
    setSimulatorParams(prev => ({
      ...prev,
      growthRatePct: currentProfile.mrrGrowthMoM || 12,
    }));
  }, [selectedProfileId]);

  // Dynamic simulation calculations
  const simulationResults = simulateRunwayAndARR({
    initialCash: currentProfile.cashInBank,
    initialMRR: currentProfile.mrr,
    initialGrossBurn: currentProfile.monthlyGrossBurn,
    headcount: currentProfile.headcount,
    newHiresPerMonth: simulatorParams.newHiresPerMonth,
    growthRatePct: simulatorParams.growthRatePct,
    marketingSpendDelta: simulatorParams.marketingSpendDelta,
    arpuDeltaPct: simulatorParams.arpuDeltaPct,
    newCapitalInfusion: simulatorParams.newCapitalInfusion,
    infusionMonth: simulatorParams.infusionMonth,
    simulationMonths: simulatorParams.simulationMonths,
  });

  // Live event ticker generator
  useEffect(() => {
    if (!isLiveTelemetryActive) return;

    const interval = setInterval(() => {
      const template = SIMULATED_ACTIVITY_TEMPLATES[Math.floor(Math.random() * SIMULATED_ACTIVITY_TEMPLATES.length)];
      const newActivity = {
        id: Date.now(),
        timestamp: 'Just now',
        ...template,
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
    }, 12000);

    return () => clearInterval(interval);
  }, [isLiveTelemetryActive]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const revenueHistory = REVENUE_HISTORY_DATA[selectedProfileId] || REVENUE_HISTORY_DATA['pulse-ai'];

  // Overall Investor Readiness Score
  const calculateBenchmarkScore = () => {
    let totalScore = 0;
    let totalWeight = 0;
    SAAS_BENCHMARKS.forEach(bm => {
      let val = 0;
      if (bm.key === 'arrGrowth') val = currentProfile.mrrGrowthMoM * 12; // annualized
      else if (bm.key === 'nrr') val = currentProfile.nrr;
      else if (bm.key === 'grossMargin') val = currentProfile.grossMargin;
      else if (bm.key === 'cacPayback') val = currentProfile.cacPaybackMonths;
      else if (bm.key === 'magicNumber') val = currentProfile.magicNumber;
      else if (bm.key === 'ruleOf40') val = currentProfile.ruleOf40;
      else if (bm.key === 'burnMultiple') val = currentProfile.burnMultiple;

      const score = bm.getScore(val);
      totalScore += score * bm.weight;
      totalWeight += bm.weight;
    });
    return Math.round(totalScore / totalWeight);
  };

  const investorReadinessScore = calculateBenchmarkScore();

  return (
    <AnalyticsContext.Provider
      value={{
        theme,
        toggleTheme,
        selectedProfileId,
        setSelectedProfileId,
        currentProfile,
        profiles: STARTUP_PROFILES,
        currency,
        setCurrency,
        dateRange,
        setDateRange,
        customerSegment,
        setCustomerSegment,
        activeTab,
        setActiveTab,
        revenueHistory,
        cohorts: COHORT_RETENTION_DATA,
        funnel: FUNNEL_STAGES,
        capTable: CAP_TABLE_DATA,
        customerSegments: CUSTOMER_SEGMENTS,
        topCustomers: TOP_CUSTOMERS,
        benchmarks: SAAS_BENCHMARKS,
        investorReadinessScore,
        simulatorParams,
        setSimulatorParams,
        simulationResults,
        activities,
        isLiveTelemetryActive,
        setIsLiveTelemetryActive,
        showAiModal,
        setShowAiModal,
        showExportModal,
        setShowExportModal,
        toastMessage,
        triggerToast,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
