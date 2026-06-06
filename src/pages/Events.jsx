import { ScrollText, Shield, AlertTriangle, Radio, Settings, Filter } from 'lucide-react';
import { recentEvents, formatTimeAgo } from '../data/mockData';
import { useState } from 'react';

const eventIcons = {
  deployment: Shield,
  alert: AlertTriangle,
  sensor: Radio,
  system: Settings,
};

const severityStyles = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400', text: 'text-red-400', label: 'Critical' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400', text: 'text-amber-400', label: 'Warning' },
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400', text: 'text-blue-400', label: 'Info' },
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400', text: 'text-emerald-400', label: 'Success' },
};

export default function Events() {
  const [filter, setFilter] = useState('all');

  const filteredEvents = filter === 'all'
    ? recentEvents
    : recentEvents.filter((e) => e.type === filter);

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Event Log</h1>
        <p className="text-sm text-slate-400 mt-1">All system events, deployments, and alerts</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Events' },
          { key: 'deployment', label: 'Deployments' },
          { key: 'alert', label: 'Alerts' },
          { key: 'sensor', label: 'Sensors' },
          { key: 'system', label: 'System' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              filter === f.key
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800/30 text-slate-400 border-slate-700/30 hover:bg-slate-800/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Event List */}
      <div className="space-y-3">
        {filteredEvents.map((event, i) => {
          const Icon = eventIcons[event.type] || Settings;
          const style = severityStyles[event.severity] || severityStyles.info;

          return (
            <div
              key={event.id}
              className={`glass-card-hover p-4 animate-slide-up`}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${style.bg} border ${style.border} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${style.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-200">{event.farmName}</span>
                    <span className={`badge ${style.bg} ${style.text} border ${style.border}`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{event.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{formatTimeAgo(event.timestamp)}</span>
                    <span>•</span>
                    <span className="capitalize">{event.type}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
