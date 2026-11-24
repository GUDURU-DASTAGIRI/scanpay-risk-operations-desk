import React from 'react';
import { DollarSign, CheckCircle2, AlertCircle, XCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { PayoutPending } from '../types';

interface KPIHeaderProps {
  payouts: PayoutPending[];
  historicalDailyAvg: number; // e.g. average daily payout dollars over 20 days
  historicalDailyCount: number;
}

export const KPIHeader: React.FC<KPIHeaderProps> = ({
  payouts,
  historicalDailyAvg,
  historicalDailyCount,
}) => {
  const totalAmount = payouts.reduce((sum, p) => sum + p.payout_amount_usd, 0);
  const totalCount = payouts.length;

  const approvedPayouts = payouts.filter((p) => p.decision === 'Approve');
  const approvedAmount = approvedPayouts.reduce((sum, p) => sum + p.payout_amount_usd, 0);

  const reviewPayouts = payouts.filter((p) => p.decision === 'Manual review');
  const reviewAmount = reviewPayouts.reduce((sum, p) => sum + p.payout_amount_usd, 0);

  const rejectPayouts = payouts.filter((p) => p.decision === 'Reject');
  const rejectAmount = rejectPayouts.reduce((sum, p) => sum + p.payout_amount_usd, 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Pipeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total 10 Nov Batch</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="font-semibold text-slate-300 font-mono">{totalCount} Payouts</span>
              <span>•</span>
              <span>213 Trans</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              T+2 Ready
            </span>
          </div>
        </div>
      </div>

      {/* 2. Paid Automatically (Approve) */}
      <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-emerald-700/60 transition">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Paid Automatically
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold text-emerald-300 tracking-tight font-mono">
              {formatCurrency(approvedAmount)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="font-semibold text-slate-200 font-mono">{approvedPayouts.length} Approved</span>
              <span>•</span>
              <span>{((approvedAmount / totalAmount) * 100).toFixed(0)}% of Volume</span>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <span>Zero ops friction</span>
          </div>
        </div>
      </div>

      {/* 3. Waiting for a Person (Manual Review) */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-amber-700/60 transition">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Waiting for Ops Review
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold text-amber-300 tracking-tight font-mono">
              {formatCurrency(reviewAmount)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="font-semibold text-amber-300 font-mono">{reviewPayouts.length} In Review</span>
              <span>•</span>
              <span>Outliers & Victims</span>
            </div>
          </div>
          <div className="text-right text-[11px]">
            <span className="text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium">
              Requires Action
            </span>
          </div>
        </div>
      </div>

      {/* 4. Held Back (Fraud Reject) */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-rose-700/60 transition">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Held Back (Fraud)
          </span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold text-rose-400 tracking-tight font-mono">
              {formatCurrency(rejectAmount)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="font-semibold text-rose-300 font-mono">{rejectPayouts.length} Blocked</span>
              <span>•</span>
              <span>3 Fraud Clusters</span>
            </div>
          </div>
          <div className="text-right text-[11px]">
            <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 font-medium">
              $ Loss Prevented
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
