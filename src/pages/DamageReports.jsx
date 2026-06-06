import { FileWarning, Plus, Camera, DollarSign, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';

const mockReports = [
  {
    id: 'dmg-001',
    farmName: 'Sakshi Agro Farm',
    date: '2026-06-05',
    type: 'Wind Damage',
    severity: 'severe',
    estimatedLoss: 125000,
    description: 'Multiple banana bunches toppled in northeastern section. Approximately 40 plants affected by wind gusts exceeding 70 km/h.',
    status: 'under_review',
    photos: 2,
  },
  {
    id: 'dmg-002',
    farmName: 'Green Horizon Plantation',
    date: '2026-06-04',
    type: 'Partial Damage',
    severity: 'moderate',
    estimatedLoss: 45000,
    description: 'Leaf tearing observed in western perimeter. Nets deployed late due to sensor delay. 15 plants with moderate leaf damage.',
    status: 'approved',
    photos: 3,
  },
  {
    id: 'dmg-003',
    farmName: 'Nandini Banana Estate',
    date: '2026-06-02',
    type: 'Minor Damage',
    severity: 'low',
    estimatedLoss: 12000,
    description: 'Minor leaf damage from sustained winds. No structural damage to plants. Nets deployed successfully.',
    status: 'resolved',
    photos: 1,
  },
];

const statusStyles = {
  under_review: { label: 'Under Review', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  approved: { label: 'Approved', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  resolved: { label: 'Resolved', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

const severityStyles = {
  severe: { label: 'Severe', text: 'text-red-400' },
  moderate: { label: 'Moderate', text: 'text-amber-400' },
  low: { label: 'Low', text: 'text-emerald-400' },
};

export default function DamageReports() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Damage Reports</h1>
          <p className="text-sm text-slate-400 mt-1">Report and track crop damage across farms</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" />
          New Report
        </button>
      </div>

      {/* New Report Form */}
      {showForm && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Submit Damage Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Farm</label>
              <select className="input-field">
                <option>Select farm...</option>
                <option>Cavendish Valley Farm</option>
                <option>Green Horizon Plantation</option>
                <option>Nandini Banana Estate</option>
                <option>Sakshi Agro Farm</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Damage Type</label>
              <select className="input-field">
                <option>Select type...</option>
                <option>Wind Damage</option>
                <option>Partial Damage</option>
                <option>Minor Damage</option>
                <option>Structural Collapse</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Estimated Loss (₹)</label>
              <input type="number" placeholder="Enter amount" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Date</label>
              <input type="date" className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Description</label>
              <textarea rows={3} placeholder="Describe the damage..." className="input-field resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Photos</label>
              <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-8 text-center hover:border-emerald-500/30 transition-colors cursor-pointer">
                <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Click or drag to upload photos</p>
                <p className="text-[10px] text-slate-500 mt-1">JPG, PNG up to 10MB each</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-primary">Submit Report</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-3">
        {mockReports.map((report, i) => {
          const status = statusStyles[report.status];
          const severity = severityStyles[report.severity];

          return (
            <div
              key={report.id}
              className="glass-card-hover p-5 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-200">{report.farmName}</h3>
                    <span className={`badge ${status.bg} ${status.text} border ${status.border}`}>{status.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{report.date}</span>
                    <span className={`font-semibold ${severity.text}`}>{severity.label}</span>
                    <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{report.photos} photos</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-red-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-lg font-bold">₹{report.estimatedLoss.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Estimated Loss</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{report.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
