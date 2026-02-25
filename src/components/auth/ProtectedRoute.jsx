import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, managerOnly = false }) => {
  const { isAuthenticated, isAdmin, isManager, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin only check
  if (adminOnly && !isAdmin) {
    console.warn('Unauthorized access attempt to admin page');
    return <Navigate to="/driver/dashboard" replace />;
  }

  // Manager only check
  if (managerOnly && !isManager && !isAdmin) {
    console.warn('Unauthorized access attempt to manager page');
    return <Navigate to="/driver/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;