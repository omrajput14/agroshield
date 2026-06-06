import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Forecasts from './pages/Forecasts';
import Events from './pages/Events';
import DamageReports from './pages/DamageReports';
import Analytics from './pages/Analytics';
import AIPredictions from './pages/AIPredictions';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forecasts" element={<Forecasts />} />
              <Route path="/events" element={<Events />} />
              <Route path="/damage-reports" element={<DamageReports />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-predictions" element={<AIPredictions />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
