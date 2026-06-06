import { Shield, FolderOpen, Loader2 } from 'lucide-react';
import { getNetStatusInfo } from '../utils/helpers';

export default function NetStatusPanel({ farms }) {
  const deployed = farms.filter((f) => f.netStatus === 'deployed').length;
  const retracted = farms.filter((f) => f.netStatus === 'retracted').length;
  const deploying = farms.filter((f) => f.netStatus === 'deploying').length;

  const statuses = [
    {
      key: 'deployed',
      label: 'Deployed',
      count: deployed,
      icon: Shield,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      description: 'Nets protecting crops',
    },
    {
      key: 'deploying',
      label: 'Deploying',
      count: deploying,
      icon: Loader2,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      description: 'Nets in motion',
      animate: true,
    },
    {
      key: 'retracted',
      label: 'Retracted',
      count: retracted,
      icon: FolderOpen,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-700/30',
      description: 'Nets stored',
    },
  ];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-300">Net Deployment Status</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {statuses.map((status) => (
          <div
            key={status.key}
            className={`rounded-xl border ${status.borderColor} ${status.bgColor} p-4 text-center transition-all duration-300 hover:scale-[1.02]`}
          >
            <status.icon
              className={`w-6 h-6 ${status.color} mx-auto mb-2 ${
                status.animate ? 'animate-spin-slow' : ''
              }`}
            />
            <div className={`text-3xl font-bold ${status.color} mb-1`}>{status.count}</div>
            <div className="text-xs font-semibold text-slate-300 mb-0.5">{status.label}</div>
            <div className="text-[10px] text-slate-500">{status.description}</div>
          </div>
        ))}
      </div>

      {/* Per-farm breakdown */}
      <div className="mt-4 space-y-2">
        {farms.map((farm) => {
          const info = getNetStatusInfo(farm.netStatus);
          return (
            <div
              key={farm.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/20"
            >
              <span className="text-xs text-slate-300 truncate mr-2">{farm.name}</span>
              <div className={`flex items-center gap-1.5 ${info.bg} px-2.5 py-1 rounded-full`}>
                <span className="text-sm"><info.icon className="w-3.5 h-3.5" /></span>
                <span className={`text-[11px] font-semibold ${info.color}`}>{info.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
