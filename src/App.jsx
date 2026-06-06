import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Forecasts from './pages/Forecasts';
import Events from './pages/Events';
import DamageReports from './pages/DamageReports';
import Analytics from './pages/Analytics';
import AIPredictions from './pages/AIPredictions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f172a] text-white p-10 font-mono">
          <h1 className="text-red-500 text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-4">{this.state.error && this.state.error.toString()}</p>
          <pre className="text-sm bg-slate-800 p-4 rounded-xl overflow-auto border border-slate-700 whitespace-pre-wrap">
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// App layout wrapper
function AppLayout() {
  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-200 selection:bg-cyan-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/forecasts" element={<Forecasts />} />
            <Route path="/events" element={<Events />} />
            <Route path="/damage-reports" element={<DamageReports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-predictions" element={<AIPredictions />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
