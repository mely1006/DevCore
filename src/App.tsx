import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { Promotions } from './pages/Promotions';
import { PedagogicalSpaces } from './pages/PedagogicalSpaces';
import { Statistics } from './pages/Statistics';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Setting';
import { RoleProvider } from './context/RoleContext';
import { Toaster } from '@/components/ui/toaster';
import { initDB, seedDatabase } from './lib/db';

function App() {
  useEffect(() => {
    // Initialize database and seed with initial data
    const setupDatabase = async () => {
      try {
        await initDB();
        await seedDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <RoleProvider>
      <Router>
        <div className="min-h-screen bg-gradient-1">
          <AppLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/utilisateurs" element={<UserManagement />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/espaces-pedagogiques" element={<PedagogicalSpaces />} />
              <Route path="/statistiques" element={<Statistics />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/parametres" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppLayout>
          <Toaster />
        </div>
      </Router>
    </RoleProvider>
  );
}

export default App;
