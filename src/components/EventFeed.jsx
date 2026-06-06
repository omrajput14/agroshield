import { ScrollText, Shield, AlertTriangle, Radio, Settings, CheckCircle2 } from 'lucide-react';
import { formatTimeAgo } from '../data/mockData';

const eventIcons = {
  deployment: Shield,
  alert: AlertTriangle,
  sensor: Radio,
  system: Settings,
};

const severityStyles = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400', text: 'text-red-400' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400', text: 'text-amber-400' },
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400', text: 'text-blue-400' },
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400', text: 'text-emerald-400' },
};

export default function EventFeed({ events }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-300">Recent Events</h3>
        </div>
        <span className="text-xs text-slate-500">{events.length} events</span>
      </div>

      <div className="space-y-2.5">
        {events.map((event, i) => {
          const Icon = eventIcons[event.type] || Settings;
          const style = severityStyles[event.severity] || severityStyles.info;

          return (
            <div
              key={event.id}
              className={`flex gap-3 p-3 rounded-xl ${style.bg} border ${style.border} animate-slide-up transition-all duration-200 hover:scale-[1.01]`}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${style.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-200 truncate">{event.farmName}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${style.dot} ${event.severity === 'critical' ? 'animate-pulse' : ''}`} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{event.message}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">{formatTimeAgo(event.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
