import React, { useState } from 'react';
import { X, Edit3, AlertTriangle, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { PayoutPending, DecisionType } from '../types';

interface OverrideModalProps {
  payout: PayoutPending;
  onClose: () => void;
  onSaveOverride: (payoutId: string, newDecision: DecisionType, reason: string) => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  payout,
  onClose,
  onSaveOverride,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<DecisionType>(payout.decision);
  const [reason, setReason] = useState(payout.override_reason || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A plain-English override reason is required for compliance audit logs.');
      return;
    }
    if (selectedDecision === payout.decision) {
      setError('Please select a different decision to perform an override.');
      return;
    }

    onSaveOverride(payout.payout_id, selectedDecision, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Override Decision</h3>
              <p className="text-xs text-slate-400 font-mono">
                {payout.payout_id} • {payout.team_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Current Decision Pill */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Current System Decision:</span>
            <span className="font-bold text-slate-200 font-mono">{payout.decision}</span>
          </div>

          {/* New Decision Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select New Decision:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedDecision('Approve')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  selectedDecision === 'Approve'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision('Manual review')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  selectedDecision === 'Manual review'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-950'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Manual Review</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision('Reject')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  selectedDecision === 'Reject'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-950'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>

          {/* Mandatory Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Override Reason (Plain English - Required for Audit):
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="e.g. Verified commercial safe installation invoice with owner over phone; invoice checked."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition leading-relaxed resize-none"
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/40 text-[11px] text-blue-300 leading-relaxed">
            <strong>Principle 3:</strong> "Ops can override any decision. An override needs a reason and is recorded, because today's decisions are tomorrow's history."
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/50 transition active:scale-95"
            >
              Save & Record Override
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
