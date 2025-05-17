import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="text-6xl">🍽️</div>
          <h1 className="text-4xl font-bold tracking-tight">Calorie Tracker</h1>
          <p className="text-lg text-muted-foreground">
            Track your meals using AI and hit your daily goals
          </p>
        </div>
        
        <div className="space-y-4 pt-8">
          <button 
            onClick={() => navigate('/onboarding')}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 