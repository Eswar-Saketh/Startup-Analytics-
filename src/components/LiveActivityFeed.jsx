import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  Activity,
  Sparkles,
  DollarSign,
  UserPlus,
  Zap,
  AlertTriangle,
  PieChart,
  Radio,
  PlusCircle,
} from 'lucide-react';
import { SIMULATED_ACTIVITY_TEMPLATES } from '../data/startupDatasets';

export default function LiveActivityFeed() {
  const { activities, isLiveTelemetryActive, triggerToast } = useAnalytics();
  const [filterType, setFilterType] = useState('ALL');

  const getIcon = (type) => {
    switch (type) {
      case 'upgrade':
        return <Sparkles size={16} color="#10b981" />;
      case 'payment':
        return <DollarSign size={16} color="#6366f1" />;
      case 'new_customer':
        return <UserPlus size={16} color="#06b6d4" />;
      case 'activation':
        return <Zap size={16} color="#f59e0b" />;
      case 'warning':
        return <AlertTriangle size={16} color="#f43f5e" />;
      case 'esop':
        return <PieChart size={16} color="#8b5cf6" />;
      default:
        return <Activity size={16} color="#6366f1" />;
    }
  };

  const filteredActivities = activities.filter(a => {
    if (filterType === 'ALL') return true;
    if (filterType === 'revenue') return a.type === 'upgrade' || a.type === 'payment';
    if (filterType === 'risk') return a.type === 'warning';
    if (filterType === 'activation') return a.type === 'activation' || a.type === 'new_customer';
    return true;
  });

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} style={{ color: isLiveTelemetryActive ? '#10b981' : 'var(--text-muted)' }} />
            Live Customer &amp; Revenue Telemetry
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real-time webhook events, payment signals, usage spikes, and retention anomalies
          </p>
        </div>

        {/* Filter pills */}
        <div className="segmented-control">
          <button className={`segment-btn ${filterType === 'ALL' ? 'active' : ''}`} onClick={() => setFilterType('ALL')}>
            All Events
          </button>
          <button className={`segment-btn ${filterType === 'revenue' ? 'active' : ''}`} onClick={() => setFilterType('revenue')}>
            Revenue
          </button>
          <button className={`segment-btn ${filterType === 'activation' ? 'active' : ''}`} onClick={() => setFilterType('activation')}>
            Product
          </button>
          <button className={`segment-btn ${filterType === 'risk' ? 'active' : ''}`} onClick={() => setFilterType('risk')}>
            Risks
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="activity-stream">
        {filteredActivities.map(item => (
          <div key={item.id} className="activity-item">
            <div
              className="activity-icon"
              style={{
                backgroundColor: item.color ? `${item.color}22` : 'rgba(99,102,241,0.15)',
              }}
            >
              {getIcon(item.type)}
            </div>
            <div className="activity-body">
              <div className="activity-header-line">
                <span className="activity-title">{item.title}</span>
                <span className="activity-time">{item.timestamp}</span>
              </div>
              <div className="activity-desc">{item.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <span className="activity-impact">{item.impact}</span>
                <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                  {item.tag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
