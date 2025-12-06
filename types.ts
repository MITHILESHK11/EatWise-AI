export type SafetyRating = 'safe' | 'caution' | 'avoid';
export type FoodType = 'packaged' | 'fresh';

export interface SmartFoodAnalysis {
  food_name: string;
  food_type: FoodType;
  expiry_status: {
    expiry_date: string;
    is_expired: string; // "yes" | "no" | "near"
    days_left: string;
    comment: string;
  };
  freshness: {
    status: "fresh" | "borderline" | "spoiled" | "unsafe";
    reason: string;
  };
  nutrition: {
    summary_simple: string;
    highlights: {
      sugar: string;
      salt: string;
      oil: string;
      additives: string;
    };
    suitable_for: {
      kids: string;
      elders: string;
      diabetics: string;
      pregnant_women: string;
    };
  };
  allergens: string[];
  health_risks: string[];
  calories_estimation: string;
  fitness_tip: string;
  dietary_tags: string[];
  
  safety_rating: SafetyRating;
  cheaper_alternatives: string[];
  recipes: Array<{
    name: string;
    steps: string;
  }>;
  storage_tips: string;
  shareable_summary: string;
  ui_badges: {
    safety_color: "green" | "yellow" | "red";
    expiry_color: string;
    freshness_color: string;
  };
}

export interface HistoryItem extends SmartFoodAnalysis {
  id: string;
  timestamp: number;
  thumbnail?: string;
}

// --- New Features Types ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface UserHealthProfile {
  name: string;
  age: string;
  weight: string;
  height: string;
  gender: 'Male' | 'Female' | 'Other';
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active';
  goal: 'Lose Weight' | 'Gain Muscle' | 'Maintain' | 'Healthy Eating';
  dietary_pref: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Keto' | 'Any';
  allergies: string;
  medical_conditions?: string;
}

export interface DietPlan {
  title: string;
  overview: string;
  calories_target: string;
  daily_plans: {
    day_label: string; // "Day 1", "Day 2", etc.
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  }[];
  shopping_list: string[];
}

export interface DailyStats {
  date: string;
  water_glasses: number;
  calories_consumed: number;
  calories_burned: number;
  mood: 'Happy' | 'Tired' | 'Energetic' | 'Neutral';
}

export type AppView = 'landing' | 'scan' | 'result' | 'history' | 'settings' | 'chat' | 'diet' | 'health' | 'login' | 'profile';

export type AppTheme = 'light' | 'dark' | 'green' | 'orange';