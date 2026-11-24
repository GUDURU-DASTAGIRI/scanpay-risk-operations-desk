import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Smartphone,
  Landmark,
  User,
  Phone,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Edit3,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PayoutPending, Transaction, TeamStats, TeamTxStats, ProfTxStats, FraudCluster } from '../types';

interface PayoutDetailProps {
  payout: PayoutPending;
  transactions: Transaction[];
  teamStats?: TeamStats;
  teamTxStats?: TeamTxStats;
  profTxStats?: ProfTxStats;
  fraudClusters: FraudCluster[];
  onClose: () => void;
  onOpenOverrideModal: (payout: PayoutPending) => void;
}

export const PayoutDetail: React.FC<PayoutDetailProps> = ({
  payout,
  transactions,
  teamStats,
  teamTxStats,
  profTxStats,
  fraudClusters,
  onClose,
  onOpenOverrideModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'txns' | 'history' | 'evidence'>('txns');

  const teamTxns = transactions.filter((t) => t.team_id === payout.team_id);
  const capturedTxns = teamTxns.filter((t) => t.status === 'captured');
  const declinedTxns = teamTxns.filter((t) => t.status === 'declined');
  const refundedTxns = teamTxns.filter((t) => t.status === 'refunded');

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);

  const matchedCluster = fraudClusters.find((c) => c.cluster_id === payout.fraud_cluster);

  const zScore =
    teamStats && teamStats.std_daily_amount > 0
      ? ((payout.payout_amount_usd - teamStats.avg_daily_amount) / teamStats.std_daily_amount).toFixed(1)
      : null;

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden shadow-xl">
      
      {/* Detail Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
              {payout.payout_id}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium border border-slate-700">
              {payout.profession}
            </span>
            <span className="text-xs text-slate-400 font-mono">Covering: 10 Nov 2026</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {payout.team_name}
            <span className="text-xs font-mono text-slate-400 font-normal">({payout.team_id})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              {payout.owner_name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              {payout.owner_phone}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {payout.city}, {payout.state}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {formatUSD(payout.payout_amount_usd)}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {payout.txn_count} captured payments
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Decision Banner with Reason and Override Option */}
      <div
        className={`p-4 border-b ${
          payout.decision === 'Reject'
            ? 'bg-rose-950/30 border-rose-900/40'
            : payout.decision === 'Manual review'
            ? 'bg-amber-950/30 border-amber-900/40'
            : 'bg-emerald-950/20 border-emerald-900/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {payout.decision === 'Reject' ? (
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <XCircle className="w-5 h-5" />
              </div>
            ) : payout.decision === 'Manual review' ? (
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold uppercase tracking-wider ${
                    payout.decision === 'Reject'
                      ? 'text-rose-400'
                      : payout.decision === 'Manual review'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  Decision: {payout.decision}
                </span>

                {payout.fraud_cluster && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-semibold border border-rose-500/30">
                    Cluster: {payout.fraud_cluster}
                  </span>
                )}

                {payout.is_overridden && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Overridden
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                {payout.reasons}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenOverrideModal(payout)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 whitespace-nowrap shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Change Decision</span>
          </button>
        </div>

        {/* Evidence IDs & Override Details */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-500 font-sans font-medium">Evidence IDs:</span>
            <span className="text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 select-all">
              {payout.evidence}
            </span>
          </div>

          {payout.is_overridden && (
            <div className="text-blue-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Overridden reason: "{payout.override_reason}"</span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center space-x-2 px-5 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
        <button
          onClick={() => setActiveSubTab('txns')}
          className={`pb-2.5 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
            activeSubTab === 'txns'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Covered Transactions ({teamTxns.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('evidence')}
          className={`pb-2.5 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
            activeSubTab === 'evidence'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Entity & Fraud Network Link</span>
          {payout.fraud_cluster && (
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-2.5 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
            activeSubTab === 'history'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Historical Norms & Z-Scores</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-5">
        
        {/* TAB 1: Transactions Ledger */}
        {activeSubTab === 'txns' && (
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span>
                  Captured: <strong className="text-emerald-400 font-mono">{capturedTxns.length}</strong>
                </span>
                <span>
                  Declined: <strong className="text-rose-400 font-mono">{declinedTxns.length}</strong>
                </span>
                <span>
                  Refunded: <strong className="text-amber-400 font-mono">{refundedTxns.length}</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Rule: Payout = sum(amount + tip) for captured only
              </span>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/70">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Txn ID / Time (IST)</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Card Fingerprint / Country</th>
                    <th className="py-2.5 px-3 text-right">Job Amount</th>
                    <th className="py-2.5 px-3 text-right">Tip</th>
                    <th className="py-2.5 px-3 text-right">Total USD</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {teamTxns.map((t) => {
                    const isMicro = t.amount_usd < 10;
                    const isForeign = t.card_country && t.card_country !== 'US';
                    const isSuspicious = isMicro || isForeign;

                    return (
                      <tr
                        key={t.txn_id}
                        className={`transition-colors ${
                          isSuspicious
                            ? 'bg-amber-950/20 hover:bg-amber-950/30'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-200">{t.txn_id}</div>
                          <div className="text-[10px] text-slate-500">{t.created_at_ist}</div>
                        </td>

                        <td className="py-2.5 px-3 text-slate-300 font-sans capitalize">
                          {t.payment_method.replace(/_/g, ' ')}
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="text-[11px] font-mono text-slate-400">
                            {t.card_fingerprint || '— (ACH)'}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-sans font-bold ${
                                isForeign
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {t.card_country || 'ACH'}
                            </span>
                            {isMicro && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans font-semibold border border-amber-500/30">
                                Micro Test (${t.amount_usd.toFixed(2)})
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-right text-slate-200 font-semibold">
                          ${t.amount_usd.toFixed(2)}
                        </td>

                        <td className="py-2.5 px-3 text-right text-slate-400">
                          ${(t.tip_usd || 0).toFixed(2)}
                        </td>

                        <td className="py-2.5 px-3 text-right font-bold text-white">
                          ${(t.amount_usd + (t.tip_usd || 0)).toFixed(2)}
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase ${
                              t.status === 'captured'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                : t.status === 'declined'
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Entity & Fraud Evidence Network */}
        {activeSubTab === 'evidence' && (
          <div className="space-y-4">
            
            {/* Entity Fingerprint Card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                Merchant Hardware & Payout Destination
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[11px] mb-1">Signup Device ID</span>
                  <div className="font-mono font-bold text-slate-200 flex items-center justify-between">
                    <span>{payout.signup_device_id}</span>
                    {payout.signup_device_id === 'D-7F3A91' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-sans border border-rose-500/30">
                        MATCH: Card Ring
                      </span>
                    )}
                    {payout.signup_device_id === 'D-B21C44' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-sans border border-rose-500/30">
                        MATCH: Card Testing
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[11px] mb-1">Payout Bank Routing</span>
                  <div className="font-mono font-bold text-slate-200 flex items-center justify-between">
                    <span>{payout.payout_bank_routing}</span>
                    {(payout.payout_bank_routing.toString().includes('61000104') ||
                      payout.payout_bank_routing.toString().includes('061000104')) && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-sans border border-rose-500/30">
                        MATCH: ATO Mule
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[11px] mb-1">Bank Account Last 4</span>
                  <div className="font-mono font-bold text-slate-200 flex items-center justify-between">
                    <span>{payout.payout_bank_last4}</span>
                    {payout.payout_bank_last4.toString() === '4471' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-sans border border-rose-500/30">
                        MATCH: J. Okafor
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Matched Fraud Cluster Dossier if Reject */}
            {matchedCluster ? (
              <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <h4 className="text-sm font-bold text-rose-300">
                    Linked to Known Fraud Cluster: {matchedCluster.name} ({matchedCluster.cluster_id})
                  </h4>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {matchedCluster.description}
                </p>

                <div className="bg-slate-950/80 rounded-lg p-3 border border-rose-900/40 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Historical Fraud Incidents:</span>
                    <span className="font-mono font-semibold text-rose-300">
                      {matchedCluster.historical_payouts.join(', ')} ({matchedCluster.historical_teams.join(', ')})
                    </span>
                  </div>

                  {matchedCluster.device_id && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Shared Hardware Fingerprint:</span>
                      <span className="font-mono font-semibold text-rose-300">
                        {matchedCluster.device_id}
                      </span>
                    </div>
                  )}

                  {matchedCluster.fraud_bank_routing && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Illicit Bank Mule Account:</span>
                      <span className="font-mono font-semibold text-rose-300">
                        Routing: {matchedCluster.fraud_bank_routing} • Last4: {matchedCluster.fraud_bank_last4} ({matchedCluster.fraud_account_holder})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-2" />
                This team does not match any known hardware fingerprints, compromised bank accounts, or past card syndicates.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Historical Norms & Z-Scores */}
        {activeSubTab === 'history' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Daily Payout Norms */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Team Daily Payout Norms (20-Day Baseline)
                </h4>

                {teamStats ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Historical Daily Average</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {formatUSD(teamStats.avg_daily_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Today's Payout (10 Nov)</span>
                      <span className="font-mono font-bold text-white">
                        {formatUSD(payout.payout_amount_usd)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Standard Deviation Deviation (Z-score)</span>
                      <span
                        className={`font-mono font-bold ${
                          zScore && Math.abs(parseFloat(zScore)) >= 3
                            ? 'text-rose-400'
                            : zScore && Math.abs(parseFloat(zScore)) >= 2
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {zScore ? (parseFloat(zScore) > 0 ? `+${zScore}σ` : `${zScore}σ`) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Txn Count Ratio (Today vs Avg)</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {payout.txn_count} vs {teamStats.avg_daily_txns.toFixed(1)} avg (
                        {(payout.txn_count / teamStats.avg_daily_txns).toFixed(1)}x)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs py-4 text-center">
                    New merchant on ScanPay: No prior 20-day historical payouts on file.
                  </div>
                )}
              </div>

              {/* Profession Ticket Norms */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {payout.profession} Industry Benchmarks
                </h4>

                {profTxStats ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Industry Average Ticket Size</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {formatUSD(profTxStats.avg_ticket)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Industry Standard Deviation</span>
                      <span className="font-mono font-semibold text-slate-200">
                        ±{formatUSD(profTxStats.std_ticket)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Industry Max Ticket Recorded</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {formatUSD(profTxStats.max_ticket)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">This Team's Avg Ticket Today</span>
                      <span className="font-mono font-bold text-white">
                        {formatUSD(payout.payout_amount_usd / payout.txn_count)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs py-4 text-center">
                    No benchmark data available.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
