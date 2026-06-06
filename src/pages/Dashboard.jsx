import { useState, useEffect } from 'react';
import { Search, RefreshCw, Filter, MapPin } from 'lucide-react';
import FarmCard from '../components/FarmCard';
import StatsBar from '../components/StatsBar';
import NetStatusPanel from '../components/NetStatusPanel';
import WindTrendChart from '../components/WindTrendChart';
import EventFeed from '../components/EventFeed';
import AIPredictionCard from '../components/AIPredictionCard';
import {
  farms as initialFarms,
  recentEvents,
  windTrendData,
  analyticsData,
  aiPredictions,
} from '../data/mockData';

export default function Dashboard() {
  const [farms, setFarms] = useState(initialFarms);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulated live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFarms((prev) =>
        prev.map((farm) => ({
          ...farm,
          sensors: {
            ...farm.sensors,
            windSpeed: Math.round((farm.sensors.windSpeed + (Math.random() - 0.5) * 3) * 10) / 10,
            windGust: Math.round((farm.sensors.windGust + (Math.random() - 0.5) * 4) * 10) / 10,
            temperature: Math.round((farm.sensors.temperature + (Math.random() - 0.5) * 0.3) * 10) / 10,
            humidity: Math.min(100, Math.max(0, Math.round(farm.sensors.humidity + (Math.random() - 0.5) * 2))),
          },
          lastUpdated: new Date().toISOString(),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  const filteredFarms = farms
    .filter((farm) => {
      if (riskFilter !== 'all' && farm.riskLevel !== riskFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          farm.name.toLowerCase().includes(q) ||
          farm.location.toLowerCase().includes(q) ||
          farm.owner.toLowerCase().includes(q)
        );
      }
      return true;
    });

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Farm Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time monitoring across {farms.length} banana farms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            className="btn-secondary !px-3 !py-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar farms={farms} analytics={analyticsData} />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search farms, locations, or owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'safe', 'moderate', 'high', 'severe'].map((level) => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                riskFilter === level
                  ? level === 'all'
                    ? 'bg-slate-700 text-slate-200 border-slate-600'
                    : level === 'safe'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : level === 'moderate'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : level === 'high'
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-slate-800/30 text-slate-400 border-slate-700/30 hover:bg-slate-800/50'
              }`}
            >
              {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Farm cards + Sidebar panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Farm Cards — 2/3 width */}
        <div className="xl:col-span-2 space-y-4">
          {/* Wind Trend Chart */}
          <WindTrendChart data={windTrendData} />

          {/* Farm cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFarms.map((farm, i) => (
              <FarmCard key={farm.id} farm={farm} index={i} />
            ))}
          </div>

          {filteredFarms.length === 0 && (
            <div className="glass-card p-12 text-center">
              <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No farms match your search or filter.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar — 1/3 width */}
        <div className="space-y-4">
          <NetStatusPanel farms={farms} />
          <AIPredictionCard predictions={aiPredictions} />
          <EventFeed events={recentEvents} />
        </div>
      </div>
    </div>
  );
}
