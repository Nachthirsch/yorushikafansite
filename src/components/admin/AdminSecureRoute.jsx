import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginScreen from "./auth/LoginScreen";

export default function AdminSecureRoute({ children, requireAdmin = true }) {
  const { user, isAdmin, loading } = useAuth();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Jika user login tapi bukan admin, tampilkan pesan error
    if (!loading && user && requireAdmin && !isAdmin) {
      setShowError(true);
      setErrorMessage("Akun Anda tidak memiliki akses admin. Silahkan hubungi administrator.");
    } else {
      setShowError(false);
    }
  }, [loading, user, isAdmin, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage || "You don't have permission to access this area."}</p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => window.history.back()} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              Go Back
            </button>
            <button onClick={() => (window.location.href = "/")} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
