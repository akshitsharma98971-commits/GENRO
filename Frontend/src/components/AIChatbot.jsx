import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Brain, 
  ArrowLeft, 
  AlertTriangle 
} from 'lucide-react';
import { getAIChatbotResponse } from '../utils/mockAIEngine';
import { mockCurriculum } from '../data/mockCurriculum';
import { fetchChatHistory, saveChatMessage } from '../utils/api';
import { InteractiveRobotSpline } from './ui/interactive-3d-robot';

export default function AIChatbot({ profile, testHistory, chatMessages, setChatMessages, navigateTo, userId }) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const formColumnRef = useRef(null);

  // Filter bot messages to identify the active response for the robot speech bubble
  const botMessages = chatMessages.filter(m => m.sender === 'bot');
  const latestBotMessage = botMessages.length > 0 ? botMessages[botMessages.length - 1] : null;

  // Load chat history from backend on mount
  useEffect(() => {
    if (!userId) return;
    fetchChatHistory(userId)
      .then(data => {
        const history = Array.isArray(data) ? data : (data.messages || data.data || []);
        if (history.length > 0) {
          const normalized = history.map((m, i) => ({
            id: m.id || m._id || `hist-${i}`,
            text: m.message_text || m.text || m.content || '',
            sender: (m.sender_type === 'Genro_AI' || m.sender === 'bot') ? 'bot' : 'user',
            timestamp: m.created_at ? new Date(m.created_at) : new Date(),
          }));
          setChatMessages(normalized);
        }
      })
      .catch(err => console.warn('Chat history load failed:', err));
  }, [userId]);

  const handleSend = (textToSend) => {
    const message = textToSend || inputValue;
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Save user message to backend
    if (userId) {
      saveChatMessage(userId, message, 'user')
        .catch(err => console.warn('Save user chat message failed:', err));
    }

    // Trigger bot thinking/typing simulation
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getAIChatbotResponse(
        message, 
        chatMessages, 
        profile, 
        testHistory, 
        mockCurriculum
      );

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      // Save AI reply to backend
      if (userId) {
        saveChatMessage(userId, responseText, 'Genro_AI')
          .catch(err => console.warn('Save AI chat message failed:', err));
      }
    }, 1800);
  };

  // Pre-made quick click prompts
  const quickPrompts = [
    "Explain Ohm's Law in simple terms",
    "Show my current weak topics",
    "Give me a quick practice question",
    "Explain series vs parallel resistance"
  ];

  // Helper function to render markdown-like styles and LaTeX blocks
  const renderMessageText = (text) => {
    const hasEquations = text.includes('$$');
    const parsedText = hasEquations ? text.split(/\$\$(.*?)\$\$/gs) : [text];
    
    return parsedText.map((part, index) => {
      const isEquation = hasEquations && index % 2 === 1;
      
      if (isEquation) {
        return (
          <div key={index} className="my-2.5 p-2.5 rounded-lg bg-slate-950/80 border border-purple-500/20 text-cyan-400 font-mono text-center text-[10px] overflow-x-auto">
            {part.trim()}
          </div>
        );
      }

      const boldParts = part.split(/\*\*(.*?)\*\*/g);
      const renderedText = boldParts.map((bPart, bIdx) => {
        const isBold = bIdx % 2 === 1;
        return isBold ? <strong key={bIdx} className="text-white font-black">{bPart}</strong> : bPart;
      });

      return <span key={index}>{renderedText}</span>;
    });
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] rounded-[32px] border border-dark-border/65 overflow-hidden bg-slate-950/40">
      
      {/* Dynamic Style injection to hide the injected Spline watermark/logo link */}
      <style>{`
        a[href*="spline.design"],
        a[href*="spline"],
        #spline-logo,
        spline-viewer shadow-root #logo,
        spline-viewer shadow-root a,
        .spline-watermark {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* 3D Spline Interactive Robot Canvas - Full Screen Background */}
      <InteractiveRobotSpline 
        scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
        className="absolute inset-0 z-0 w-full h-full object-cover md:-translate-x-[15%] transition-transform duration-500"
      />

      {/* Floating Back Button & Status Controls (Top Layer) */}
      <div className="absolute top-6 left-6 z-30 flex items-center gap-4 pointer-events-auto">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition bg-slate-950/80 border border-dark-border px-4 py-2.5 rounded-xl cursor-pointer backdrop-blur-md shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-dark-border text-[10px] text-purple-400 font-bold backdrop-blur-md shadow-lg uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Oliver Online
        </div>
      </div>

      {/* Floating Robot Speech Bubble - emerges directly above Whobee's head (mobile) or to the right (desktop) */}
      {(isTyping || latestBotMessage) && (
        <div className="absolute top-[12%] md:top-[16%] left-4 right-4 md:left-[54%] md:right-auto z-20 flex md:block justify-center animate-fade-in pointer-events-auto w-auto max-w-sm md:max-w-md">
          <div className="relative bg-slate-950/92 border border-purple-500/30 p-5 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl w-full border-b-purple-500/40">
            
            {isTyping ? (
              <div className="flex flex-col items-center gap-2.5 py-2">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest animate-pulse">Oliver is thinking...</span>
                <div className="flex gap-1.5 items-center justify-center">
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Oliver Coach
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold">Response generated</span>
                </div>
                <div className="text-slate-300 text-xs leading-relaxed max-h-[220px] overflow-y-auto pr-1">
                  {renderMessageText(latestBotMessage.text)}
                </div>
              </div>
            )}
            
            {/* Down pointer arrow (mobile only, pointing down to center head) */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-950 border-r border-b border-purple-500/30 rotate-45 block md:hidden"></div>
            
            {/* Left pointer arrow (desktop only, pointing left to center head) */}
            <div className="absolute top-[45%] -left-2 -translate-y-1/2 w-4 h-4 bg-slate-950 border-l border-b border-purple-500/30 rotate-45 hidden md:block"></div>
          </div>
        </div>
      )}

      {/* Floating Suggestions + Input Panel (Bottom Layer) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-6 flex flex-col gap-4 pointer-events-auto">
        
        {/* Quick click suggestions (floating pill buttons) */}
        <div className="flex gap-2 justify-center overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isTyping}
              className="px-3.5 py-2 rounded-xl border border-purple-500/10 text-[9px] font-bold text-slate-300 hover:text-white hover:border-purple-500/40 bg-slate-950/80 backdrop-blur-md whitespace-nowrap cursor-pointer transition shadow-md disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Floating Input Box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3 bg-slate-950/85 border border-purple-500/20 backdrop-blur-md rounded-2xl p-2 w-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.9)]"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Ask Oliver Coach..."
            className="flex-1 px-4.5 py-3 bg-transparent text-white placeholder-slate-600 focus:outline-none text-xs font-semibold disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white text-xs font-bold hover:opacity-95 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
