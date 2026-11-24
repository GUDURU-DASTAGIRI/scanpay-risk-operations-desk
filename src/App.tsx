import React, { useState } from 'react';
import rawData from './data/payouts_data.json';
import {
  PayoutPending,
  HistoricalPayout,
  Transaction,
  Team,
  TeamStats,
  TeamTxStats,
  ProfTxStats,
  FraudCluster,
  OverrideLog,
  DecisionType,
} from './types';
import { Header } from './components/Header';
import { KPIHeader } from './components/KPIHeader';
import { QueueTable } from './components/QueueTable';
import { PayoutDetail } from './components/PayoutDetail';
import { FraudClustersView } from './components/FraudClustersView';
import { MonitoringView } from './components/MonitoringView';
import { OverrideModal } from './components/OverrideModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { CheckCircle2, ShieldCheck, Download, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  // Load embedded clean datasets
  const initialPayouts = (rawData.pendingPayouts as unknown) as PayoutPending[];
  const [payouts, setPayouts] = useState<PayoutPending[]>(initialPayouts);
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>('PO100264'); // default select the card ring reject
  const [activeTab, setActiveTab] = useState<'queue' | 'monitoring' | 'clusters'>('queue');
  const [overrideLogs, setOverrideLogs] = useState<OverrideLog[]>([]);
  const [overrideModalPayout, setOverrideModalPayout] = useState<PayoutPending | null>(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const transactions = (rawData.nov10Transactions as unknown) as Transaction[];
  const historicalPayouts = (rawData.historyPayouts as unknown) as HistoricalPayout[];
  const teamStats = (rawData.teamStats as unknown) as Record<string, TeamStats>;
  const teamTxStats = (rawData.teamTxStats as unknown) as Record<string, TeamTxStats>;
  const profTxStats = (rawData.profTxStats as unknown) as Record<string, ProfTxStats>;
  const fraudClusters = (rawData.fraudClusters as unknown) as FraudCluster[];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Override Handler
  const handleSaveOverride = (payoutId: string, newDecision: DecisionType, reason: string) => {
    const timestamp = '13 Nov 2026, 10:15 AM IST';
    const operator = 'Dastagiri (Risk Ops Lead)';

    setPayouts((prev) =>
      prev.map((p) => {
        if (p.payout_id === payoutId) {
          const log: OverrideLog = {
            id: `OVR-${Date.now()}`,
            payout_id: p.payout_id,
            team_id: p.team_id,
            team_name: p.team_name,
            previous_decision: p.decision,
            new_decision: newDecision,
            reason: reason,
            timestamp: timestamp,
            operator: operator,
          };
          setOverrideLogs((logs) => [log, ...logs]);

          return {
            ...p,
            decision: newDecision,
            is_overridden: true,
            override_reason: reason,
            override_timestamp: timestamp,
            overridden_by: operator,
          };
        }
        return p;
      })
    );

    showToast(`Decision for ${payoutId} updated to ${newDecision}. Override logged.`);
  };

  // Reset to initial automated risk engine rules
  const handleReset = () => {
    setPayouts(initialPayouts);
    setOverrideLogs([]);
    showToast('Reset all payouts to automated rules baseline.');
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['payout_id', 'team_id', 'decision', 'fraud_cluster', 'reasons', 'evidence'];
    const rows = payouts.map((p) => {
      const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      return [
        p.payout_id,
        p.team_id,
        p.decision,
        p.decision === 'Reject' ? p.fraud_cluster : '',
        escape(p.reasons),
        escape(p.evidence),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'decisions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('decisions.csv successfully downloaded! (Exact ScanPay format)');
  };

  const selectedPayout = payouts.find((p) => p.payout_id === selectedPayoutId);

  const rejectCount = payouts.filter((p) => p.decision === 'Reject').length;
  const reviewCount = payouts.filter((p) => p.decision === 'Manual review').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overrideLogs={overrideLogs}
        setIsAuditOpen={setIsAuditOpen}
        onExportCSV={handleExportCSV}
        onReset={handleReset}
        pendingCount={payouts.length}
        rejectCount={rejectCount}
        reviewCount={reviewCount}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        
        {/* KPI Summary Cards */}
        <KPIHeader
          payouts={payouts}
          historicalDailyAvg={52000}
          historicalDailyCount={12.3}
        />

        {/* Dynamic View Tab */}
        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
            
            {/* Left Queue Table */}
            <div className="lg:col-span-7 h-[calc(100vh-270px)] min-h-[600px]">
              <QueueTable
                payouts={payouts}
                selectedPayoutId={selectedPayoutId}
                onSelectPayout={(id) => setSelectedPayoutId(id)}
                teamStats={teamStats}
                onOpenOverrideModal={(p) => setOverrideModalPayout(p)}
              />
            </div>

            {/* Right Payout Investigation Dossier */}
            <div className="lg:col-span-5 h-[calc(100vh-270px)] min-h-[600px]">
              {selectedPayout ? (
                <PayoutDetail
                  payout={selectedPayout}
                  transactions={transactions}
                  teamStats={teamStats[selectedPayout.team_id]}
                  teamTxStats={teamTxStats[selectedPayout.team_id]}
                  profTxStats={profTxStats[selectedPayout.profession]}
                  fraudClusters={fraudClusters}
                  onClose={() => setSelectedPayoutId(null)}
                  onOpenOverrideModal={(p) => setOverrideModalPayout(p)}
                />
              ) : (
                <div className="h-full bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
                  <ShieldCheck className="w-12 h-12 text-slate-600 mb-3" />
                  <h3 className="text-sm font-semibold text-slate-300">No Payout Selected</h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Select any pending payout from the queue to inspect covered transactions, hardware matches, and fraud cluster evidence.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'monitoring' && (
          <MonitoringView
            pendingPayouts={payouts}
            historicalPayouts={historicalPayouts}
            profTxStats={profTxStats}
          />
        )}

        {activeTab === 'clusters' && (
          <FraudClustersView
            clusters={fraudClusters}
            pendingPayouts={payouts}
            onSelectPayout={(id) => {
              setSelectedPayoutId(id);
              setActiveTab('queue');
            }}
          />
        )}

      </main>

      {/* Override Modal */}
      {overrideModalPayout && (
        <OverrideModal
          payout={overrideModalPayout}
          onClose={() => setOverrideModalPayout(null)}
          onSaveOverride={handleSaveOverride}
        />
      )}

      {/* Audit Trail Modal */}
      {isAuditOpen && (
        <AuditTrailModal
          logs={overrideLogs}
          onClose={() => setIsAuditOpen(false)}
        />
      )}

      {/* Persistent Bottom Bar */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-3 text-xs text-slate-500">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ScanPay Risk Operations Desk</span>
            <span>•</span>
            <span>Deterministic Graph-Linked Fraud Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportCSV}
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> decisions.csv
            </button>
            <span>v2.6.0 (Zero Backend Failure Architecture)</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
