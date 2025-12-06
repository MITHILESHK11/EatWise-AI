import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { login } from '../services/authService';
import { User } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await login();
      onLoginSuccess(user);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-white">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm text-center">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/30 animate-bounce-slow">
          <Sparkles className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">EatWise AI</h1>
        <p className="text-slate-500 mb-12 text-lg leading-relaxed">
          Your personal AI nutrition & food safety assistant.
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center justify-center gap-3 relative overflow-hidden group"
          >
             {loading ? (
               <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
             ) : (
               <>
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                 <span>Continue with Google</span>
               </>
             )}
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">or</span>
            </div>
          </div>

          <button disabled className="w-full py-4 px-6 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-not-allowed text-sm">
            Sign up with Email
          </button>
        </div>

        <p className="mt-8 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy. Your data is encrypted and stored securely.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
