// AgroShield AI — Realistic mock data for banana farm wind protection system

export const farms = [
  {
    id: 'farm-001',
    name: 'Cavendish Valley Farm',
    location: 'Jalgaon, Maharashtra',
    coordinates: { lat: 21.0077, lng: 75.5626 },
    area: 45, // acres
    variety: 'Grand Naine',
    owner: 'Rajesh Patil',
    netStatus: 'retracted',
    riskLevel: 'safe',
    lastUpdated: new Date(Date.now() - 30000).toISOString(),
    sensors: {
      windSpeed: 12.4,
      windDirection: 'NNW',
      windGust: 18.2,
      temperature: 31.5,
      humidity: 68,
      rainfall: 0,
      soilMoisture: 42,
      batteryLevel: 94,
      solarOutput: 48.2,
      pressure: 1013.2,
    },
    thresholds: {
      deployNet: 35,
      alertWarning: 25,
      alertCritical: 45,
    },
  },
  {
    id: 'farm-002',
    name: 'Green Horizon Plantation',
    location: 'Anand, Gujarat',
    coordinates: { lat: 22.5645, lng: 72.9289 },
    area: 72,
    variety: 'Robusta',
    owner: 'Suresh Mehta',
    netStatus: 'deployed',
    riskLevel: 'high',
    lastUpdated: new Date(Date.now() - 15000).toISOString(),
    sensors: {
      windSpeed: 38.7,
      windDirection: 'WSW',
      windGust: 52.1,
      temperature: 28.3,
      humidity: 82,
      rainfall: 4.5,
      soilMoisture: 71,
      batteryLevel: 78,
      solarOutput: 22.1,
      pressure: 1008.5,
    },
    thresholds: {
      deployNet: 30,
      alertWarning: 22,
      alertCritical: 40,
    },
  },
  {
    id: 'farm-003',
    name: 'Nandini Banana Estate',
    location: 'Thrissur, Kerala',
    coordinates: { lat: 10.5276, lng: 76.2144 },
    area: 28,
    variety: 'Nendran',
    owner: 'Priya Nair',
    netStatus: 'deploying',
    riskLevel: 'moderate',
    lastUpdated: new Date(Date.now() - 5000).toISOString(),
    sensors: {
      windSpeed: 26.1,
      windDirection: 'SE',
      windGust: 33.8,
      temperature: 29.8,
      humidity: 74,
      rainfall: 1.2,
      soilMoisture: 58,
      batteryLevel: 88,
      solarOutput: 35.6,
      pressure: 1010.8,
    },
    thresholds: {
      deployNet: 32,
      alertWarning: 24,
      alertCritical: 42,
    },
  },
  {
    id: 'farm-004',
    name: 'Sakshi Agro Farm',
    location: 'Trichy, Tamil Nadu',
    coordinates: { lat: 10.7905, lng: 78.7047 },
    area: 55,
    variety: 'Red Banana',
    owner: 'Karthik Rajan',
    netStatus: 'deployed',
    riskLevel: 'severe',
    lastUpdated: new Date(Date.now() - 8000).toISOString(),
    sensors: {
      windSpeed: 54.3,
      windDirection: 'NE',
      windGust: 71.2,
      temperature: 26.1,
      humidity: 91,
      rainfall: 12.8,
      soilMoisture: 89,
      batteryLevel: 62,
      solarOutput: 8.4,
      pressure: 1002.1,
    },
    thresholds: {
      deployNet: 28,
      alertWarning: 20,
      alertCritical: 38,
    },
  },
  {
    id: 'farm-005',
    name: 'Sahyadri Hills Farm',
    location: 'Kolhapur, Maharashtra',
    coordinates: { lat: 16.7050, lng: 74.2433 },
    area: 38,
    variety: 'Grand Naine',
    owner: 'Anil Jadhav',
    netStatus: 'retracted',
    riskLevel: 'safe',
    lastUpdated: new Date(Date.now() - 60000).toISOString(),
    sensors: {
      windSpeed: 8.2,
      windDirection: 'E',
      windGust: 11.5,
      temperature: 33.2,
      humidity: 55,
      rainfall: 0,
      soilMoisture: 35,
      batteryLevel: 97,
      solarOutput: 52.8,
      pressure: 1015.4,
    },
    thresholds: {
      deployNet: 35,
      alertWarning: 25,
      alertCritical: 45,
    },
  },
  {
    id: 'farm-006',
    name: 'Tungabhadra Farms',
    location: 'Bellary, Karnataka',
    coordinates: { lat: 15.1394, lng: 76.9214 },
    area: 62,
    variety: 'Yelakki',
    owner: 'Manjunath Gowda',
    netStatus: 'retracted',
    riskLevel: 'moderate',
    lastUpdated: new Date(Date.now() - 22000).toISOString(),
    sensors: {
      windSpeed: 22.8,
      windDirection: 'NW',
      windGust: 29.4,
      temperature: 30.7,
      humidity: 63,
      rainfall: 0.3,
      soilMoisture: 47,
      batteryLevel: 85,
      solarOutput: 41.3,
      pressure: 1011.6,
    },
    thresholds: {
      deployNet: 30,
      alertWarning: 22,
      alertCritical: 40,
    },
  },
];

