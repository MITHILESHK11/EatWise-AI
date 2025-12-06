import React, { useState, useEffect } from 'react';
import { DietPlan, UserHealthProfile, AppTheme } from '../types';
import { getDietPlan } from '../services/geminiService';
import { Loader2, ArrowLeft, Check, ChefHat, ShoppingCart, Calendar, Activity } from 'lucide-react';

interface DietPlannerProps {
  theme: AppTheme;
  userId: string;
  onBack: () => void;
}

const DietPlanner: React.FC<DietPlannerProps> = ({ theme, userId, onBack }) => {
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<DietPlan | null>(null);
  
  const [profile, setProfile] = useState<UserHealthProfile>({
    name: 'User',
    age: '',
    weight: '',
    height: '',
    gender: 'Other',
    activityLevel: 'Moderate',
    goal: 'Healthy Eating',
    dietary_pref: 'Any',
    allergies: ''
  });

  // Load user profile & saved plan
  useEffect(() => {
    const savedProfile = localStorage.getItem(`eatwise_profile_${userId}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    const savedPlan = localStorage.getItem(`eatwise_diet_plan_${userId}`);
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    } else {
      setPlan(null); // Reset if no plan for this user
    }
  }, [userId]);

  const handleChange = (field: keyof UserHealthProfile, value: string) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    // Auto-save basic stats to profile immediately for convenience
    localStorage.setItem(`eatwise_profile_${userId}`, JSON.stringify(updated));
  };

  const generatePlan = async () => {
    if (!profile.age || !profile.weight || !profile.height) {
      alert("Please fill in basic stats");
      return;
    }
    setLoading(true);
    try {
      const result = await getDietPlan(profile);
      setPlan(result);
      localStorage.setItem(`eatwise_diet_plan_${userId}`, JSON.stringify(result));
    } catch (e) {
      alert("Failed to generate plan. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, field, type = "text", placeholder }: { label: string, field: keyof UserHealthProfile, type?: string, placeholder?: string }) => (
    <div className="group">
      <label className="block text-xs font-bold uppercase mb-1.5 opacity-60 tracking-wider">{label}</label>
      <input
        type={type}
        value={profile[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full p-3.5 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-slate-800 border-slate-700 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-500'}`}
      />
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold">Diet Planner</h2>
      </div>

      {!plan ? (
        <div className={`p-8 rounded-3xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-bold text-lg">Create Your Plan</h3>
               <p className="text-sm opacity-60">AI tailored meals for your goals</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <InputField label="Age" field="age" type="number" placeholder="25" />
            <InputField label="Weight (kg)" field="weight" type="number" placeholder="70" />
            <InputField label="Height (cm)" field="height" type="number" placeholder="175" />
            <div className="group">
              <label className="block text-xs font-bold uppercase mb-1.5 opacity-60 tracking-wider">Goal</label>
              <div className="relative">
                <select 
                  value={profile.goal}
                  onChange={(e) => handleChange('goal', e.target.value as any)}
                  className={`w-full p-3.5 rounded-2xl border outline-none appearance-none transition-all focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <option>Lose Weight</option>
                  <option>Gain Muscle</option>
                  <option>Maintain</option>
                  <option>Healthy Eating</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">▼</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase mb-3 opacity-60 tracking-wider">Dietary Preference</label>
            <div className="flex flex-wrap gap-2">
              {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Keto', 'Any'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleChange('dietary_pref', opt as any)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    profile.dietary_pref === opt 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105' 
                      : (isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <InputField label="Allergies (Optional)" field="allergies" placeholder="Peanuts, Shellfish..." />
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-transform active:scale-95 hover:brightness-110"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ChefHat className="w-5 h-5" />}
            {loading ? 'Crafting Plan...' : 'Generate My Plan'}
          </button>
        </div>
      ) : (
        <div className="animate-fade-in-up space-y-6">
          <div className={`p-6 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-slate-800 border-emerald-500/20' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100'}`}>
             <div className="relative z-10">
               <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-emerald-900'}`}>{plan.title}</h3>
               <p className={`text-sm mb-4 leading-relaxed opacity-80 ${isDark ? 'text-slate-300' : 'text-emerald-800'}`}>{plan.overview}</p>
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-lg shadow-emerald-500/30">
                 <Activity className="w-4 h-4" /> {plan.calories_target}
               </div>
             </div>
             {/* Decor */}
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
          </div>

          <div className="space-y-4">
            {plan.daily_plans.map((day, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border transition-all hover:scale-[1.01] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-4">
                   <Calendar className="w-5 h-5 text-emerald-500" />
                   <h4 className="font-bold text-lg">{day.day_label}</h4>
                </div>
                <div className="space-y-4 relative pl-4 border-l-2 border-emerald-500/20">
                   <MealRow label="Breakfast" text={day.breakfast} />
                   <MealRow label="Lunch" text={day.lunch} />
                   <MealRow label="Dinner" text={day.dinner} />
                   <MealRow label="Snack" text={day.snacks} />
                </div>
              </div>
            ))}
          </div>

          <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-orange-50/50 border-orange-100'}`}>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                 <ShoppingCart className="w-5 h-5" />
               </div>
               <h3 className="font-bold text-lg">Shopping List</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {plan.shopping_list.map((item, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm p-3 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setPlan(null)}
            className={`w-full py-4 rounded-2xl font-bold border transition-colors ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            Create New Plan
          </button>
        </div>
      )}
    </div>
  );
};

const MealRow = ({ label, text }: { label: string, text: string }) => (
  <div>
    <span className="text-xs font-bold uppercase tracking-wide opacity-50 block mb-1">{label}</span>
    <span className="text-sm font-medium leading-relaxed">{text}</span>
  </div>
);

export default DietPlanner;
