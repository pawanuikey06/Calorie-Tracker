import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'sonner';
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Onboarding from "./components/Onboarding";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" expand={true} richColors />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 