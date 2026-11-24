import React from 'react';
import { X, History, ArrowRight, UserCheck } from 'lucide-react';
import { OverrideLog } from '../types';

interface AuditTrailModalProps {
  logs: OverrideLog[];
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ logs, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Ops Overrides Audit Trail</h3>
              <p className="text-xs text-slate-400">
                Immutable chronological log of all human risk decisions
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

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-slate-400">No overrides recorded yet</p>
              <p className="mt-1">All decisions currently reflect the automated risk rules engine.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-slate-200">
                    {log.payout_id} • <span className="text-blue-400 font-sans">{log.team_name}</span> ({log.team_id})
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                    {log.previous_decision}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                    {log.new_decision}
                  </span>
                  <span className="text-slate-500 text-[11px] ml-auto flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-slate-400" />
                    By: {log.operator}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300 italic">
                  "{log.reason}"
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>{logs.length} total overrides in current session</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
