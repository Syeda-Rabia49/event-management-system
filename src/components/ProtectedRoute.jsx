import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Only logged-in users can see these pages
export default function ProtectedRoute({ children }) {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

// Login/Register are hidden once logged in; send user back where they came from
export function GuestRoute({ children }) {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/events';
  return user ? <Navigate to={from} replace /> : children;
}