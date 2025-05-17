# Calorie Tracker App

A modern, React-based calorie tracking application with real-time food recognition and nutritional tracking capabilities.

## Features

### 1. User Profile Management
- Personalized calorie goals based on:
  - Age, weight, height, and gender
  - Activity level (low, medium, high)
  - Weight goals (lose, maintain, gain)
- BMR calculation using the Mifflin-St Jeor Equation
- Automatic calorie adjustment based on weight goals:
  - Weight loss: 20% calorie deficit
  - Weight gain: 20% calorie surplus
  - Maintenance: Standard BMR calculation

### 2. Food Tracking
- Add foods with detailed nutritional information:
  - Calories
  - Protein
  - Carbohydrates
  - Fats
- Real-time food image recognition
- Smart portion suggestions
- Daily food entry history
- Timestamp tracking for each meal

### 3. Smart Calorie Management
- Real-time progress tracking
- Intelligent portion suggestions when:
  - Food exactly matches remaining calories
  - Food exceeds daily limit
  - Perfect portion calculations
- Macro-nutrient tracking with standard ratios:
  - Protein: 30% of daily calories
  - Carbohydrates: 50% of daily calories
  - Fats: 20% of daily calories

### 4. User Interface
- Modern, responsive design
- Interactive progress visualizations:
  - Circular calorie progress
  - Macro-nutrient progress bars
  - Daily goal tracking
- Toast notifications for user feedback
- Dark mode support

### 5. Data Management
- Local storage persistence
- Daily reset capability
- Complete data reset option
- Automatic data validation

## Tech Stack

- React 18+
- TypeScript
- TailwindCSS
- React Router v6
- Sonner (Toast notifications)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard component
│   │   ├── FoodImageUpload.tsx # Food image recognition component
│   │   ├── LandingPage.tsx    # Initial landing page
│   │   ├── Onboarding.tsx     # User profile setup
│   │   └── ui/                # Reusable UI components
│   ├── App.tsx                # Main application component
│   └── index.tsx              # Application entry point
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Usage

1. First-time users will be directed to the onboarding process
2. Complete your profile with personal details
3. Start tracking your meals using:
   - Manual entry
   - Food image recognition
4. Monitor your progress through the dashboard
5. Use the "Reset Day" feature to start fresh
6. Use "Start Over" to completely reset your profile

## Local Storage

The app uses local storage for data persistence:
- `userProfile`: Stores user information and preferences
- `calorie-tracker-entries`: Stores food entries and history

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes. 