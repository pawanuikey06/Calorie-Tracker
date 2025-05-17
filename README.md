# Calorie Tracker App

A modern, React-based calorie tracking application with real-time food recognition and nutritional tracking capabilities, powered by advanced AI technology.

## AI Technology Stack

### Core AI Model
- **Model**: Claude 3.5 Sonnet by Anthropic
- **Type**: Large Language Model (LLM)
- **Capabilities**:
  - Natural language understanding and generation
  - Code analysis and generation
  - Context-aware responses
  - Real-time problem solving
  - Semantic code search
  - Intelligent error handling

### Integration Features
- **Development Environment**: Cursor IDE
- **Real-time Assistance**:
  - Intelligent code completion
  - Context-aware suggestions
  - Automated error detection
  - Code optimization recommendations
  - Documentation generation

### AI-Powered Features
1. **Smart Food Recognition**:
   - Real-time image analysis
   - Nutritional content extraction
   - Portion size estimation
   - Food category classification

2. **Intelligent Calorie Calculations**:
   - Dynamic BMR adjustments
   - Smart portion suggestions
   - Adaptive goal tracking
   - Personalized recommendations

3. **Automated Data Processing**:
   - Input validation
   - Data normalization
   - Error correction
   - Pattern recognition

4. **User Experience Enhancement**:
   - Context-aware notifications
   - Intelligent progress tracking
   - Adaptive interface suggestions
   - Personalized feedback

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

## Technical Implementation

### Tech Stack
- **Frontend Framework**: React 18+
- **Type System**: TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **Notifications**: Sonner
- **State Management**: React Hooks
- **Data Persistence**: LocalStorage API
- **Build Tool**: Vite/Create React App

### Architecture
- Component-based architecture
- Custom hooks for business logic
- Event-driven state management
- Responsive design patterns
- Progressive enhancement

### Performance Optimizations
- Memoized calculations
- Lazy loading components
- Optimized re-renders
- Efficient data structures
- Local storage caching

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

## Usage Guide

### Initial Setup
1. First-time users will be directed to the onboarding process
2. Complete your profile with personal details
3. System calculates personalized calorie goals

### Daily Usage
1. Start tracking your meals using:
   - Manual entry
   - Food image recognition
2. Monitor your progress through the dashboard
3. Use the "Reset Day" feature to start fresh
4. Use "Start Over" to completely reset your profile

### Data Management
The app uses local storage for data persistence:
- `userProfile`: Stores user information and preferences
- `calorie-tracker-entries`: Stores food entries and history

## Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Modern web browser

### Best Practices
- Follow TypeScript strict mode
- Maintain component modularity
- Write comprehensive documentation
- Follow React best practices
- Implement proper error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - Copyright (c) 2024 Pawan Kumar Uikey

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 