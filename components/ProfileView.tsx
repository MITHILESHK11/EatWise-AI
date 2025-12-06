import React, { useState, useEffect } from 'react';
import { User, UserHealthProfile, AppTheme } from '../types';
import { ArrowLeft, Save, LogOut, Activity, AlertCircle } from 'lucide-react';

// --- Extracted Components ---

const InputGroup = ({ label, children, isDark }: { label: string, children: React.ReactNode, isDark: boolean }) => (
  <div className="mb-4">
    <label className={`block text-xs font-bold uppercase mb-2 tracking-wider opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
    {children}
  </div>
);

const Input = ({ isDark, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { isDark: boolean }) => (
  <input 
    {...props} 
    className={`w-full p-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} ${className}`}
  />
);

const Select = ({ isDark, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { isDark: boolean }) => (
  <div className="relative">
    <select 
      {...props} 
      className={`w-full p-3 rounded-xl border outline-none appearance-none transition-all focus:ring-2 focus:ring-blue-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} ${className}`}
    />
    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">▼</div>
  </div>
);

// Helper icon
const Check = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);

interface ProfileViewProps {
  user: User;
  theme: AppTheme;
  onBack: () => void;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, theme, onBack, onLogout }) => {
  const isDark = theme === 'dark';
  const [profile, setProfile] = useState<UserHealthProfile>({
    name: user.name,
    age: '',
    weight: '',
    height: '',
    gender: 'Other',
    activityLevel: 'Moderate',
    goal: 'Healthy Eating',
    dietary_pref: 'Any',
    allergies: '',
    medical_conditions: ''
  });
  
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem(`eatwise_profile_${user.id}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [user.id]);

  const handleSave = () => {
    localStorage.setItem(`eatwise_profile_${user.id}`, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field: keyof UserHealthProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold">My Profile</h2>
      </div>

      <div className={`p-6 rounded-3xl border mb-6 flex items-center gap-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-white shadow-md" />
        <div className="flex-1">
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p className="text-sm opacity-60">{user.email}</p>
        </div>
        <button 
          onClick={onLogout}
          className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">Health & Preferences</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Age" isDark={isDark}>
            <Input isDark={isDark} type="number" value={profile.age} onChange={e => handleChange('age', e.target.value)} placeholder="25" />
          </InputGroup>
          <InputGroup label="Gender" isDark={isDark}>
            <Select isDark={isDark} value={profile.gender} onChange={e => handleChange('gender', e.target.value)}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
          </InputGroup>
          <InputGroup label="Weight (kg)" isDark={isDark}>
             <Input isDark={isDark} type="number" value={profile.weight} onChange={e => handleChange('weight', e.target.value)} placeholder="70" />
          </InputGroup>
          <InputGroup label="Height (cm)" isDark={isDark}>
             <Input isDark={isDark} type="number" value={profile.height} onChange={e => handleChange('height', e.target.value)} placeholder="175" />
          </InputGroup>
        </div>

        <InputGroup label="Activity Level" isDark={isDark}>
          <Select isDark={isDark} value={profile.activityLevel} onChange={e => handleChange('activityLevel', e.target.value)}>
            <option>Sedentary</option>
            <option>Light</option>
            <option>Moderate</option>
            <option>Active</option>
          </Select>
        </InputGroup>

        <InputGroup label="Primary Goal" isDark={isDark}>
          <Select isDark={isDark} value={profile.goal} onChange={e => handleChange('goal', e.target.value)}>
            <option>Lose Weight</option>
            <option>Gain Muscle</option>
            <option>Maintain</option>
            <option>Healthy Eating</option>
          </Select>
        </InputGroup>
        
        <InputGroup label="Dietary Preference" isDark={isDark}>
          <Select isDark={isDark} value={profile.dietary_pref} onChange={e => handleChange('dietary_pref', e.target.value)}>
             <option>Any</option>
             <option>Vegetarian</option>
             <option>Non-Vegetarian</option>
             <option>Vegan</option>
             <option>Keto</option>
          </Select>
        </InputGroup>

        <InputGroup label="Allergies" isDark={isDark}>
          <Input isDark={isDark} value={profile.allergies} onChange={e => handleChange('allergies', e.target.value)} placeholder="Peanuts, Shellfish..." />
        </InputGroup>

        <InputGroup label="Medical Conditions" isDark={isDark}>
           <Input isDark={isDark} value={profile.medical_conditions} onChange={e => handleChange('medical_conditions', e.target.value)} placeholder="Diabetes, Hypertension..." />
        </InputGroup>

        <button 
          onClick={handleSave}
          className={`w-full py-4 mt-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
            saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
          }`}
        >
          {saved ? <span className="flex items-center gap-2"><Check className="w-5 h-5"/> Saved</span> : <span className="flex items-center gap-2"><Save className="w-5 h-5"/> Save Profile</span>}
        </button>

        <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3 text-xs leading-relaxed opacity-70">
          <AlertCircle className="w-4 h-4 shrink-0 text-blue-500" />
          <p>Your profile data is used to personalize diet plans and health insights. It is stored securely on your device.</p>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;