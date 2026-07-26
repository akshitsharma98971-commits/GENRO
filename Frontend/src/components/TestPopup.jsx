import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Sparkles, HelpCircle, X, ArrowRight, BrainCircuit } from 'lucide-react';

export default function TestPopup({ topic, subtopic, onClose, onStartTest }) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    // GSAP Entrance
    gsap.fromTo(backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)', delay: 0.1 }
    );
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.25,
      onComplete: onClose
    });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25
    });
  };

  const handleStart = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.25,
      onComplete: onStartTest
    });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-[#04060b]/80 backdrop-blur-md"
      ></div>

      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="glass-card w-full max-w-lg rounded-[32px] border border-neon-cyan/40 shadow-[0_0_60px_-10px_rgba(6,182,212,0.25)] p-10 relative overflow-hidden z-10"
      >
        {/* Glow corner */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-neon-cyan/20 blur-2xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-neon-purple/20 blur-2xl rounded-full"></div>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-xl border border-dark-border/80 text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all cursor-pointer shadow-sm z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-6 pt-3 relative z-10">
          
          <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan flex items-center justify-center animate-float shadow-md">
            <BrainCircuit className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-xs text-neon-cyan font-bold uppercase tracking-widest">
              AI Evaluation
            </div>
            <h4 className="text-2xl font-black text-white">Diagnostic Test</h4>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              You are about to start a test for:
            </p>
            <div className="mt-3.5 px-6 py-3 bg-slate-950/60 border border-dark-border/60 text-white font-extrabold text-base inline-block rounded-[20px] shadow-inner">
              {subtopic ? subtopic.name : topic.name}
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            Genro's AI engine will dynamically assess your understanding of this topic and identify any potential learning gaps.
          </p>

          {/* Action buttons */}
          <div className="w-full space-y-3 pt-3">
            <button
              onClick={handleStart}
              className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-black text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4.5 h-4.5 ml-0.5" />
              Start Assessment
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={handleClose}
              className="w-full py-3.5 rounded-2xl border border-dark-border/60 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
