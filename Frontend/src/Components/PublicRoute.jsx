import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (user) return <Navigate to="/" replace />;

    return children;
};
