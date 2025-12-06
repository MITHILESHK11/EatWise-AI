import React from 'react';
import { Scan } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl animate-bounce-slow">
          <Scan className="w-10 h-10 animate-pulse" />
        </div>
      </div>
      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
        Analyzing Food...
      </h3>
      <p className="text-sm opacity-60 max-w-xs mx-auto">
        Checking safety, calculating nutrition, and finding recipes.
      </p>
    </div>
  );
};

export default Loading;