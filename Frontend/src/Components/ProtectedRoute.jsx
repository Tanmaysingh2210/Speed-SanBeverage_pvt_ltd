import { useAuth } from "../context/AuthContext";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to='/signin' replace />;

    // When used as a parent route element, render nested routes via Outlet
    return <Outlet />;
}