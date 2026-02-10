/* Sets up routing and provides the main app structure */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GoogleMap from './components/driver/GoogleMap';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Placeholder pages (to be built)
import DriverDashboard from './pages/driver/Dashboard';
import FindParking from './pages/driver/FindParking';

const AdminDashboard = () => <div className="p-xl"><h1>Admin Dashboard</h1><p>Coming soon...</p></div>;


/**
 * Public Route Component
 * Redirects to dashboard if already logged in
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Already authenticated - redirect to appropriate dashboard
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/driver/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Driver Routes */}
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />

          {/*Find Parking*/}
          <Route
            path="/driver/find-parking"
            element={
              <ProtectedRoute>
                <FindParking />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 - Redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;