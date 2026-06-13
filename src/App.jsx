import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Map from './components/driver/Map';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DriverProfile from './pages/driver/DriverProfile';
import DriverDashboard from './pages/driver/Dashboard';
import FindParking from './pages/driver/FindParking';
import LotDetail from './pages/driver/LotDetail';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import SlotManagement from './pages/manager/SlotManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import BookingManagement from './pages/admin/BookingManagement';
import Analytics from './pages/admin/Analytics';
import LotManagement from './pages/admin/LotManagement';


/* Redirects to dashboard if already logged in */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, getDashboardPath, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Already authenticated - redirect to appropriate dashboard
  if (isAuthenticated) {
    return <Navigate to={getDashboardPath()} replace />;
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

          <Route
            path="/driver/profile"
            element={
              <ProtectedRoute>
                <DriverProfile />
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
              <ProtectedRoute managerOnly>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/slot-management"
            element={
              <ProtectedRoute managerOnly>
                <SlotManagement />
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

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
          path="/admin/lots"
          element={
            <ProtectedRoute adminOnly>
              <LotManagement />
            </ProtectedRoute>
          }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly>
                <BookingManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute adminOnly>
                <Analytics />
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