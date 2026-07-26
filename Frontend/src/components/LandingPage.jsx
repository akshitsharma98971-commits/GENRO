import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Brain, Video, FileText, ArrowRight, Activity, Zap, Play, Check, Shield } from 'lucide-react';
import genroLogo from '../genro-logo.jpg';
import { LampContainer } from './ui/lamp';
import ParticlesBackground from './ParticlesBackground';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage({ onNavigateToAuth }) {
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const revealsRef = useRef([]);
  revealsRef.current = [];

  const addToReveals = (el) => {
    if (el && !revealsRef.current.includes(el)) {
      revealsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Title reveal animation with slight scale and y-transform
    gsap.fromTo(
      titleRef.current,
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'power4.out' }
    );

    // Scroll Triggered reveals
    revealsRef.current.forEach((el) => {
      const direction = el.dataset.revealDir || 'up';
      let fromVars = { opacity: 0 };
      
      if (direction === 'up') fromVars.y = 60;
      if (direction === 'left') fromVars.x = -80;
      if (direction === 'right') fromVars.x = 80;

      gsap.fromTo(el, fromVars, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    // Add subtle floating effect to the phone mockup
    const phoneMockup = document.querySelector('.phone-float');
    if (phoneMockup) {
      gsap.to(phoneMockup, {
        y: -15,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Add rotating sweep to the background protection orb
    const laserSweep = document.querySelector('.laser-sweep');
    if (laserSweep) {
      gsap.to(laserSweep, {
        rotate: 360,
        duration: 15,
        repeat: -1,
        ease: 'linear',
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen text-white relative font-sans overflow-x-hidden bg-[#03030a] antialiased selection:bg-purple-500 selection:text-white">
      
      {/* Animated Particles Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticlesBackground />
      </div>
      
      {/* Premium CSS for specific website layout and components */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Glassmorphism Panels */
        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .btn-primary {
          background: #ffffff;
          color: #03030a;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .btn-primary:hover {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
        }

        /* Ambient background lighting */
        .ambient-light {
          position: absolute;
          width: 750px;
          height: 750px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(0,0,0,0) 70%);
          border-radius: 50%;
          z-index: 0;
          pointer-events: none;
        }

        /* Massive Spaced Header Title */
        .genro-title {
          font-size: clamp(3.5rem, 12vw, 12rem);
          font-weight: 800;
          letter-spacing: clamp(0.8rem, 4.5vw, 3.5rem);
          text-shadow: 0 0 40px rgba(168, 85, 247, 0.25);
          text-align: center;
          margin-left: clamp(0.8rem, 4.5vw, 3.5rem); /* Offset spacing to center correctly */
        }

        /* Tech Mesh Grid Pattern */
        .mesh-grid {
          background-image: linear-gradient(to right, rgba(168, 85, 247, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(168, 85, 247, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* Mock Phone Container styling */
        .mock-phone {
          width: 330px;
          height: 640px;
          border-radius: 44px;
          background: #06060f;
          border: 8px solid #141424;
          box-shadow: 0 40px 80px rgba(0,0,0,0.9), 0 0 40px rgba(168, 85, 247, 0.15);
          position: relative;
          overflow: hidden;
        }

        /* Solar Eclipse Crescent Glow Effect */
        .eclipse-orb {
          position: relative;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: #03030a;
          box-shadow: -20px 0 60px rgba(168, 85, 247, 0.6), 
                      10px 0 40px rgba(6, 182, 212, 0.4);
        }

        /* Voice/Doubt waves visualizer inside phone */
        .wave-line {
          width: 3px;
          height: 24px;
          background: #a855f7;
          border-radius: 4px;
          animation: scaleWave 1.2s ease-in-out infinite alternate;
        }

        @keyframes scaleWave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.4); }
        }
      `}} />

      {/* Hero ambient lights */}
      <div className="ambient-light" style={{ top: '10%', left: '20%' }}></div>
      <div className="ambient-light" style={{ top: '40%', right: '15%' }}></div>

      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 glass-panel border-t-0 border-l-0 border-r-0">
        <div className="text-xl font-bold tracking-widest flex items-center gap-3">
          <img src={genroLogo} className="w-8 h-8 rounded-full object-cover border border-purple-500/30" alt="Genro Logo" />
          GENRO<span className="text-slate-400 font-normal">AI</span>
        </div>
        <div className="hidden lg:flex space-x-10 text-sm font-semibold text-slate-300">
          <a href="#about" className="hover:text-white transition">About Genro</a>
          <a href="#tutoring" className="hover:text-white transition">AI Smart Videos</a>
          <a href="#progress" className="hover:text-white transition">Doubt Solver</a>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => onNavigateToAuth('login')} 
            className="text-sm font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            Login
          </button>
          <button 
            onClick={() => onNavigateToAuth('signup')} 
            className="btn-primary text-xs md:text-sm px-6 py-2.5 rounded-full cursor-pointer"
          >
            Start Learning
          </button>
        </div>
      </nav>

      {/* Hero Section with Lamp Effect */}
      <LampContainer className="pt-40">
        <div ref={titleRef} className="flex flex-col items-center text-center max-w-5xl space-y-8">
          <h1 className="genro-title">GENRO</h1>
          
          <div className="mt-6 flex flex-col items-center max-w-2xl space-y-6">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide text-slate-200">
              LEARNING THAT SIMPLY WORKS
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium px-4">
              Genro is a personalised learning platform designed for students to learn at their own pace. Discover weaknesses, track your mistakes, and master concepts dynamically.
            </p>
            <div className="pt-4 flex flex-col items-center gap-3">
              <button 
                onClick={() => onNavigateToAuth('signup')} 
                className="btn-primary text-base px-8 py-3.5 rounded-full cursor-pointer shadow-lg"
              >
                Create Free Account
              </button>
              <p className="text-slate-500 text-xs mt-2">Unlimited diagnostics & video tutoring modules included</p>
            </div>
          </div>
        </div>
      </LampContainer>

      {/* Features / Phone mockup Section */}
      <section id="about" className="relative min-h-screen flex items-center justify-center px-6 md:px-16 py-24 overflow-hidden z-10 mesh-grid">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div ref={addToReveals} data-reveal-dir="left" className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Personalized.<br />Adaptive.<br />Crystal Clear.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              We believe every child is special. Unlike traditional learning platforms, Genro continuously learns from each student's performance. It adapts to you, showing you what to learn next.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <button 
                onClick={() => onNavigateToAuth('signup')} 
                className="btn-primary px-7 py-3 rounded-full cursor-pointer text-sm font-bold"
              >
                Start Learning
              </button>
              <p className="text-slate-500 text-xs max-w-[150px] leading-tight">
                Designed for students to learn at their own pace.
              </p>
            </div>
          </div>

          <div ref={addToReveals} data-reveal-dir="right" className="flex justify-center phone-float">
            {/* High fidelity phone mockup replicating the outline from the split PNG frame */}
            <div className="mock-phone flex flex-col items-center pt-10 px-5">
              
              {/* Inner Notch */}
              <div className="w-28 h-5 rounded-full bg-[#141424] absolute top-2.5 left-1/2 transform -translate-x-1/2 z-25 flex items-center justify-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
                <div className="w-8 h-1 rounded-full bg-slate-800"></div>
              </div>

              <div className="text-sm font-extrabold tracking-widest text-slate-300 mt-2 mb-6">
                GENRO<span className="text-purple-500 font-light">AI</span>
              </div>
              
              <div className="glass-panel px-4 py-2 flex items-center space-x-2.5 mb-10 rounded-2xl border border-white/5 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-xs font-bold text-slate-300 tracking-wider">AI Evaluation Engine</span>
              </div>
              
              {/* Rotating 3D Neural Sphere / Learning Nodes Simulation */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-purple-500/20 animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}></div>
                
                {/* SVG Neural connections simulating a brain profile */}
                <svg className="w-32 h-32 text-purple-400/30 absolute z-0" viewBox="0 0 100 100">
                  <line x1="20" y1="30" x2="50" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50" y1="10" x2="80" y2="30" stroke="currentColor" strokeWidth="1" />
                  <line x1="80" y1="30" x2="70" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="70" y1="70" x2="30" y2="70" stroke="currentColor" strokeWidth="1" />
                  <line x1="30" y1="70" x2="20" y2="30" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
                  <line x1="20" y1="30" x2="70" y2="70" stroke="currentColor" strokeWidth="1" />
                  <line x1="80" y1="30" x2="30" y2="70" stroke="currentColor" strokeWidth="1" />
                </svg>

                {/* Core animated logo/brain */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600/30 to-cyan-500/30 border border-purple-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] z-10">
                  <Brain className="w-9 h-9 text-white animate-pulse" />
                </div>

                {/* Glowing Nodes around */}
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 absolute top-5 left-12 animate-ping"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-28 right-5 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 absolute bottom-6 left-8"></div>
              </div>

              {/* Status details inside mockup */}
              <div className="text-center space-y-2">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block">Doubt Solving Mode</span>
                <span className="text-base font-extrabold text-white block">Weakness mapping: Active</span>
              </div>

              {/* Audio/Video visualizer inside phone bottom */}
              <div className="mt-8 flex items-center justify-center gap-1.5 h-10 w-full">
                <div className="wave-line" style={{ animationDelay: '0.1s', height: '14px' }}></div>
                <div className="wave-line" style={{ animationDelay: '0.3s', height: '28px', backgroundColor: '#06b6d4' }}></div>
                <div className="wave-line" style={{ animationDelay: '0.5s', height: '22px' }}></div>
                <div className="wave-line" style={{ animationDelay: '0.2s', height: '34px', backgroundColor: '#06b6d4' }}></div>
                <div className="wave-line" style={{ animationDelay: '0.6s', height: '16px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tutoring Section replicating the Data Protection section from split PNG */}
      <section id="tutoring" className="relative min-h-screen py-24 px-6 md:px-16 flex flex-col items-center z-10">
        
        {/* Glowing Orb in center background */}
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-b from-purple-900/10 to-transparent absolute top-[-40px] blur-3xl opacity-40 z-0 pointer-events-none"></div>
        
        {/* Rotating Laser sweep simulating the 3D globe scanner */}
        <div className="absolute top-[20px] w-[350px] h-[350px] rounded-full border border-purple-500/10 flex items-center justify-center pointer-events-none">
          <div className="laser-sweep w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>

        <div className="text-center max-w-3xl relative z-10 space-y-5 gs-reveal">
          <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300">
            AI-Powered Tutoring
          </h2>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            It doesn't just provide content—it identifies learning gaps, recommends what to study next, creates personalized quizzes, and offers AI tutoring tailored to each student.
          </p>
        </div>

        {/* Dual panels replicating the bottom panels of frame 250 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mt-24 relative z-10">
          
          <div ref={addToReveals} data-reveal-dir="up" className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/2 hover:border-purple-500/30 transition-all duration-300">
            <div className="h-44 bg-purple-950/10 rounded-2xl mb-6 border border-purple-500/15 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent"></div>
              
              {/* Custom micro-UI showing AI Smart Video Avatar wave */}
              <div className="flex items-center gap-3 relative z-10 bg-black/40 px-5 py-3.5 rounded-2xl border border-white/5 backdrop-blur-md">
                <Video className="w-5 h-5 text-purple-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">AI Video Avatar Bot</span>
              </div>
            </div>
            <h3 className="text-lg font-black mb-2 text-white">AI Smart Videos & Avatar Bot</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Make these topics crystal clear with our AI smart videos and our AI video avatar bot which will help you to clear topics with real world examples.
            </p>
          </div>

          <div ref={addToReveals} data-reveal-dir="up" className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/2 hover:border-cyan-500/30 transition-all duration-300">
            <div className="h-44 bg-cyan-950/10 rounded-2xl mb-6 border border-cyan-500/15 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent"></div>
              
              {/* Custom micro-UI showing diagnostic status checklist */}
              <div className="flex items-center gap-3 relative z-10 bg-black/40 px-5 py-3.5 rounded-2xl border border-white/5 backdrop-blur-md">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">Unlimited Quiz Taking</span>
              </div>
            </div>
            <h3 className="text-lg font-black mb-2 text-white">Find Mistakes & Weak Topics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Students can track their progress with Unlimited quiz taking option and identify conceptual gaps instantly to improve score trends.
            </p>
          </div>

        </div>
      </section>

      {/* Solar Eclipse Section replicating the anonymous section from frame 300 */}
      <section id="progress" className="relative min-h-screen py-24 px-6 md:px-16 flex flex-col items-center justify-center z-10 overflow-hidden">
        
        {/* Solar Eclipse Eclipse Glow Ring */}
        <div ref={addToReveals} data-reveal-dir="up" className="flex flex-col items-center text-center space-y-12 relative z-10">
          
          <div className="eclipse-orb flex items-center justify-center overflow-hidden">
            {/* The bright crescent glow edge effect */}
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border border-purple-500/20 filter blur-sm"></div>
            
            {/* Center Core element */}
            <img src={genroLogo} className="w-full h-full rounded-full object-cover z-10 opacity-90 filter brightness-95" alt="Genro Solar Mascot" />
          </div>

          <div className="space-y-4 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300">
              Personalized Learning Loop
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-medium">
              We believe every child is special. Genro tracks diagnostic reports to automatically customize tutor segments just for you.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
              <Check className="w-4 h-4 text-purple-400" />
              Mistake Analyzer
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
              <Check className="w-4 h-4 text-cyan-400" />
              Real World Examples
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
              <Check className="w-4 h-4 text-purple-400" />
              Dynamic Quiz Engine
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative max-w-4xl mx-auto px-6 py-20 z-10 text-center space-y-6">
        <h3 className="text-2xl md:text-4xl font-extrabold text-white">Unlock Your Full Potential Today</h3>
        <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto font-medium">
          Join Genro and have your learning gaps analyzed and solved dynamically by AI models.
        </p>
        <div className="pt-4">
          <button 
            onClick={() => onNavigateToAuth('signup')} 
            className="btn-primary px-8 py-3.5 rounded-full text-base font-bold shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            Start Learning Now
          </button>
        </div>
      </section>

    </div>
  );
}
