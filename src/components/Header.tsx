import React from 'react';
import { ShieldAlert, Download, History, RotateCcw, Activity, Layers, AlertTriangle } from 'lucide-react';
import { OverrideLog } from '../types';

interface HeaderProps {
  activeTab: 'queue' | 'monitoring' | 'clusters';
  setActiveTab: (tab: 'queue' | 'monitoring' | 'clusters') => void;
  overrideLogs: OverrideLog[];
  setIsAuditOpen: (open: boolean) => void;
  onExportCSV: () => void;
  onReset: () => void;
  pendingCount: number;
  rejectCount: number;
  reviewCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  overrideLogs,
  setIsAuditOpen,
  onExportCSV,
  onReset,
  pendingCount,
  rejectCount,
  reviewCount,
}) => {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Live Simulation Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-white tracking-tight">ScanPay</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Risk Desk v2.6
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Simulated Time: <span className="text-slate-200 font-semibold">Fri 13 Nov 2026, 10:00 AM IST</span>
                </p>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

            {/* Context Badge */}
            <div className="hidden lg:flex items-center text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-750">
              <span className="text-slate-300 font-medium">Batch:</span>
              <span className="ml-1 text-slate-200">10 Nov Collections (T+2 Payouts)</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'queue'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pending Queue</span>
              <span className="px-1.5 py-0.2 rounded-md bg-slate-800/80 text-[10px] text-slate-300 font-mono">
                {pendingCount}
              </span>
              {(rejectCount > 0 || reviewCount > 0) && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('monitoring')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'monitoring'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Monitoring & 20-Day Baseline</span>
            </button>

            <button
              onClick={() => setActiveTab('clusters')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'clusters'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Fraud Clusters (3)</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2.5">
            {/* Audit Trail Button */}
            <button
              onClick={() => setIsAuditOpen(true)}
              className="relative flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-750 px-3 py-2 rounded-lg border border-slate-700 transition"
              title="View Ops Overrides Audit Log"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Overrides</span>
              {overrideLogs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                  {overrideLogs.length}
                </span>
              )}
            </button>

            {/* Reset Overrides */}
            {overrideLogs.length > 0 && (
              <button
                onClick={onReset}
                className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition"
                title="Reset overrides to initial system rules"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Export CSV Button */}
            <button
              onClick={onExportCSV}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-emerald-900/50 transition border border-emerald-400/30 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export decisions.csv</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
