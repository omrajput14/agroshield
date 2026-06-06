import { Settings as SettingsIcon, User, Bell, Shield, Sliders, Globe, Moon } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    push: true,
    criticalOnly: false,
  });

  const [thresholds, setThresholds] = useState({
    deployNet: 35,
    alertWarning: 25,
    alertCritical: 45,
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure system preferences and thresholds</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-300">Profile</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Name</label>
            <input type="text" defaultValue="Rajesh Patil" className="input-field" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email</label>
            <input type="email" defaultValue="rajesh@agroshield.in" className="input-field" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Phone</label>
            <input type="tel" defaultValue="+91 98765 43210" className="input-field" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Role</label>
            <select className="input-field">
              <option>Farm Manager</option>
              <option>Farmer</option>
              <option>Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-300">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'sms', label: 'SMS Alerts', desc: 'Receive wind alerts via SMS' },
            { key: 'email', label: 'Email Notifications', desc: 'Get daily reports and alerts by email' },
            { key: 'push', label: 'Push Notifications', desc: 'Real-time browser notifications' },
            { key: 'criticalOnly', label: 'Critical Only', desc: 'Only receive severe risk alerts' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/20">
              <div>
                <div className="text-sm font-medium text-slate-200">{item.label}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`w-11 h-6 rounded-full transition-all duration-200 ${
                  notifications[item.key] ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Wind Thresholds */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-300">Wind Thresholds (km/h)</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'alertWarning', label: 'Warning Alert', color: 'text-amber-400', max: 60 },
            { key: 'deployNet', label: 'Auto Deploy Net', color: 'text-emerald-400', max: 80 },
            { key: 'alertCritical', label: 'Critical Alert', color: 'text-red-400', max: 100 },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">{item.label}</span>
                <span className={`font-bold ${item.color}`}>{thresholds[item.key]} km/h</span>
              </div>
              <input
                type="range"
                min="5"
                max={item.max}
                value={thresholds[item.key]}
                onChange={(e) => setThresholds((prev) => ({ ...prev, [item.key]: parseInt(e.target.value) }))}
                className="w-full h-2 rounded-full bg-slate-700 appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-emerald-900/50"
              />
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary w-full sm:w-auto">Save Settings</button>
    </div>
  );
}
