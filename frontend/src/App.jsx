import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WaterQualityCRUD from './pages/WaterQualityCRUD';
import UserManagement from './pages/UserManagement';

// Wrapper to apply Layout structure for dashboard views
const DashboardLayout = ({ children }) => {
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Admin & Petambak) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin', 'petambak']}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/water-quality"
            element={
              <PrivateRoute allowedRoles={['admin', 'petambak']}>
                <DashboardLayout>
                  <WaterQualityCRUD />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/users"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
