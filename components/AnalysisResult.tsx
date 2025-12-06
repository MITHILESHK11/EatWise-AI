import React from 'react';
import { SmartFoodAnalysis, AppTheme } from '../types';
import { 
  CheckCircle, AlertTriangle, XCircle, Leaf, DollarSign, Utensils, 
  Share2, ThermometerSnowflake, ChevronRight, Activity, AlertOctagon, Flame
} from 'lucide-react';

interface AnalysisResultProps {
  data: SmartFoodAnalysis;
  onReset: () => void;
  theme: AppTheme;
  imageUrl?: string | null;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset, theme, imageUrl }) => {
  const isDark = theme === 'dark';

  const getSafetyConfig = (rating: string) => {
    switch (rating) {
      case 'safe': return { 
        bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', 
        icon: <CheckCircle className="w-8 h-8 text-emerald-500" />, label: 'Safe to Eat' 
      };
      case 'caution': return { 
        bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', 
        icon: <AlertTriangle className="w-8 h-8 text-amber-500" />, label: 'Eat with Caution' 
      };
      case 'avoid': return { 
        bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20', 
        icon: <XCircle className="w-8 h-8 text-red-500" />, label: 'Not Safe' 
      };
      default: return { 
        bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', 
        icon: <AlertTriangle className="w-8 h-8" />, label: 'Unknown' 
      };
    }
  };

  const safety = getSafetyConfig(data.safety_rating);

  const handleShare = async () => {
    const text = `EatWise AI Report: ${data.food_name}\nSafety: ${safety.label}\nSummary: ${data.shareable_summary}`;
    if (navigator.share) {
      await navigator.share({ title: 'EatWise Analysis', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    }
  };

  const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`rounded-3xl border backdrop-blur-xl overflow-hidden ${isDark ? 'bg-slate-800/60 border-white/5' : 'bg-white/70 border-white/60 shadow-lg shadow-slate-200/40'} ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 pb-20 animate-fade-in-up">
      
      {/* Food Header Image with Overlay */}
      {imageUrl && (
        <div className="relative h-64 w-full rounded-3xl overflow-hidden shadow-2xl group">
          <img src={imageUrl} alt={data.food_name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
             <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {data.food_type}
                </span>
                {data.dietary_tags && data.dietary_tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {tag}
                  </span>
                ))}
             </div>
             <h1 className="text-3xl font-bold leading-tight shadow-sm">{data.food_name}</h1>
          </div>
        </div>
      )}

      {/* Safety & Status Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Main Safety Card */}
        <Card className={`col-span-2 p-6 flex items-center justify-between border-2 ${safety.bg} ${safety.border}`}>
           <div>
             <h2 className={`text-2xl font-black mb-1 ${safety.text}`}>{safety.label}</h2>
             <p className={`text-sm font-medium opacity-80 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{data.shareable_summary}</p>
           </div>
           <div className="shrink-0 animate-pulse-slow">
             {safety.icon}
           </div>
        </Card>

        {/* Expiry */}
        <Card className="p-5 flex flex-col justify-between h-32">
          <h3 className="text-xs font-bold uppercase tracking-wide opacity-50">Expiry Status</h3>
          <div>
            <div className={`text-2xl font-black mb-1 ${data.expiry_status.is_expired === 'yes' ? 'text-red-500' : 'text-emerald-500'}`}>
              {data.expiry_status.days_left}
            </div>
            <p className="text-xs opacity-60">{data.expiry_status.expiry_date}</p>
          </div>
        </Card>

        {/* Freshness */}
        <Card className="p-5 flex flex-col justify-between h-32">
           <h3 className="text-xs font-bold uppercase tracking-wide opacity-50">Freshness</h3>
           <div>
             <div className={`text-xl font-bold capitalize mb-1 ${data.freshness.status === 'fresh' ? 'text-emerald-500' : 'text-amber-500'}`}>
               {data.freshness.status}
             </div>
             <p className="text-xs opacity-60 line-clamp-2">{data.freshness.reason}</p>
           </div>
        </Card>
      </div>

      {/* Allergens Alert */}
      {(data.allergens?.length > 0 || data.health_risks?.length > 0) && (
        <Card className="p-5 border-l-4 border-l-orange-500 bg-orange-500/5">
           <div className="flex items-center gap-2 mb-3">
             <AlertOctagon className="w-5 h-5 text-orange-500" />
             <h3 className="font-bold">Health Alerts</h3>
           </div>
           <div className="flex flex-wrap gap-2">
             {data.allergens.map((item, idx) => (
               <span key={idx} className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-lg text-xs font-bold border border-orange-500/20">
                 {item}
               </span>
             ))}
           </div>
           {data.health_risks?.length > 0 && (
             <ul className="mt-3 text-sm list-disc pl-4 opacity-70 space-y-1">
               {data.health_risks.map((risk, idx) => <li key={idx}>{risk}</li>)}
             </ul>
           )}
        </Card>
      )}

      {/* Nutrition Simplified */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Leaf className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold">Nutrition Breakdown</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
           <NutritionBar label="Sugar" value={data.nutrition.highlights.sugar} color="text-pink-500" bar="bg-pink-500" />
           <NutritionBar label="Salt" value={data.nutrition.highlights.salt} color="text-blue-500" bar="bg-blue-500" />
           <NutritionBar label="Fats/Oil" value={data.nutrition.highlights.oil} color="text-yellow-500" bar="bg-yellow-500" />
           <NutritionBar label="Additives" value={data.nutrition.highlights.additives} color="text-purple-500" bar="bg-purple-500" />
        </div>
        
        <p className="text-sm leading-relaxed opacity-70 mb-4 p-4 rounded-xl bg-black/5 dark:bg-white/5">
          {data.nutrition.summary_simple}
        </p>
      </Card>

      {/* Fitness & Calories */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
             <Activity className="w-5 h-5 text-blue-200" />
             <h3 className="font-bold text-blue-100">Fitness Check</h3>
          </div>
          <div className="flex items-baseline gap-2">
             <h2 className="text-3xl font-black">{data.calories_estimation}</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm font-medium opacity-80 flex items-start gap-3">
             <Flame className="w-5 h-5 text-orange-500 shrink-0" />
             {data.fitness_tip}
          </p>
        </div>
      </Card>

      {/* Alternatives */}
      <Card className="p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold">Smarter Choices</h3>
        </div>
        <div className="space-y-3 relative z-10">
           {data.cheaper_alternatives.map((alt, idx) => (
             <div key={idx} className={`p-3 rounded-xl flex items-center justify-between border transition-colors ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <span className="font-medium text-sm">{alt}</span>
                <ChevronRight className="w-4 h-4 opacity-40" />
             </div>
           ))}
        </div>
      </Card>

      {/* Recipes & Storage - 2 Col */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
           <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold">Recipes</h3>
            </div>
            <div className="space-y-4">
              {data.recipes.slice(0,2).map((recipe, idx) => (
                <div key={idx} className="text-sm">
                  <h4 className="font-bold text-purple-500 mb-1">{recipe.name}</h4>
                  <p className="opacity-70 line-clamp-3 text-xs">{recipe.steps}</p>
                </div>
              ))}
            </div>
        </Card>

        <Card className="p-5">
           <div className="flex items-center gap-2 mb-4">
              <ThermometerSnowflake className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold">Storage</h3>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">{data.storage_tips}</p>
        </Card>
      </div>

      {/* Floating Action Bar */}
      <div className="sticky bottom-6 z-20 flex gap-3 p-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl">
        <button onClick={onReset} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          Scan New
        </button>
        <button onClick={handleShare} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>

    </div>
  );
};

// Helper for nutrition bars
const NutritionBar = ({ label, value, color, bar }: any) => {
  // Simple heuristic to determine bar width based on text
  const isHigh = value.toLowerCase().includes('high');
  const isMed = value.toLowerCase().includes('moderate') || value.toLowerCase().includes('medium');
  const width = isHigh ? 'w-full' : isMed ? 'w-1/2' : 'w-1/4';

  return (
    <div>
      <div className="flex justify-between text-xs font-bold uppercase mb-1 opacity-60 tracking-wider">
        <span>{label}</span>
      </div>
      <div className={`text-sm font-bold mb-1 ${color}`}>{value}</div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${bar} ${width}`}></div>
      </div>
    </div>
  );
};

export default AnalysisResult;