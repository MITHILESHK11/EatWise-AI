import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertCircle, Leaf, Settings, ArrowLeft, Home, MessageCircle, ChefHat, Activity, Sparkles, User as UserIcon } from 'lucide-react';
import { SmartFoodAnalysis, HistoryItem, AppView, AppTheme, User } from './types';
import { analyzeFoodImage } from './services/geminiService';
import { getSession, logout } from './services/authService';
import AnalysisResult from './components/AnalysisResult';
import Loading from './components/Loading';
import LandingPage from './components/LandingPage';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import ChatBot from './components/ChatBot';
import DietPlanner from './components/DietPlanner';
import HealthTracker from './components/HealthTracker';
import LoginView from './components/LoginView';
import ProfileView from './components/ProfileView';

const App: React.FC = () => {
  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);
  
  // --- App State ---
  const [view, setView] = useState<AppView>('landing');
  const [theme, setTheme] = useState<AppTheme>('light');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SmartFoodAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize
  useEffect(() => {
    // 1. Check Session
    const session = getSession();
    if (session) {
      setUser(session);
    } else {
      setView('login');
    }

    // 2. Load Theme
    const savedTheme = localStorage.getItem('eatwise_theme') as AppTheme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Load History when user changes
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`eatwise_history_${user.id}`);
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Failed to parse history", e);
        }
      } else {
        setHistory([]);
      }
    }
  }, [user]);

  // Theme Effect
  useEffect(() => {
    localStorage.setItem('eatwise_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('landing');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setView('login');
    setHistory([]);
  };

  // Save History Helper (User Isolated)
  const saveToHistory = (data: SmartFoodAnalysis, imageBase64: string) => {
    if (!user) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const scale = 100 / img.width;
      canvas.width = 100;
      canvas.height = img.height * scale;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.5);

      const newItem: HistoryItem = {
        ...data,
        id: Date.now().toString(),
        timestamp: Date.now(),
        thumbnail: thumbnail
      };

      const updatedHistory = [newItem, ...history].slice(0, 20); // Keep max 20
      setHistory(updatedHistory);
      localStorage.setItem(`eatwise_history_${user.id}`, JSON.stringify(updatedHistory));
    };
    img.src = imageBase64;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        setError(null);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const base64Data = selectedImage.split(',')[1];
      const result = await analyzeFoodImage(base64Data);
      setAnalysis(result);
      setView('result');
      saveToHistory(result, selectedImage);
    } catch (err) {
      console.error(err);
      setError("We couldn't analyze that image. Please ensure it's a clear photo of food and try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setError(null);
    setView('scan');
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setAnalysis(item);
    setSelectedImage(item.thumbnail || null);
    setView('result');
  };

  const handleClearHistory = () => {
    if (user && confirm("Clear all scan history?")) {
      setHistory([]);
      localStorage.removeItem(`eatwise_history_${user.id}`);
    }
  };

  // Ambient Background Component
  const AmbientBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-300'}`}></div>
      <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-300'}`}></div>
      <div className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 ${theme === 'dark' ? 'bg-emerald-900' : 'bg-emerald-300'}`}></div>
    </div>
  );

  const getBgClass = () => {
    if (theme === 'dark') return 'bg-slate-950 text-slate-100';
    return 'bg-slate-50 text-slate-900';
  };

  const NavButton = ({ active, icon, label, target }: any) => (
    <button 
      onClick={() => setView(target)}
      className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
        active 
          ? (theme === 'dark' ? 'bg-white/10 text-white scale-110 shadow-lg shadow-white/5' : 'bg-black/5 text-black scale-110 shadow-lg shadow-black/5') 
          : (theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
      }`}
    >
      {React.cloneElement(icon, { className: `w-6 h-6 ${active ? 'stroke-[2.5px]' : 'stroke-[2px]'}` })}
      {active && (
        <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-current"></span>
      )}
    </button>
  );

  // --- RENDER LOGIN VIEW ---
  if (!user) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // --- RENDER APP ---
  return (
    <div className={`relative min-h-screen transition-colors duration-500 ${getBgClass()} font-sans selection:bg-blue-500/30`}>
      
      <AmbientBackground />

      {/* Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${view === 'landing' ? 'bg-transparent py-6' : 'glass border-b border-white/10 py-4'}`}>
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('landing')}>
            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-105 overflow-hidden ${theme === 'green' ? 'bg-emerald-500' : theme === 'orange' ? 'bg-orange-500' : 'bg-blue-600'}`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
              <Leaf className="w-5 h-5 relative z-10" />
            </div>
            {view !== 'landing' && (
              <span className={`font-bold text-lg tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>EatWise</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setView('profile')}
                className="flex items-center gap-2 pr-3 pl-1 py-1 bg-black/5 dark:bg-white/10 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-all"
             >
               <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/20" alt="Profile" />
               <span className="text-xs font-bold hidden sm:block">{user.name.split(' ')[0]}</span>
             </button>
             <button 
              onClick={() => setView('settings')} 
              className={`p-2.5 rounded-full transition-all ${
                theme === 'dark' 
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300' 
                  : 'bg-black/5 hover:bg-black/10 text-slate-600'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 pt-24 pb-32 min-h-screen">
        
        {/* VIEW: Landing */}
        {view === 'landing' && (
          <LandingPage 
            user={user}
            onStartScan={() => setView('scan')} 
            onViewHistory={() => setView('history')}
            onOpenChat={() => setView('chat')}
            onOpenDiet={() => setView('diet')}
            onOpenHealth={() => setView('health')}
            theme={theme}
          />
        )}

        {/* VIEW: Profile */}
        {view === 'profile' && (
          <ProfileView 
            user={user}
            theme={theme}
            onBack={() => setView('landing')}
            onLogout={handleLogout}
          />
        )}

        {/* VIEW: Scan */}
        {view === 'scan' && (
          <div className="animate-fade-in-up">
             <div className="flex items-center gap-4 mb-8">
               <button onClick={() => setView('landing')} className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                 <ArrowLeft className="w-6 h-6" />
               </button>
               <h2 className="text-3xl font-bold tracking-tight">Scan Food</h2>
             </div>

             <div className={`relative overflow-hidden rounded-3xl transition-all duration-300 shadow-2xl ${
               theme === 'dark' ? 'bg-slate-800 ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'
             }`}>
                {selectedImage ? (
                  <div className="space-y-6 p-6">
                    <div className="relative aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden shadow-inner group">
                      <img 
                        src={selectedImage} 
                        alt="Selected food" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 transition-all hover:scale-110"
                      >
                        <Upload className="w-5 h-5 rotate-45" />
                      </button>
                    </div>
                    
                    {loading ? (
                      <Loading />
                    ) : (
                      <button
                        onClick={handleAnalyze}
                        className={`w-full py-4 px-6 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                         <Sparkles className="w-5 h-5" /> Analyze Food
                      </button>
                    )}
                  </div>
                ) : (
                  <div 
                    onClick={triggerFileInput}
                    className="p-16 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-black/5 transition-colors"
                  >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                      theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Camera className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Take a photo</h3>
                    <p className={`text-base max-w-xs mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Upload a clear image of food or packaging to detect safety & nutrition.
                    </p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
             </div>
             
             {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-600 animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW: Result */}
        {view === 'result' && analysis && (
          <AnalysisResult 
            data={analysis} 
            onReset={handleReset} 
            theme={theme}
            imageUrl={selectedImage}
          />
        )}

        {/* VIEW: History */}
        {view === 'history' && (
          <HistoryView 
            history={history}
            onSelect={handleHistorySelect}
            onClear={handleClearHistory}
            onBack={() => setView('landing')}
            theme={theme}
          />
        )}

        {/* VIEW: Chat */}
        {view === 'chat' && (
          <ChatBot theme={theme} onBack={() => setView('landing')} />
        )}

        {/* VIEW: Diet Planner */}
        {view === 'diet' && (
          <DietPlanner theme={theme} userId={user.id} onBack={() => setView('landing')} />
        )}

        {/* VIEW: Health Tracker */}
        {view === 'health' && (
          <HealthTracker theme={theme} userId={user.id} onBack={() => setView('landing')} />
        )}

        {/* VIEW: Settings */}
        {view === 'settings' && (
          <SettingsView 
            currentTheme={theme} 
            onThemeChange={setTheme}
            onBack={() => setView('landing')}
          />
        )}

      </main>

      {/* Floating Bottom Navigation Island */}
      {view !== 'scan' && view !== 'result' && view !== 'profile' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
          <div className={`flex justify-around items-center p-2 rounded-3xl shadow-2xl backdrop-blur-xl border ${
            theme === 'dark' 
              ? 'bg-slate-900/80 border-slate-700/50 shadow-black/50' 
              : 'bg-white/80 border-white/50 shadow-slate-200/50'
          }`}>
            <NavButton active={view === 'landing'} icon={<Home />} label="Home" target="landing" />
            <NavButton active={view === 'chat'} icon={<MessageCircle />} label="Coach" target="chat" />
            <div className="w-px h-8 bg-current opacity-10"></div>
            <NavButton active={view === 'diet'} icon={<ChefHat />} label="Plans" target="diet" />
            <NavButton active={view === 'health'} icon={<Activity />} label="Health" target="health" />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;