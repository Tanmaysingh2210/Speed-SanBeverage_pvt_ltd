import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return (
        <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.2rem"
        }}>
            Loading...
        </div>
    );

    if (user && (location.pathname === "/signin")) { return <Navigate to="/" replace />; }

    return children;
};
