import React from 'react';
import { AlertTriangle, ShieldAlert, Cpu, CreditCard, Landmark, CheckCircle, ArrowRight, UserX, ExternalLink } from 'lucide-react';
import { FraudCluster, PayoutPending } from '../types';

interface FraudClustersViewProps {
  clusters: FraudCluster[];
  pendingPayouts: PayoutPending[];
  onSelectPayout: (payoutId: string) => void;
}

export const FraudClustersView: React.FC<FraudClustersViewProps> = ({
  clusters,
  pendingPayouts,
  onSelectPayout,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Historical Fraud Intelligence & Active Clusters
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ScanPay's core rejection mandate: <em>"The system rejects only for fraud exposure. It never rejects a payout because it looks odd."</em>
              Every rejected payout on Action Day is linked to one of the three established syndicates discovered in our 20-day history.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              3 Known Syndicates
            </span>
          </div>
        </div>
      </div>

      {/* 3 Clusters Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cluster 1: Card Ring */}
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-5 flex flex-col justify-between hover:border-rose-700/60 transition group shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                <CreditCard className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Device: D-7F3A91
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
              1. Lockwise & Keyline Card Ring
            </h3>
            <span className="text-[11px] font-mono text-purple-400 font-semibold block mb-2">
              FRAUD_CARD_RING
            </span>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              A distributed card syndicate signing up duplicate locksmith storefronts from a single hardware device (<code>D-7F3A91</code>). Charges a fixed pool of 8 stolen physical cards across teams to extract money before chargebacks land.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs mb-4">
              <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                Historical Precedent
              </div>
              <div className="flex items-center justify-between text-slate-300 font-mono">
                <span>Suspended Teams:</span>
                <span>TM1017, TM1018</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-mono">
                <span>Historical Payouts:</span>
                <span>PO100131, PO100132</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1.5">
              Action Day Match (10 Nov):
            </span>
            <button
              onClick={() => onSelectPayout('PO100264')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/50 text-xs font-medium text-rose-300 transition group/btn"
            >
              <div className="text-left font-mono">
                <strong>PO100264</strong> • SureLock Services (TM1022)
                <span className="block text-[10px] text-slate-400 font-sans">$5,965.00 • 11 ring txns</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
            </button>
          </div>
        </div>

        {/* Cluster 2: Card Testing */}
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-5 flex flex-col justify-between hover:border-rose-700/60 transition group shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Cpu className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Device: D-B21C44
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
              2. Foreign Card Testing & Cashout
            </h3>
            <span className="text-[11px] font-mono text-amber-400 font-semibold block mb-2">
              FRAUD_CARD_TESTING
            </span>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Automated script runs small $1–$5 probe charges from foreign cards (Vietnam, Romania, Brazil) across innocent merchant accounts. Minutes later, valid cards are charged $1,000+ at a mule merchant account.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs mb-4">
              <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                Historical Precedent
              </div>
              <div className="flex items-center justify-between text-slate-300 font-mono">
                <span>Suspended Team:</span>
                <span>TM1019 (Prime Appliance Fix)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-mono">
                <span>Historical Payout:</span>
                <span>PO100078</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">
              Action Day Perpetrator & Victims:
            </span>
            <button
              onClick={() => onSelectPayout('PO100265')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/50 text-xs font-medium text-rose-300 transition group/btn"
            >
              <div className="text-left font-mono">
                <strong>PO100265 (REJECT)</strong> • QuickFix (TM1023)
                <span className="block text-[10px] text-slate-400 font-sans">$4,389.49 • $1K cashouts on tested cards</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
            </button>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 font-mono">
              <span>Victims in Manual Review:</span>
              <span className="text-amber-400 font-semibold">TM1013, TM1015, TM1016</span>
            </div>
          </div>
        </div>

        {/* Cluster 3: Account Takeover */}
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-5 flex flex-col justify-between hover:border-rose-700/60 transition group shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <Landmark className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Bank: 061000104-4471
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
              3. Mule Payout Account Hijack
            </h3>
            <span className="text-[11px] font-mono text-blue-400 font-semibold block mb-2">
              FRAUD_ACCOUNT_TAKEOVER
            </span>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Fraud ring illicitly redirects merchant payout destination to a mule bank account registered at routing <code>061000104</code> ending in <code>4471</code> (Account holder J. Okafor).
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs mb-4">
              <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                Historical Precedent
              </div>
              <div className="flex items-center justify-between text-slate-300 font-mono">
                <span>Compromised Team:</span>
                <span>TM1020 (Allied Overhead Doors)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-mono">
                <span>Historical Payout:</span>
                <span>PO100197</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1.5">
              Action Day Match (10 Nov):
            </span>
            <button
              onClick={() => onSelectPayout('PO100266')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/50 text-xs font-medium text-rose-300 transition group/btn"
            >
              <div className="text-left font-mono">
                <strong>PO100266</strong> • Granite Garage Door (TM1024)
                <span className="block text-[10px] text-slate-400 font-sans">$2,853.48 • Exact matching mule routing/acc</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
