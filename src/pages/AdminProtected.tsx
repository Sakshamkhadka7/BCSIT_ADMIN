import { useContext, type ReactNode } from "react";
import { AdminContext } from "../context/AdminProvider";
import { Navigate } from "react-router-dom";

interface AdminProtectedProps {
  children: ReactNode;
}

const AdminProtected = ({ children }: AdminProtectedProps) => {
  const context = useContext(AdminContext);

  if (!context) {
    return null;
  }

  const { admin, loading, error } = context;

  if (loading) {
    return <h2>Loading......</h2>;
  }

  if (error) {
    return <h2>Something went wrong</h2>;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtected;
