import React, { useState, useEffect } from 'react';
import FoodImageUpload from './FoodImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { useNavigate } from 'react-router-dom';

interface FoodEntry {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 'low' | 'medium' | 'high';
  goal: 'lose' | 'maintain' | 'gain';
}

const STORAGE_KEY = 'calorie-tracker-entries';

const calculateDailyCalories = (profile: UserProfile) => {
  // Mifflin-St Jeor Equation
  let bmr;
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }

  // Activity factor
  const activityFactors = {
    low: 1.2,
    medium: 1.55,
    high: 1.9
  };

  return Math.round(bmr * activityFactors[profile.activityLevel]);
};

// Add a helper function for formatting time
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load user profile
  useEffect(() => {
    const userProfileStr = localStorage.getItem('userProfile');
    if (!userProfileStr) {
      navigate('/onboarding');
      return;
    }

    try {
      const profile: UserProfile = JSON.parse(userProfileStr);
      setUserProfile(profile);
      const calculatedGoal = calculateDailyCalories(profile);
      
      // Adjust goal based on user's target
      let adjustedGoal = calculatedGoal;
      if (profile.goal === 'lose') {
        adjustedGoal = Math.round(calculatedGoal * 0.8); // 20% deficit
      } else if (profile.goal === 'gain') {
        adjustedGoal = Math.round(calculatedGoal * 1.2); // 20% surplus
      }
      
      setDailyGoal(adjustedGoal);
    } catch (error) {
      console.error('Error loading user profile:', error);
      navigate('/onboarding');
    }
  }, [navigate]);

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);
    if (savedEntries) {
      try {
        const entries = JSON.parse(savedEntries);
        console.log('Loaded entries from localStorage:', entries);
        
        // Validate entries
        const validEntries = entries.filter((entry: any) => {
          const isValid = 
            entry &&
            typeof entry.name === 'string' &&
            typeof entry.calories === 'number' &&
            typeof entry.protein === 'number' &&
            typeof entry.carbs === 'number' &&
            typeof entry.fat === 'number' &&
            typeof entry.timestamp === 'number';
          
          if (!isValid) {
            console.error('Invalid entry found:', entry);
          }
          return isValid;
        });

        if (validEntries.length !== entries.length) {
          console.warn(`Filtered out ${entries.length - validEntries.length} invalid entries`);
        }

        setFoodEntries(validEntries);
      } catch (error) {
        console.error('Error loading saved entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    console.log('Saving entries to localStorage:', foodEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foodEntries));
  }, [foodEntries]);

  // Get today's entries
  const todayEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const today = new Date();
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    );
  });

  // Calculate totals
  const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = todayEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = todayEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = todayEntries.reduce((sum, entry) => sum + entry.fat, 0);

  const remainingCalories = dailyGoal ? dailyGoal - totalCalories : 0;
  const calorieProgress = dailyGoal ? (totalCalories / dailyGoal) * 100 : 0;

  const handleFoodRecognized = (foodData: Omit<FoodEntry, 'timestamp'>) => {
    console.log('Received food data:', foodData);
    
    // Validate food data
    if (!foodData.name || typeof foodData.name !== 'string') {
      console.error('Invalid food data: missing or invalid name', foodData);
      return;
    }

    if (!foodData.calories || !foodData.protein || !foodData.carbs || !foodData.fat) {
      console.error('Invalid food data: missing nutritional values', foodData);
      return;
    }

    const newEntry: FoodEntry = {
      ...foodData,
      timestamp: Date.now(),
    };
    console.log('Created new entry:', newEntry);
    setFoodEntries(prev => [newEntry, ...prev]); // Add new entries at the start
  };

  const handleDeleteEntry = (timestamp: number) => {
    setFoodEntries(prev => prev.filter(entry => entry.timestamp !== timestamp));
  };

  if (!dailyGoal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">🍽️ Calorie Tracker</h1>
          <button
            onClick={() => navigate('/onboarding')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Update Profile
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Card */}
            {userProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg">
                          {userProfile.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{userProfile.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {userProfile.age} years • {userProfile.weight}kg • {userProfile.height}cm
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Activity Level</p>
                        <p className="font-medium capitalize">{userProfile.activityLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Goal</p>
                        <p className="font-medium capitalize">{userProfile.goal} weight</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Daily Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calorie Arc Display */}
                <div className="relative flex justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold flex items-center gap-2">
                          {totalCalories}
                          <span className="text-orange-500">🔥</span>
                        </p>
                        <p className="text-sm text-muted-foreground">of {dailyGoal} Kcal</p>
                      </div>
                    </div>
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        className="text-primary/10"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r="70"
                        cx="96"
                        cy="96"
                      />
                      <circle
                        className="text-primary"
                        strokeWidth="12"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * calorieProgress) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="70"
                        cx="96"
                        cy="96"
                      />
                    </svg>
                  </div>
                </div>

                {/* Macros Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-primary/5 p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Protein</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{totalProtein}</span>
                        <span className="text-sm text-muted-foreground">g</span>
                      </div>
                      <div className="h-1.5 bg-primary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(totalProtein / (dailyGoal * 0.3)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-primary/5 p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Carbs</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{totalCarbs}</span>
                        <span className="text-sm text-muted-foreground">g</span>
                      </div>
                      <div className="h-1.5 bg-primary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(totalCarbs / (dailyGoal * 0.5)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-primary/5 p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Fats</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{totalFat}</span>
                        <span className="text-sm text-muted-foreground">g</span>
                      </div>
                      <div className="h-1.5 bg-primary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(totalFat / (dailyGoal * 0.2)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                              </CardContent>
            </Card>

            {/* Recent Entries Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayEntries.map((entry) => (
                    <div
                      key={entry.timestamp}
                      className="group rounded-2xl bg-primary/5 p-4 transition-colors hover:bg-primary/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{entry.name}</p>
                            <span className="text-sm text-muted-foreground">
                              {formatTime(entry.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">{entry.calories} kcal</span>
                            <div className="flex gap-3">
                              <span title="Protein" className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                {entry.protein}g
                              </span>
                              <span title="Carbs" className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                {entry.carbs}g
                              </span>
                              <span title="Fat" className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                {entry.fat}g
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEntry(entry.timestamp)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-2 hover:bg-destructive/10 text-destructive"
                          title="Delete entry"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  {todayEntries.length === 0 && (
                    <div className="text-center py-8 rounded-2xl bg-primary/5">
                      <p className="text-muted-foreground">No entries yet today</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add your first meal using the food analyzer
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Image Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Add Food</CardTitle>
              </CardHeader>
              <CardContent>
                <FoodImageUpload onFoodRecognized={handleFoodRecognized} />
              </CardContent>
            </Card>

            {/* Remaining Calories Card */}
            <Card>
              <CardHeader>
                <CardTitle>Remaining Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-full blur-lg"></div>
                    <div className="relative bg-background rounded-full p-8">
                      <div className="space-y-1">
                        <p className="text-5xl font-bold text-primary">
                          {remainingCalories > 0 ? remainingCalories : 0}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                          calories remaining
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="space-y-1 bg-primary/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium">Daily Goal</p>
                      <p className="text-lg font-semibold">{dailyGoal}</p>
                    </div>
                    <div className="space-y-1 bg-primary/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium">Consumed</p>
                      <p className="text-lg font-semibold">{totalCalories}</p>
                    </div>
                    <div className="space-y-1 bg-primary/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium">Progress</p>
                      <p className="text-lg font-semibold">{Math.round(calorieProgress)}%</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500 ease-in-out rounded-full"
                        style={{ 
                          width: `${Math.min(calorieProgress, 100)}%`,
                          backgroundColor: remainingCalories < 0 ? 'var(--destructive)' : undefined
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 