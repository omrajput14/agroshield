import { Activity, Wind, Shield, AlertTriangle, Radio, Zap } from 'lucide-react';

export default function StatsBar({ farms, analytics }) {
  const severeCount = farms.filter((f) => f.riskLevel === 'severe').length;
  const highCount = farms.filter((f) => f.riskLevel === 'high').length;
  const deployedCount = farms.filter((f) => f.netStatus === 'deployed').length;
  const validFarms = farms.filter(f => f.sensors);
  const maxWind = validFarms.length > 0 ? Math.max(...validFarms.map((f) => f.sensors.windSpeed || 0)) : 0;
  const avgWind = validFarms.length > 0 ? Math.round(validFarms.reduce((s, f) => s + (f.sensors.windSpeed || 0), 0) / validFarms.length * 10) / 10 : 0;

  const stats = [
    {
      label: 'Active Farms',
      value: farms.length,
      icon: Activity,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Max Wind',
      value: `${maxWind}`,
      suffix: 'km/h',
      icon: Wind,
      color: maxWind > 40 ? 'text-red-400' : 'text-cyan-400',
      bgColor: maxWind > 40 ? 'bg-red-500/10' : 'bg-cyan-500/10',
    },
    {
      label: 'Nets Deployed',
      value: deployedCount,
      suffix: `/ ${farms.length}`,
      icon: Shield,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
    },
    {
      label: 'Active Alerts',
      value: severeCount + highCount,
      icon: AlertTriangle,
      color: severeCount > 0 ? 'text-red-400' : 'text-amber-400',
      bgColor: severeCount > 0 ? 'bg-red-500/10' : 'bg-amber-500/10',
      pulse: severeCount > 0,
    },
    {
      label: 'Sensors Online',
      value: analytics?.total_sensors || 0,
      icon: Radio,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
    {
      label: 'Uptime',
      value: `${analytics?.uptime_percentage || 0}%`,
      icon: Zap,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="glass-card-hover p-4 animate-slide-up"
          style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            {stat.pulse && (
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            )}
          </div>
          <div className={`text-xl font-bold ${stat.color}`}>
            {stat.value}
            {stat.suffix && <span className="text-sm font-normal text-slate-500 ml-1">{stat.suffix}</span>}
          </div>
          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
