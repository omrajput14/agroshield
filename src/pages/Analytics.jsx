import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Shield, DollarSign, Zap, Wind, Loader2 } from 'lucide-react';
import { api } from '../api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const responseTimeData = [
  { day: 'Mon', time: 3.8 },
  { day: 'Tue', time: 4.2 },
  { day: 'Wed', time: 3.5 },
  { day: 'Thu', time: 5.1 },
  { day: 'Fri', time: 4.0 },
  { day: 'Sat', time: 3.2 },
  { day: 'Sun', time: 4.8 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-300 mb-1">{label}</p>
        {payload.map((item, i) => (
          <p key={i} className="text-xs" style={{ color: item.color || item.fill }}>
            {item.name}: <span className="font-bold">{typeof item.value === 'number' && item.value > 1000 ? `₹${(item.value / 1000).toFixed(0)}K` : item.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/dashboard');
        setData(response);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const { stats, monthly_deployments, risk_distribution } = data;

  const statCards = [
    { label: 'Total Deployments', value: stats.total_deployments, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Avg Response Time', value: `${stats.avg_response_time}s`, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Losses Prevented', value: `₹${(stats.losses_prevented_estimate / 100000).toFixed(1)}L`, icon: DollarSign, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'Alerts Sent', value: stats.alerts_sent, icon: Wind, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Performance metrics and deployment statistics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, i) => (
          <div key={stat.label} className="glass-card-hover p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Deployments */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-300">Monthly Deployments</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly_deployments} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="deployments" name="Deployments" fill="#22c55e" fillOpacity={0.7} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-300">Risk Distribution (30 days)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {risk_distribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} fillOpacity={0.8} stroke="transparent" />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Losses vs Prevented */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-300">Losses vs Prevented (₹)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly_deployments} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} tickFormatter={(v) => `${v/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="prevented" name="Prevented" fill="#22c55e" fillOpacity={0.6} radius={[6, 6, 0, 0]} />
                <Bar dataKey="losses" name="Losses" fill="#ef4444" fillOpacity={0.6} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-300">Net Response Time (seconds)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={responseTimeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="respGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} domain={[0, 8]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="time" name="Response Time" stroke="#22d3ee" strokeWidth={2} fill="url(#respGradient)" dot={{ fill: '#22d3ee', strokeWidth: 0, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
