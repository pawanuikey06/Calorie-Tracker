import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from 'sonner';
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Onboarding from "./components/Onboarding";

// Check if user has completed onboarding
const hasCompletedOnboarding = () => {
  const userProfile = localStorage.getItem('userProfile');
  return !!userProfile;
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!hasCompletedOnboarding()) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already onboarded)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (hasCompletedOnboarding()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" expand={true} richColors />
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <PublicRoute>
              <Onboarding />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 