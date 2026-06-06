import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import EventFeed from '../components/EventFeed';
import { api } from '../api';

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get('/events?limit=100');
        const mappedEvents = data.map(event => ({
          ...event,
          farmName: event.farm_name,
          createdAt: event.created_at,
          timestamp: event.created_at,
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filterType !== 'all' && event.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        event.message.toLowerCase().includes(q) ||
        event.farmName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
        <h1 className="text-2xl font-bold text-slate-100">System Events</h1>
        <p className="text-sm text-slate-400 mt-1">Audit log of all alerts, deployments, and system activities.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search events or farms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'alert', 'deployment', 'system'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border capitalize ${
                filterType === type
                  ? 'bg-slate-700 text-slate-200 border-slate-600'
                  : 'bg-slate-800/30 text-slate-400 border-slate-700/30 hover:bg-slate-800/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <EventFeed events={filteredEvents} />
      </div>
    </div>
  );
}
