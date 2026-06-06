import {
  Wind,
  Compass,
  Thermometer,
  Droplets,
  CloudRain,
  Battery,
  Sun,
  Gauge,
} from 'lucide-react';

const sensorConfig = [
  { key: 'windSpeed', label: 'Wind Speed', icon: Wind, unit: 'km/h', color: 'text-cyan-400', critical: 35 },
  { key: 'windGust', label: 'Wind Gust', icon: Wind, unit: 'km/h', color: 'text-blue-400', critical: 50 },
  { key: 'windDirection', label: 'Direction', icon: Compass, unit: '', color: 'text-indigo-400' },
  { key: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°C', color: 'text-orange-400' },
  { key: 'humidity', label: 'Humidity', icon: Droplets, unit: '%', color: 'text-sky-400', critical: 85 },
  { key: 'rainfall', label: 'Rainfall', icon: CloudRain, unit: 'mm/h', color: 'text-blue-300' },
  { key: 'batteryLevel', label: 'Battery', icon: Battery, unit: '%', color: 'text-emerald-400', low: 30 },
  { key: 'solarOutput', label: 'Solar', icon: Sun, unit: 'W', color: 'text-yellow-400' },
];

export default function SensorGrid({ sensors }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {sensorConfig.map((sensor) => {
        const value = sensors[sensor.key];
        const isCritical = sensor.critical && typeof value === 'number' && value >= sensor.critical;
        const isLow = sensor.low && typeof value === 'number' && value <= sensor.low;
        const isWarning = isCritical || isLow;

        return (
          <div
            key={sensor.key}
            className={`relative rounded-xl p-3 transition-all duration-300 ${
              isWarning
                ? 'bg-red-500/5 border border-red-500/20'
                : 'bg-slate-800/30 border border-slate-700/20 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <sensor.icon className={`w-3.5 h-3.5 ${isWarning ? 'text-red-400' : sensor.color}`} />
              <span className="sensor-label">{sensor.label}</span>
            </div>
            <div className={`sensor-value ${isWarning ? 'text-red-400' : 'text-slate-100'}`}>
              {value}
              <span className="text-sm font-normal text-slate-500 ml-1">{sensor.unit}</span>
            </div>
            {isWarning && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
