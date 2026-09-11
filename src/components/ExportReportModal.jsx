import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { formatCurrency } from '../utils/formatters';
import { Download, X, FileText, Check, Printer } from 'lucide-react';

export default function ExportReportModal() {
  const { showExportModal, setShowExportModal, currentProfile, revenueHistory, currency, triggerToast } = useAnalytics();
  const [exportType, setExportType] = useState('csv'); // 'csv', 'json', 'pdf'

  if (!showExportModal) return null;

  const handleExport = () => {
    if (exportType === 'csv') {
      const headers = 'Month,New MRR,Expansion MRR,Contraction MRR,Churn MRR,Total MRR,ARR,Treasury Cash\n';
      const rows = revenueHistory
        .map(r => `${r.month},${r.newMRR},${r.expansionMRR},${r.contractionMRR},${r.churnMRR},${r.totalMRR},${r.arr},${r.cash}`)
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProfile.name}-metrics-export.csv`;
      a.click();
      triggerToast('Downloaded CSV Metrics Report');
    } else if (exportType === 'json') {
      const dataStr = JSON.stringify({ profile: currentProfile, revenueHistory }, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProfile.name}-telemetry-snapshot.json`;
      a.click();
      triggerToast('Downloaded JSON Dataset');
    } else {
      window.print();
      triggerToast('Opened Executive Print View');
    }
    setShowExportModal(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setShowExportModal(false)}>
      <div className="modal-content" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Download size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Export Analytics &amp; Investor Deck Data
            </h3>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShowExportModal(false)}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Format:</label>

          <div
            onClick={() => setExportType('csv')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: exportType === 'csv' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-elevated)',
              border: exportType === 'csv' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.875rem' }}>CSV Spreadsheet</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Raw time-series MRR, Cohorts, and Burn metrics</div>
            </div>
            {exportType === 'csv' && <Check size={18} color="var(--primary)" />}
          </div>

          <div
            onClick={() => setExportType('json')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: exportType === 'json' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-elevated)',
              border: exportType === 'json' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.875rem' }}>JSON Telemetry Snapshot</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Complete structured startup state payload</div>
            </div>
            {exportType === 'json' && <Check size={18} color="var(--primary)" />}
          </div>

          <div
            onClick={() => setExportType('pdf')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: exportType === 'pdf' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-elevated)',
              border: exportType === 'pdf' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.875rem' }}>Executive PDF / Print Snapshot</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Ready for Investor Updates &amp; Board Decks</div>
            </div>
            {exportType === 'pdf' && <Printer size={18} color="var(--primary)" />}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button className="btn btn-secondary" onClick={() => setShowExportModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleExport}>
            <Download size={15} />
            <span>Generate &amp; Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
