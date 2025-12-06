import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { ChatMessage, AppTheme } from '../types';
import { getChatResponse } from '../services/geminiService';

interface ChatBotProps {
  theme: AppTheme;
  onBack: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ theme, onBack }) => {
  const isDark = theme === 'dark';
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your EatWise Coach. I can help with recipes, diet planning, or food safety questions. What's on your mind?",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getChatResponse(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[80vh] rounded-3xl overflow-hidden border shadow-2xl relative animate-fade-in ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-white/50'}`}>
      
      {/* Header */}
      <div className={`p-4 flex items-center justify-between border-b backdrop-blur-md z-10 ${isDark ? 'bg-slate-900/80 border-white/5' : 'bg-white/80 border-slate-100'}`}>
        <div className="flex items-center gap-3">
           <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
             <ArrowLeft className="w-5 h-5" />
           </button>
           <div className="flex items-center gap-2">
             <div className="relative">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                 <Sparkles className="w-5 h-5" />
               </div>
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
             </div>
             <div>
               <h3 className="font-bold text-sm">EatWise Coach</h3>
               <p className="text-xs opacity-60">AI Nutritionist</p>
             </div>
           </div>
        </div>
        <button className="p-2 opacity-50 hover:opacity-100">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isUser && (
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs shrink-0 mt-2 shadow-sm">
                     AI
                   </div>
                )}
                
                <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : (isDark ? 'bg-slate-800 text-slate-200 rounded-tl-sm' : 'bg-white text-slate-700 rounded-tl-sm')
                }`}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-blue-100' : ''}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs shrink-0 mt-2">AI</div>
                <div className={`p-4 rounded-3xl rounded-tl-sm flex items-center gap-1.5 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`flex items-center gap-2 p-2 rounded-3xl border transition-all focus-within:ring-2 focus-within:ring-blue-500/50 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
        }`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full transition-all ${
              !input.trim() || isLoading
               ? 'opacity-50 cursor-not-allowed'
               : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:scale-105'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;