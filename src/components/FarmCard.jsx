import { MapPin, Clock, ChevronRight, Wifi } from 'lucide-react';
import { getRiskColor, getNetStatusInfo, formatTimeAgo } from '../data/mockData';
import SensorGrid from './SensorGrid';
import WindRiskIndicator from './WindRiskIndicator';
import { useState } from 'react';

export default function FarmCard({ farm, index }) {
  const [expanded, setExpanded] = useState(false);
  const riskColors = getRiskColor(farm.riskLevel);
  const netInfo = getNetStatusInfo(farm.netStatus);

  return (
    <div
      className={`glass-card-hover overflow-hidden animate-slide-up`}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      {/* Risk strip at top */}
      <div className={`h-1 ${riskColors.bg}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-slate-100 truncate">{farm.name}</h3>
              <div className={`w-2 h-2 rounded-full ${riskColors.bg} ${farm.riskLevel === 'severe' ? 'animate-pulse' : ''}`} />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {farm.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(farm.lastUpdated)}
              </span>
            </div>
          </div>

          {/* Net status badge */}
          <div className={`flex items-center gap-1.5 ${netInfo.bg} px-3 py-1.5 rounded-full border border-slate-700/30`}>
            <span className="text-sm">{netInfo.icon}</span>
            <span className={`text-xs font-semibold ${netInfo.color}`}>{netInfo.label}</span>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">{farm.sensors.windSpeed}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">km/h</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-400">{farm.sensors.temperature}°</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Temp</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-sky-400">{farm.sensors.humidity}%</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Humidity</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${farm.sensors.batteryLevel < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {farm.sensors.batteryLevel}%
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Battery</div>
          </div>
        </div>

        {/* Wind Risk */}
        <WindRiskIndicator
          level={farm.riskLevel}
          windSpeed={farm.sensors.windSpeed}
          windGust={farm.sensors.windGust}
        />

        {/* Expand/Collapse for full sensors */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1.5 w-full mt-4 py-2 rounded-lg text-xs font-medium text-slate-400 bg-slate-800/30 border border-slate-700/20 hover:bg-slate-800/50 hover:text-slate-300 transition-all"
        >
          <Wifi className="w-3.5 h-3.5" />
          {expanded ? 'Hide Sensors' : 'View All Sensors'}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {expanded && (
          <div className="mt-4 animate-slide-up">
            <SensorGrid sensors={farm.sensors} />
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 px-1">
              <span>Farm: {farm.area} acres • {farm.variety}</span>
              <span>Threshold: {farm.thresholds.deployNet} km/h</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
