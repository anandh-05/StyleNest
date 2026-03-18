import { Navigate, useLocation } from "react-router-dom";

import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <Loader label="Checking your session" fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

