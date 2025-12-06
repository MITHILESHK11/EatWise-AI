import React from 'react';
import { Scan, Apple, ShieldCheck, DollarSign, BookOpen, Clock, MessageCircle, ChefHat, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { AppTheme, User } from '../types';

interface LandingPageProps {
  user: User;
  onStartScan: () => void;
  onViewHistory: () => void;
  onOpenChat: () => void;
  onOpenDiet: () => void;
  onOpenHealth: () => void;
  theme: AppTheme;
}

const LandingPage: React.FC<LandingPageProps> = ({ user, onStartScan, onViewHistory, onOpenChat, onOpenDiet, onOpenHealth, theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      
      {/* Hero Section */}
      <section className="text-center py-12 px-4 w-full max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
          <Sparkles className="w-3 h-3" /> Welcome Back, {user.name.split(' ')[0]}
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Eat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Smart.</span><br/>
          Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Healthy.</span>
        </h1>
        
        <p className={`text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed opacity-80 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
          Scan food for safety, get personalized diet plans, and track your health instantly with AI.
        </p>
        
        <div className="relative inline-block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
          <button 
            onClick={onStartScan}
            className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <Scan className="w-5 h-5" /> Start Scanning
          </button>
        </div>
      </section>

      {/* Main Feature Bento Grid */}
      <section className="w-full max-w-4xl mx-auto px-4 mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-center font-bold text-sm uppercase tracking-widest opacity-50 mb-8">Everything you need</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* AI Coach - Large Card */}
          <div onClick={onOpenChat} className={`col-span-2 row-span-2 p-6 rounded-3xl border transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-64 shadow-sm group ${
             isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500/50' : 'bg-white border-slate-100 hover:border-blue-200'
          }`}>
             <div className="flex justify-between items-start">
               <div className={`p-3 rounded-2xl ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                 <MessageCircle className="w-8 h-8" />
               </div>
               <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
             </div>
             <div>
               <h3 className="text-2xl font-bold mb-1">AI Coach</h3>
               <p className="opacity-60 text-sm">Chat about recipes, nutrition & safety.</p>
             </div>
          </div>

          {/* Diet Plan */}
          <div onClick={onOpenDiet} className={`col-span-2 md:col-span-1 p-5 rounded-3xl border transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-32 md:h-auto shadow-sm group ${
             isDark ? 'bg-slate-800 border-slate-700 hover:border-emerald-500/50' : 'bg-white border-slate-100 hover:border-emerald-200'
          }`}>
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
               <ChefHat className="w-5 h-5" />
             </div>
             <span className="font-bold">Meal Plans</span>
          </div>

          {/* Health Tracker */}
          <div onClick={onOpenHealth} className={`col-span-2 md:col-span-1 p-5 rounded-3xl border transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-32 md:h-auto shadow-sm group ${
             isDark ? 'bg-slate-800 border-slate-700 hover:border-orange-500/50' : 'bg-white border-slate-100 hover:border-orange-200'
          }`}>
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
               <Activity className="w-5 h-5" />
             </div>
             <span className="font-bold">Tracker</span>
          </div>
          
          {/* History Strip */}
          <div onClick={onViewHistory} className={`col-span-2 p-5 rounded-3xl border transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-between shadow-sm group ${
             isDark ? 'bg-slate-800 border-slate-700 hover:border-purple-500/50' : 'bg-white border-slate-100 hover:border-purple-200'
          }`}>
             <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-bold">Scan History</h4>
                   <p className="text-xs opacity-60">View past reports</p>
                </div>
             </div>
             <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>

        </div>
      </section>

      {/* Feature Strip */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <FeatureItem icon={<ShieldCheck />} label="Safety First" />
        <FeatureItem icon={<Apple />} label="Nutrition" />
        <FeatureItem icon={<DollarSign />} label="Affordable" />
        <FeatureItem icon={<BookOpen />} label="Recipes" />
      </div>

    </div>
  );
};

const FeatureItem = ({ icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center gap-2">
    {React.cloneElement(icon, { className: "w-4 h-4" })}
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

export default LandingPage;
