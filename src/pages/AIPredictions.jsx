import { useState, useEffect } from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, Target, Clock, Zap, Loader2 } from 'lucide-react';
import { api } from '../api';

export default function AIPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [predsData, farmsData] = await Promise.all([
          api.get('/predictions'),
          api.get('/farms')
        ]);
        setPredictions(predsData);
        setFarms(farmsData);
      } catch (error) {
        console.error('Failed to fetch AI predictions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">AI Predictions</h1>
        <p className="text-sm text-slate-400 mt-1">Machine learning–powered risk forecasting and recommendations</p>
      </div>

      {/* AI Model Status */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">AgroShield AI Model v2.4</h3>
            <p className="text-xs text-slate-500">Trained on 3 years of wind data • 94.2% accuracy</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">Active</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Model Accuracy', value: '94.2%', icon: Target, color: 'text-purple-400' },
            { label: 'Last Prediction', value: '2m ago', icon: Clock, color: 'text-blue-400' },
            { label: 'Predictions Today', value: '156', icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'True Positive Rate', value: '91.8%', icon: Zap, color: 'text-cyan-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-3 text-center">
              <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1.5`} />
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-4">
        {predictions.map((pred, i) => {
          const farm = farms.find((f) => f.id === pred.farm_id);
          const isCritical = pred.damage_probability > 0.85;
          const isHigh = pred.damage_probability > 0.7;

          return (
            <div
              key={pred.id}
              className={`glass-card overflow-hidden animate-slide-up ${
                isCritical ? 'border-red-500/30' : isHigh ? 'border-amber-500/30' : ''
              }`}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              {/* Risk strip */}
              <div className={`h-1 ${isCritical ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'}`} />

              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-100">{pred.farm_name}</h3>
                      {isCritical && <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />}
                    </div>
                    {farm && (
                      <p className="text-xs text-slate-400">{farm.location} • {farm.area_acres} acres</p>
                    )}
                  </div>
                  <div className={`text-right px-4 py-2 rounded-xl ${
                    isCritical ? 'bg-red-500/10 border border-red-500/20' : isHigh ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'
                  }`}>
                    <div className={`text-2xl font-bold ${isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {Math.round(pred.damage_probability * 100)}%
                    </div>
                    <div className="text-[10px] text-slate-500">Damage Risk</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isCritical ? 'bg-gradient-to-r from-red-600 to-red-400' : isHigh ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                      }`}
                      style={{ width: `${pred.damage_probability * 100}%` }}
                    />
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-cyan-400">{pred.predicted_peak_wind} <span className="text-xs text-slate-500">km/h</span></div>
                    <div className="text-[9px] text-slate-500 uppercase">Peak Wind</div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-slate-200">{pred.peak_time}</div>
                    <div className="text-[9px] text-slate-500 uppercase">Peak Time</div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-purple-400">{Math.round(pred.confidence * 100)}%</div>
                    <div className="text-[9px] text-slate-500 uppercase">Confidence</div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-emerald-400">{farm?.net_status === 'deployed' ? '🛡️' : farm?.net_status === 'deploying' ? '⚙️' : '📂'}</div>
                    <div className="text-[9px] text-slate-500 uppercase">Net Status</div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`rounded-xl p-4 ${
                  isCritical ? 'bg-red-500/5 border border-red-500/15' : 'bg-slate-800/30 border border-slate-700/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-slate-300">AI Recommendation</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{pred.recommendation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
