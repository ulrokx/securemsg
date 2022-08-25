import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (!user && !loading) {
    return (
      <Navigate to="/login" replace state={{ from: location }} />
    );
  }
  return <Outlet />;
};

export default ProtectedRoute;
