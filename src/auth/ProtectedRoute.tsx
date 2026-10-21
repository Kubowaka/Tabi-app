import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};