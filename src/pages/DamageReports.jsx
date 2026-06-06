import { FileWarning, Plus, Camera, DollarSign, MapPin, Calendar, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../api';

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
  const [reports, setReports] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    farm_id: '',
    type: '',
    estimated_loss: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    severity: 'moderate',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsData, farmsData] = await Promise.all([
        api.get('/damage-reports'),
        api.get('/farms')
      ]);
      setReports(reportsData);
      setFarms(farmsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        farm_id: parseInt(formData.farm_id, 10),
        estimated_loss: parseFloat(formData.estimated_loss) || 0,
        status: 'under_review',
        photo_count: 0 // Mocking photo count for now
      };
      
      await api.post('/damage-reports', dataToSubmit);
      await fetchData(); // Refresh list
      setShowForm(false);
      
      // Reset form
      setFormData({
        farm_id: '',
        type: '',
        estimated_loss: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        severity: 'moderate',
      });
    } catch (error) {
      console.error('Failed to submit report', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

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
        <form onSubmit={handleSubmit} className="glass-card p-6 animate-slide-up">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Submit Damage Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Farm</label>
              <select 
                required
                value={formData.farm_id}
                onChange={(e) => setFormData({...formData, farm_id: e.target.value})}
                className="input-field"
              >
                <option value="">Select farm...</option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>{farm.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Damage Type</label>
              <select 
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="input-field"
              >
                <option value="">Select type...</option>
                <option value="Wind Damage">Wind Damage</option>
                <option value="Partial Damage">Partial Damage</option>
                <option value="Minor Damage">Minor Damage</option>
                <option value="Structural Collapse">Structural Collapse</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Severity</label>
              <select 
                required
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
                className="input-field"
              >
                <option value="severe">Severe</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Estimated Loss (₹)</label>
              <input 
                required
                type="number" 
                placeholder="Enter amount" 
                value={formData.estimated_loss}
                onChange={(e) => setFormData({...formData, estimated_loss: e.target.value})}
                className="input-field" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Description</label>
              <textarea 
                required
                rows={3} 
                placeholder="Describe the damage..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input-field resize-none" 
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit Report
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map((report, i) => {
          const status = statusStyles[report.status] || statusStyles.under_review;
          const severity = severityStyles[report.severity] || severityStyles.moderate;

          return (
            <div
              key={report.id}
              className="glass-card-hover p-5 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-200">{report.farm_name}</h3>
                    <span className={`badge ${status.bg} ${status.text} border ${status.border}`}>{status.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(report.date).toLocaleDateString()}</span>
                    <span className={`font-semibold ${severity.text}`}>{severity.label}</span>
                    <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{report.photo_count} photos</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-red-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-lg font-bold">₹{report.estimated_loss?.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Estimated Loss</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{report.description}</p>
            </div>
          );
        })}
        {reports.length === 0 && !loading && (
          <div className="glass-card p-12 text-center">
            <FileWarning className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No damage reports found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
