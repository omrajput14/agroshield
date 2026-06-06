import { useState, useEffect } from 'react';
import { CloudSun, Clock, Droplets, Loader2 } from 'lucide-react';
import { api } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const riskColors = {
  safe: '#22c55e',
  moderate: '#f59e0b',
  high: '#f97316',
  severe: '#ef4444',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-300 mb-1">{label}</p>
        {payload.map((item, i) => (
          <p key={i} className="text-xs" style={{ color: item.fill || item.color }}>
            {item.name}: <span className="font-bold">{item.value} km/h</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Forecasts() {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const response = await api.get('/forecasts');
        
        setForecastData(response);
      } catch (error) {
        console.error('Failed to fetch forecasts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchForecasts();
  }, []);

  if (loading || !forecastData) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Weather Forecasts</h1>
        <p className="text-sm text-slate-400 mt-1">24-hour and 7-day wind & weather predictions</p>
      </div>

      {/* 7-Day Forecast Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <CloudSun className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-300">7-Day Wind Forecast</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastData.daily} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="maxWind" name="Max Wind" radius={[6, 6, 0, 0]}>
                {forecastData.daily.map((entry, index) => (
                  <Cell key={index} fill={riskColors[entry.risk]} fillOpacity={0.8} />
                ))}
              </Bar>
              <Bar dataKey="avgWind" name="Avg Wind" radius={[6, 6, 0, 0]} fill="#64748b" fillOpacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecastData.daily.map((day, i) => (
          <div
            key={day.day}
            className="glass-card-hover p-4 text-center animate-slide-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <div className="text-sm font-bold text-slate-200 mb-2">{day.day}</div>
            <div className={`w-3 h-3 rounded-full mx-auto mb-2`} style={{ backgroundColor: riskColors[day.risk] }} />
            <div className="space-y-1.5">
              <div>
                <div className="text-lg font-bold text-cyan-400">{day.maxWind}</div>
                <div className="text-[9px] text-slate-500 uppercase">Max km/h</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-blue-400">{day.maxGust}</div>
                <div className="text-[9px] text-slate-500 uppercase">Gust</div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Droplets className="w-3 h-3 text-blue-300" />
                <span className="text-xs text-blue-300">{day.rainfall}mm</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Breakdown */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-300">24-Hour Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {forecastData.hourly.map((hour, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-16 rounded-xl p-3 text-center border transition-all ${
                  hour.riskLevel === 'high'
                    ? 'bg-orange-500/5 border-orange-500/20'
                    : hour.riskLevel === 'moderate'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-slate-800/30 border-slate-700/20'
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-1">{hour.time}</div>
                <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: riskColors[hour.riskLevel] }} />
                <div className="text-sm font-bold text-slate-200">{Math.round(hour.windSpeed)}</div>
                <div className="text-[9px] text-slate-500">km/h</div>
                <div className="text-[10px] text-orange-400 mt-1">{hour.temperature.toFixed(0)}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
