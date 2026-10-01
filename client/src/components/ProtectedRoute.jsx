import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