export const recentEvents = [
  {
    id: 'evt-001',
    type: 'deployment',
    farmId: 'farm-002',
    farmName: 'Green Horizon Plantation',
    message: 'Windbreak nets auto-deployed — wind speed exceeded 35 km/h threshold',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    severity: 'warning',
  },
  {
    id: 'evt-002',
    type: 'alert',
    farmId: 'farm-004',
    farmName: 'Sakshi Agro Farm',
    message: 'SEVERE WIND ALERT — Wind gusts reaching 71 km/h. Immediate action required.',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    severity: 'critical',
  },
  {
    id: 'evt-003',
    type: 'deployment',
    farmId: 'farm-003',
    farmName: 'Nandini Banana Estate',
    message: 'Windbreak nets deploying — wind approaching threshold at 26 km/h',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    severity: 'info',
  },
  {
    id: 'evt-004',
    type: 'sensor',
    farmId: 'farm-004',
    farmName: 'Sakshi Agro Farm',
    message: 'Battery level below 65% — solar output reduced due to cloud cover',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    severity: 'warning',
  },
  {
    id: 'evt-005',
    type: 'alert',
    farmId: 'farm-002',
    farmName: 'Green Horizon Plantation',
    message: 'Heavy rainfall detected — 4.5mm/hr. Monitoring soil saturation.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    severity: 'info',
  },
  {
    id: 'evt-006',
    type: 'system',
    farmId: 'farm-005',
    farmName: 'Sahyadri Hills Farm',
    message: 'All sensors reporting normal. System health check passed.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: 'success',
  },
];

export const forecastData = {
  hourly: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    time: `${String(i).padStart(2, '0')}:00`,
    windSpeed: Math.round((15 + Math.sin(i / 4) * 20 + Math.random() * 10) * 10) / 10,
    windGust: Math.round((20 + Math.sin(i / 4) * 25 + Math.random() * 15) * 10) / 10,
    temperature: Math.round((26 + Math.sin((i - 6) / 4) * 6 + Math.random() * 2) * 10) / 10,
    humidity: Math.round(60 + Math.sin(i / 6) * 20 + Math.random() * 10),
    rainfall: i > 14 && i < 20 ? Math.round(Math.random() * 8 * 10) / 10 : 0,
    riskLevel: i > 12 && i < 18 ? 'high' : i > 10 && i < 20 ? 'moderate' : 'safe',
  })),
  daily: [
    { day: 'Mon', maxWind: 35, avgWind: 18, maxGust: 48, rainfall: 2.1, risk: 'moderate' },
    { day: 'Tue', maxWind: 52, avgWind: 28, maxGust: 68, rainfall: 8.4, risk: 'severe' },
    { day: 'Wed', maxWind: 41, avgWind: 24, maxGust: 55, rainfall: 5.2, risk: 'high' },
    { day: 'Thu', maxWind: 22, avgWind: 14, maxGust: 30, rainfall: 0.5, risk: 'safe' },
    { day: 'Fri', maxWind: 18, avgWind: 11, maxGust: 24, rainfall: 0, risk: 'safe' },
    { day: 'Sat', maxWind: 28, avgWind: 19, maxGust: 38, rainfall: 1.8, risk: 'moderate' },
    { day: 'Sun', maxWind: 33, avgWind: 21, maxGust: 44, rainfall: 3.1, risk: 'moderate' },
  ],
};

export const windTrendData = Array.from({ length: 48 }, (_, i) => ({
  time: new Date(Date.now() - (47 - i) * 1800000).toISOString(),
  label: `${new Date(Date.now() - (47 - i) * 1800000).getHours()}:${String(new Date(Date.now() - (47 - i) * 1800000).getMinutes()).padStart(2, '0')}`,
  windSpeed: Math.round((14 + Math.sin(i / 6) * 15 + Math.random() * 8) * 10) / 10,
  windGust: Math.round((20 + Math.sin(i / 6) * 20 + Math.random() * 12) * 10) / 10,
  threshold: 35,
}));

export const analyticsData = {
  totalDeployments: 147,
  deploymentsThisMonth: 23,
  avgResponseTime: 4.2, // seconds
  lossesPreventedEstimate: 2850000, // INR
  uptime: 99.7,
  activeFarms: 6,
  totalSensors: 48,
  alertsSent: 312,
};

export const aiPredictions = [
  {
    farmId: 'farm-002',
    farmName: 'Green Horizon Plantation',
    damageProbability: 0.72,
    predictedPeakWind: 58,
    peakTime: '16:30',
    recommendation: 'Keep nets deployed. Expected wind intensification in next 2 hours. Consider manual reinforcement of eastern perimeter.',
    confidence: 0.85,
  },
  {
    farmId: 'farm-004',
    farmName: 'Sakshi Agro Farm',
    damageProbability: 0.91,
    predictedPeakWind: 78,
    peakTime: '15:45',
    recommendation: 'CRITICAL: Cyclonic pattern detected. Activate emergency protocol. All nets deployed. Notify field workers immediately.',
    confidence: 0.92,
  },
  {
    farmId: 'farm-003',
    farmName: 'Nandini Banana Estate',
    damageProbability: 0.34,
    predictedPeakWind: 36,
    peakTime: '17:00',
    recommendation: 'Moderate risk window approaching. Net deployment in progress. Monitor eastern and southern sectors.',
    confidence: 0.78,
  },
];

export const getRiskColor = (level) => {
  switch (level) {
    case 'safe': return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' };
    case 'moderate': return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' };
    case 'high': return { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' };
    case 'severe': return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/20' };
    default: return { bg: 'bg-slate-500', text: 'text-slate-400', border: 'border-slate-500/30', glow: 'shadow-slate-500/20' };
  }
};

export const getNetStatusInfo = (status) => {
  switch (status) {
    case 'deployed': return { label: 'Deployed', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: '🛡️' };
    case 'retracted': return { label: 'Retracted', color: 'text-slate-400', bg: 'bg-slate-500/10', icon: '📂' };
    case 'deploying': return { label: 'Deploying...', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: '⚙️' };
    default: return { label: 'Unknown', color: 'text-slate-500', bg: 'bg-slate-500/10', icon: '❓' };
  }
};

export const formatTimeAgo = (isoString) => {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
