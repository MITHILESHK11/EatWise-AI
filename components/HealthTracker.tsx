import React, { useState, useEffect } from 'react';
import { DailyStats, AppTheme } from '../types';
import { getHealthInsights } from '../services/geminiService';
import { Plus, Minus, Flame, Droplets, ArrowLeft, Activity, Sparkles, TrendingUp } from 'lucide-react';

interface HealthTrackerProps {
  theme: AppTheme;
  userId: string;
  onBack: () => void;
}

const HealthTracker: React.FC<HealthTrackerProps> = ({ theme, userId, onBack }) => {
  const isDark = theme === 'dark';
  
  const [stats, setStats] = useState<DailyStats>({
    date: new Date().toISOString().split('T')[0],
    water_glasses: 0,
    calories_consumed: 0,
    calories_burned: 0,
    mood: 'Neutral'
  });

  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Load from local storage with User ID isolation
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const key = `eatwise_stats_${userId}_${today}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setStats(JSON.parse(saved));
    } else {
      // Reset for new day/user
      setStats({
        date: today,
        water_glasses: 0,
        calories_consumed: 0,
        calories_burned: 0,
        mood: 'Neutral'
      });
    }
    setInsight(null);
  }, [userId]);

  // Save on change
  useEffect(() => {
    const key = `eatwise_stats_${userId}_${stats.date}`;
    localStorage.setItem(key, JSON.stringify(stats));
  }, [stats, userId]);

  const updateStat = (field: keyof DailyStats, value: any) => {
    setStats(prev => ({ ...prev, [field]: value }));
  };

  const getAIInsight = async () => {
    setLoadingInsight(true);
    try {
      const text = await getHealthInsights(stats);
      setInsight(text);
    } catch (e) {
      // ignore
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-bold">Health Dashboard</h2>
          <p className="text-sm opacity-60">Track your daily vitals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Water Tracker - Big Card */}
        <div className={`p-6 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden group ${isDark ? 'bg-blue-900/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
          <div className="absolute top-0 right-0 p-16 bg-blue-500/10 rounded-full blur-3xl -mr-8 -mt-8"></div>
          
          <div className="p-3 bg-blue-500 text-white rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="font-bold opacity-60 uppercase tracking-wider text-xs mb-2">Water Intake</h3>
          
          <div className="flex items-baseline gap-1 mb-6">
             <span className={`text-5xl font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{stats.water_glasses}</span>
             <span className="text-sm font-medium opacity-50">glasses</span>
          </div>
          
          <div className="flex items-center gap-4 w-full justify-center">
             <button onClick={() => updateStat('water_glasses', Math.max(0, stats.water_glasses - 1))} className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${isDark ? 'border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
               <Minus className="w-5 h-5" />
             </button>
             <button onClick={() => updateStat('water_glasses', stats.water_glasses + 1)} className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95 hover:bg-blue-600`}>
               <Plus className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Calories Tracker */}
        <div className={`p-6 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden ${isDark ? 'bg-orange-900/10 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>
          <div className="absolute bottom-0 left-0 p-16 bg-orange-500/10 rounded-full blur-3xl -ml-8 -mb-8"></div>
          
          <div className="p-3 bg-orange-500 text-white rounded-2xl mb-4 shadow-lg shadow-orange-500/30">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="font-bold opacity-60 uppercase tracking-wider text-xs mb-2">Calories In</h3>
          
          <div className="relative mb-6">
            <input 
              type="number" 
              value={stats.calories_consumed || ''} 
              onChange={(e) => updateStat('calories_consumed', parseInt(e.target.value) || 0)}
              placeholder="0"
              className={`w-32 text-center text-5xl font-black bg-transparent outline-none ${isDark ? 'text-orange-400 placeholder-white/10' : 'text-orange-600 placeholder-black/10'}`}
            />
             <span className="block text-sm font-medium opacity-50">kcal</span>
          </div>

          <div className="flex gap-2">
            {[100, 250, 500].map(amt => (
              <button 
                key={amt}
                onClick={() => updateStat('calories_consumed', (stats.calories_consumed || 0) + amt)}
                className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all active:scale-95 ${isDark ? 'border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-orange-200'}`}
              >
                +{amt}
              </button>
            ))}
          </div>
        </div>
        
        {/* Mood Tracker */}
        <div className={`col-span-1 md:col-span-2 p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
           <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
             <Activity className="w-5 h-5 text-purple-500" /> How do you feel today?
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {['Energetic', 'Happy', 'Neutral', 'Tired'].map((m) => {
               const isActive = stats.mood === m;
               return (
                 <button
                   key={m}
                   onClick={() => updateStat('mood', m)}
                   className={`py-4 rounded-2xl font-semibold transition-all duration-300 ${
                     isActive 
                       ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105' 
                       : (isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100')
                   }`}
                 >
                   {m}
                 </button>
               )
             })}
           </div>
        </div>

      </div>

      {/* AI Insight Button */}
      <div className="mt-8">
        {!insight ? (
          <button 
            onClick={getAIInsight}
            disabled={loadingInsight}
            className="w-full py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20"
          >
            {loadingInsight ? (
              <span className="animate-pulse flex items-center gap-2">Thinking...</span>
            ) : (
              <><Sparkles className="w-5 h-5" /> Analyze My Day</>
            )}
          </button>
        ) : (
          <div className="p-8 rounded-3xl relative overflow-hidden animate-fade-in-up bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl">
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                     <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-sm uppercase tracking-wider opacity-80">AI Health Insight</h4>
               </div>
               <p className="text-xl font-medium leading-relaxed mb-6">{insight}</p>
               <button 
                 onClick={() => setInsight(null)} 
                 className="px-6 py-2 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-opacity-90 transition"
               >
                 Close
               </button>
            </div>
            {/* Background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
          </div>
        )}
      </div>

    </div>
  );
};

export default HealthTracker;
