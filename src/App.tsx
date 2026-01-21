import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { Formateurs } from './pages/Formateurs';
import { RoleProvider, useRole } from './context/RoleContext';
import { Toaster } from '@/components/ui/toaster';
import { initDB, seedDatabase } from './lib/db';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useRole();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  useEffect(() => {
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
        <div className="min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <RequireAuth>
                  <AppLayout>
                    <Navigate to="/dashboard" replace />
                  </AppLayout>
                </RequireAuth>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </RequireAuth>
              }
            />

            {/* Route Formateurs réintroduite pour afficher le bouton et les actions liées au module formateur */}
            <Route
              path="/formateurs"
              element={
                <RequireAuth>
                  <AppLayout>
                    <Formateurs />
                  </AppLayout>
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </RoleProvider>
  );
}

export default App;
