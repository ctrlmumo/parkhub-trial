/* Sets up routing and provides the main app structure */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GoogleMap from './components/driver/GoogleMap';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DriverDashboard from './pages/driver/Dashboard';
import FindParking from './pages/driver/FindParking';
import LotDetail from './pages/driver/LotDetail';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import SlotManagement from './pages/manager/SlotManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import BookingManagement from './pages/admin/BookingManagement';
import Analytics from './pages/admin/Analytics';


/* Redirects to dashboard if already logged in */
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

          {/*Lot Detail*/}
          <Route
            path="/driver/lot/:lotId"
            element={
              <ProtectedRoute>
                <LotDetail />
              </ProtectedRoute>
            }
          />

          {/* Protected Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/slot-management"
            element={
              <ProtectedRoute>
                <SlotManagement />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PublicRoute adminOnly>
                <AdminDashboard />
              </PublicRoute>
            }
          />

          <Route
            path="/admin/user-management"
            element={
              <PublicRoute adminOnly>
                <UserManagement />
              </PublicRoute>
            }
          />

          <Route
            path="/admin/booking-management"
            element={
              <PublicRoute adminOnly>
                <BookingManagement />
              </PublicRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <PublicRoute adminOnly>
                <Analytics />
              </PublicRoute>
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