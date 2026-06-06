import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-300 mb-1">{label}</p>
        {payload.map((item, i) => (
          <p key={i} className="text-xs" style={{ color: item.color }}>
            {item.name}: <span className="font-bold">{item.value} km/h</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function WindTrendChart({ data }) {
  // Show every 4th label to avoid crowding
  const filteredData = data.map((d, i) => ({
    ...d,
    displayLabel: i % 6 === 0 ? d.label : '',
  }));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-300">Wind Speed Trend (24h)</h3>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded bg-cyan-400" />
            <span className="text-slate-400">Speed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded bg-blue-500/50" />
            <span className="text-slate-400">Gust</span>
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded bg-red-500/40 border-t border-dashed border-red-400" />
            <span className="text-slate-400">Threshold</span>
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gustGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="displayLabel"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              domain={[0, 80]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={35} stroke="#ef4444" strokeDasharray="6 4" strokeOpacity={0.5} label="" />
            <Area
              type="monotone"
              dataKey="windGust"
              stroke="#3b82f6"
              strokeWidth={1}
              fillOpacity={1}
              fill="url(#gustGradient)"
              name="Gust"
              dot={false}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="windSpeed"
              stroke="#22d3ee"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#windGradient)"
              name="Speed"
              dot={false}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
