import React from 'react';
import { AppTheme } from '../types';
import { Moon, Sun, Palette, Check } from 'lucide-react';

interface SettingsViewProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentTheme, onThemeChange, onBack }) => {
  const isDark = currentTheme === 'dark';

  const themes: { id: AppTheme; name: string; color: string; icon: any }[] = [
    { id: 'light', name: 'Clean Light', color: 'bg-white border-slate-200', icon: Sun },
    { id: 'dark', name: 'Modern Dark', color: 'bg-slate-900 border-slate-700', icon: Moon },
    { id: 'green', name: 'Foodie Green', color: 'bg-emerald-50 border-emerald-200', icon: Palette },
    { id: 'orange', name: 'Warm Orange', color: 'bg-orange-50 border-orange-200', icon: Palette },
  ];

  return (
    <div className="max-w-md mx-auto">
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</h2>
      
      <div className={`p-6 rounded-2xl mb-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>App Theme</h3>
        <div className="space-y-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                currentTheme === t.id 
                  ? 'border-blue-500 ring-1 ring-blue-500' 
                  : 'border-transparent hover:border-slate-200'
              } ${t.color} ${t.id === 'dark' ? 'text-white' : 'text-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-white/20`}>
                  <t.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{t.name}</span>
              </div>
              {currentTheme === t.id && <Check className="w-5 h-5 text-blue-500" />}
            </button>
          ))}
        </div>
      </div>

      <button onClick={onBack} className={`w-full py-3 font-semibold rounded-xl border ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'} hover:bg-opacity-50`}>
        Back to Home
      </button>
    </div>
  );
};

export default SettingsView;