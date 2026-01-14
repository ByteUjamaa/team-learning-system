// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthForm from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Announcements from "./pages/Announcement";

// NEW: Import ThemeProvider and Layout
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/layout/Layout";

const RequireAuth = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex justify-center p-20">
        {/* Use your original spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  if (!user) return <Navigate to="/auth" />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    // NEW: Wrap with ThemeProvider
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const { user } = useAuth();

  // NEW: Wrapper component for layout
  const AppLayout = ({ children }) => (
    <Layout>
      {children}
    </Layout>
  );

  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        
        {/* NEW: Wrapped routes with Layout */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AppLayout>
                <UserDashboard />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <AppLayout>
                <Profile />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/announcements"
          element={
            <RequireAuth>
              <AppLayout>
                <Announcements />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/profile/:id?"
          element={
            <RequireAuth>
              <AppLayout>
                <Profile />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? user.role === "admin"
                    ? "/admin"
                    : "/dashboard"
                  : "/auth"
              }
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;