import { getRiskColor } from '../utils/helpers';
import { Wind, AlertTriangle } from 'lucide-react';

const riskLabels = {
  safe: 'Safe',
  moderate: 'Moderate',
  high: 'High Risk',
  severe: 'Severe Risk',
};

const riskDescriptions = {
  safe: 'Wind conditions normal. No action needed.',
  moderate: 'Wind increasing. Monitor closely.',
  high: 'High winds detected. Nets deploying.',
  severe: 'Dangerous winds! Emergency protocol active.',
};

export default function WindRiskIndicator({ level, windSpeed, windGust }) {
  const colors = getRiskColor(level);
  const percentage = Math.min((windSpeed / 80) * 100, 100);

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-slate-900/60 backdrop-blur-xl p-5`}>
      {/* Animated background glow for severe */}
      {level === 'severe' && (
        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wind className={`w-5 h-5 ${colors.text}`} />
            <h3 className="text-sm font-semibold text-slate-300">Wind Risk Level</h3>
          </div>
          {(level === 'high' || level === 'severe') && (
            <AlertTriangle className={`w-5 h-5 ${colors.text} animate-pulse`} />
          )}
        </div>

        {/* Risk badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-4 h-4 rounded-full ${colors.bg} shadow-lg ${colors.glow} ${level === 'severe' ? 'animate-pulse' : ''}`} />
          <span className={`text-2xl font-bold ${colors.text}`}>
            {riskLabels[level]}
          </span>
        </div>

        {/* Wind speed bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Current: {windSpeed} km/h</span>
            <span>Gust: {windGust} km/h</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${colors.bg} transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80 km/h</span>
          </div>
        </div>

        <p className={`text-xs ${colors.text} opacity-80`}>
          {riskDescriptions[level]}
        </p>
      </div>
    </div>
  );
}
