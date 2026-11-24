import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  History,
  ShieldAlert,
} from 'lucide-react';
import { PayoutPending, DecisionType, TeamStats } from '../types';

interface QueueTableProps {
  payouts: PayoutPending[];
  selectedPayoutId: string | null;
  onSelectPayout: (payoutId: string) => void;
  teamStats: Record<string, TeamStats>;
  onOpenOverrideModal: (payout: PayoutPending) => void;
}

export const QueueTable: React.FC<QueueTableProps> = ({
  payouts,
  selectedPayoutId,
  onSelectPayout,
  teamStats,
  onOpenOverrideModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<'ALL' | DecisionType | 'OVERRIDDEN'>('ALL');

  // Filter logic
  const filteredPayouts = payouts.filter((p) => {
    // Search match
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.payout_id.toLowerCase().includes(q) ||
      p.team_id.toLowerCase().includes(q) ||
      p.team_name.toLowerCase().includes(q) ||
      p.profession.toLowerCase().includes(q) ||
      p.fraud_cluster.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Decision match
    if (decisionFilter === 'ALL') return true;
    if (decisionFilter === 'OVERRIDDEN') return p.is_overridden;
    return p.decision === decisionFilter;
  });

  const getDecisionBadge = (decision: DecisionType) => {
    switch (decision) {
      case 'Approve':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Approve
          </span>
        );
      case 'Manual review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" />
            Manual Review
          </span>
        );
      case 'Reject':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            Reject
          </span>
        );
    }
  };

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team, payout ID, profession, or cluster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setDecisionFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              decisionFilter === 'ALL'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            All ({payouts.length})
          </button>

          <button
            onClick={() => setDecisionFilter('Reject')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              decisionFilter === 'Reject'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                : 'text-slate-400 hover:text-rose-300 hover:bg-rose-500/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Rejects ({payouts.filter((p) => p.decision === 'Reject').length})
          </button>

          <button
            onClick={() => setDecisionFilter('Manual review')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              decisionFilter === 'Manual review'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Review ({payouts.filter((p) => p.decision === 'Manual review').length})
          </button>

          <button
            onClick={() => setDecisionFilter('Approve')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              decisionFilter === 'Approve'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Approved ({payouts.filter((p) => p.decision === 'Approve').length})
          </button>

          {payouts.some((p) => p.is_overridden) && (
            <button
              onClick={() => setDecisionFilter('OVERRIDDEN')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
                decisionFilter === 'OVERRIDDEN'
                  ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/40'
                  : 'text-slate-400 hover:text-blue-300 hover:bg-blue-500/10'
              }`}
            >
              <History className="w-3 h-3 text-blue-400" />
              Overridden ({payouts.filter((p) => p.is_overridden).length})
            </button>
          )}
        </div>
      </div>

      {/* Table Listing */}
      <div className="overflow-y-auto flex-1 max-h-[calc(100vh-280px)]">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-950/70 text-slate-400 sticky top-0 z-10 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Payout ID / Team</th>
              <th className="py-3 px-4">Profession</th>
              <th className="py-3 px-4 text-right">Payout Amount</th>
              <th className="py-3 px-4 text-right">Transactions</th>
              <th className="py-3 px-4">Decision</th>
              <th className="py-3 px-4">Risk & Fraud Signal</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredPayouts.map((p) => {
              const isSelected = selectedPayoutId === p.payout_id;
              const stats = teamStats[p.team_id];
              const zScore =
                stats && stats.std_daily_amount > 0
                  ? ((p.payout_amount_usd - stats.avg_daily_amount) / stats.std_daily_amount).toFixed(1)
                  : null;

              return (
                <tr
                  key={p.payout_id}
                  onClick={() => onSelectPayout(p.payout_id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-900/25 border-l-4 border-l-blue-500'
                      : 'hover:bg-slate-800/40 border-l-4 border-l-transparent'
                  }`}
                >
                  {/* Payout & Team */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-200 text-xs flex items-center gap-1.5">
                      {p.payout_id}
                      {p.is_overridden && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-sans">
                          Overridden
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-300 mt-0.5">{p.team_name}</div>
                    <div className="text-[11px] text-slate-500">
                      {p.team_id} • {p.city}, {p.state}
                    </div>
                  </td>

                  {/* Profession */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/50">
                      {p.profession}
                    </span>
                  </td>

                  {/* Payout Amount */}
                  <td className="py-3 px-4 text-right">
                    <div className="font-mono font-bold text-slate-100 text-xs">
                      {formatUSD(p.payout_amount_usd)}
                    </div>
                    {stats ? (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        avg: {formatUSD(stats.avg_daily_amount)}
                        {zScore && Math.abs(parseFloat(zScore)) >= 2 && (
                          <span
                            className={`ml-1 font-mono font-bold ${
                              parseFloat(zScore) > 0 ? 'text-amber-400' : 'text-slate-400'
                            }`}
                          >
                            ({parseFloat(zScore) > 0 ? `+${zScore}σ` : `${zScore}σ`})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-indigo-400">New merchant</span>
                    )}
                  </td>

                  {/* Transaction Count */}
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    <span className="font-semibold">{p.txn_count}</span>
                    {stats && (
                      <span className="text-[10px] text-slate-500 block">
                        avg: {stats.avg_daily_txns.toFixed(1)}
                      </span>
                    )}
                  </td>

                  {/* Decision Badge */}
                  <td className="py-3 px-4">
                    {getDecisionBadge(p.decision)}
                  </td>

                  {/* Risk / Fraud Signal Tag */}
                  <td className="py-3 px-4">
                    {p.fraud_cluster ? (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          {p.fraud_cluster}
                        </span>
                      </div>
                    ) : p.decision === 'Manual review' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-semibold border border-amber-500/30">
                          {p.team_id === 'TM1002'
                            ? 'VOLUME_SPIKE (+6.8σ)'
                            : p.team_id === 'TM1008'
                            ? 'OUTLIER_TICKETS (+5.1σ)'
                            : 'CARD_TESTING_VICTIM'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-mono">Normal baseline</span>
                    )}
                  </td>

                  {/* Quick Action */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenOverrideModal(p);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                      >
                        Override
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPayout(p.payout_id);
                        }}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredPayouts.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="font-medium text-slate-300">No payouts match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or search query.</p>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-slate-400 text-xs flex items-center justify-between">
        <div>
          Showing <span className="text-slate-200 font-semibold">{filteredPayouts.length}</span> of{' '}
          <span className="text-slate-200 font-semibold">{payouts.length}</span> pending payouts
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Click any row to inspect deep dossier & transactions</span>
        </div>
      </div>
    </div>
  );
};
