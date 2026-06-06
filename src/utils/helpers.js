import { Wind, Navigation, AlertTriangle, Shield, CheckCircle } from 'lucide-react';

export const getRiskColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'safe': return 'text-emerald-400';
    case 'moderate': return 'text-yellow-400';
    case 'high risk': 
    case 'high': return 'text-orange-400';
    case 'severe risk':
    case 'severe': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

export const getNetStatusInfo = (status) => {
  switch (status?.toLowerCase()) {
    case 'deployed':
      return { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Deployed' };
    case 'deploying':
      return { icon: Navigation, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Deploying...' };
    case 'retracted':
      return { icon: CheckCircle, color: 'text-slate-400', bg: 'bg-slate-400/10', label: 'Retracted' };
    default:
      return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Error' };
  }
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Use UTC time calculation since backend returns UTC
  const seconds = Math.floor((now.getTime() - date.getTime() + (now.getTimezoneOffset() * 60000)) / 1000);
  
  if (seconds < 60) return `${Math.max(0, seconds)}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
