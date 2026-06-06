import { BrainCircuit, TrendingUp, AlertTriangle } from 'lucide-react';
import { getRiskColor } from '../data/mockData';

export default function AIPredictionCard({ predictions }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <BrainCircuit className="w-4.5 h-4.5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-300">AI Risk Predictions</h3>
          <p className="text-[10px] text-slate-500">Next 6 hours forecast</p>
        </div>
      </div>

      <div className="space-y-3">
        {predictions.map((pred, i) => {
          const isHigh = pred.damageProbability > 0.7;
          const isCritical = pred.damageProbability > 0.85;

          return (
            <div
              key={pred.farmId}
              className={`rounded-xl border p-4 transition-all duration-300 hover:scale-[1.01] ${
                isCritical
                  ? 'bg-red-500/5 border-red-500/20'
                  : isHigh
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-slate-800/30 border-slate-700/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200">{pred.farmName}</span>
                {isCritical && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />}
              </div>

              {/* Probability bar */}
              <div className="mb-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">Damage Probability</span>
                  <span className={`font-bold ${
                    isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {Math.round(pred.damageProbability * 100)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isCritical ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pred.damageProbability * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-200">{pred.predictedPeakWind} <span className="text-[10px] text-slate-500">km/h</span></div>
                  <div className="text-[9px] text-slate-500">Peak Wind</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-200">{pred.peakTime}</div>
                  <div className="text-[9px] text-slate-500">Peak Time</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-purple-400">{Math.round(pred.confidence * 100)}%</div>
                  <div className="text-[9px] text-slate-500">Confidence</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/30 rounded-lg p-2">
                💡 {pred.recommendation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
