import React from 'react';
import { HistoryItem, AppTheme } from '../types';
import { Clock, Trash2, ArrowRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onBack: () => void;
  theme: AppTheme;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onClear, onBack, theme }) => {
  const isDark = theme === 'dark';

  const getStatusIcon = (rating: string) => {
    switch (rating) {
      case 'safe': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'caution': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'avoid': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Scan History</h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
          <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <Clock className="w-8 h-8" />
          </div>
          <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No history yet</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Scan some food to see it here</p>
          <button onClick={onBack} className="mt-4 text-blue-600 font-bold text-sm hover:underline">
            Scan now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-slate-100 hover:border-slate-200'}`}
            >
              <div className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.food_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <span className="text-xs">No Img</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold truncate pr-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.food_name}</h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(item.safety_rating)}
                  <span className={`capitalize ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.safety_rating}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className={`truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.expiry_status.days_left}</span>
                </div>
              </div>
              
              <ArrowRight className={`w-5 h-5 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <button onClick={onBack} className={`font-semibold ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default HistoryView;