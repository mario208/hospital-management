import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requireAdmin, requirePatient }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/patient" replace />;
  }

  if (requirePatient && user.isAdmin) {
    return <Navigate to="/doctor" replace />;
  }

  return children;
};

export default ProtectedRoute;
