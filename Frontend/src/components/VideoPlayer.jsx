import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  ListRestart, 
  Volume2, 
  Maximize2,
  Tv,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function VideoPlayer({ topic, chapter, navigateTo }) {
  if (!topic) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  const durationSec = 120; // 2 minutes simulated length
  const script = topic.videoScript || [
    { time: 0, text: "Let's review this concept together." },
    { time: 10, text: "Pay close attention to these parameters." },
    { time: 20, text: "This will help solve the quiz problems easily." }
  ];

  // Interval for ticking time
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime >= durationSec) {
            setIsPlaying(false);
            setIsVideoFinished(true);
            return durationSec;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update subtitles
  useEffect(() => {
    // Find current active subtitle
    const activeSub = [...script]
      .reverse()
      .find(sub => currentTime >= (sub.time / 60) * durationSec); // Scaling script time relative to duration
    
    if (activeSub) {
      setCurrentSubtitle(activeSub.text);
    } else {
      setCurrentSubtitle('');
    }
  }, [currentTime, script]);

  const togglePlay = () => {
    if (isVideoFinished) {
      setCurrentTime(0);
      setIsVideoFinished(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (percentage) => {
    setCurrentTime(Math.round((percentage / 100) * durationSec));
    setIsVideoFinished(false);
  };

  const handleRetestTopic = () => {
    navigateTo('test', { 
      currentChapter: chapter, 
      currentTopic: topic, 
      testMode: 'topic' 
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- Dynamic Visual Renderers based on topic ID ---
  const renderVisualSimulation = () => {
    const progressFraction = currentTime / durationSec;
    
    switch (topic.id) {
      case 'ohm-law':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 overflow-hidden">
            {/* Visual Circuit Simulation */}
            <div className="text-center space-y-1.5 mb-6 z-10">
              <span className="text-[10px] text-neon-cyan font-bold tracking-widest uppercase">Simulation Module</span>
              <h5 className="text-sm font-bold text-white">V = I × R Relationship</h5>
            </div>
            
            {/* Battery and wire loop */}
            <div className="relative w-72 h-40 border border-dashed border-slate-700 rounded-3xl flex items-center justify-center z-10">
              
              {/* Resistor Block in center */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border-2 border-neon-purple px-4 py-1.5 rounded-lg flex flex-col items-center">
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Resistor</span>
                <span className="text-xs font-bold text-neon-purple">R = 5 Ω</span>
              </div>

              {/* Voltage Source at bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-slate-900 border-2 border-neon-cyan px-4 py-1.5 rounded-lg flex flex-col items-center">
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Voltage</span>
                <span className="text-xs font-bold text-neon-cyan">V = {Math.round(5 + progressFraction * 15)}V</span>
              </div>

              {/* Electron particles moving */}
              {isPlaying && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Generate dotted electrons traveling along the dashed border */}
                  {[...Array(12)].map((_, i) => {
                    const delay = (i / 12) * 4;
                    const speed = 4 - progressFraction * 2.8; // higher voltage -> faster flow (lower speed value)
                    return (
                      <div 
                        key={i} 
                        className="absolute w-2 h-2 rounded-full bg-neon-cyan/80 glow-cyan animate-pulse"
                        style={{
                          animation: `float-particle ${speed}s linear infinite`,
                          animationDelay: `${delay}s`,
                          offsetPath: `path('M 0 20 L 288 20 L 288 140 L 0 140 Z')`,
                        }}
                      ></div>
                    );
                  })}
                </div>
              )}

              <div className="text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">Current Flow (I)</span>
                <span className="text-2xl font-black text-white text-glow-cyan">
                  {((5 + progressFraction * 15) / 5).toFixed(2)} A
                </span>
              </div>
            </div>
            
            {/* Inline stylesheet for keyframe offsetting path (compatible across modern browsers) */}
            <style>{`
              @keyframes float-particle {
                0% { offset-distance: 0%; }
                100% { offset-distance: 100%; }
              }
            `}</style>
          </div>
        );

      case 'resistors-circuit':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 overflow-hidden">
            <div className="text-center space-y-1.5 mb-6 z-10">
              <span className="text-[10px] text-neon-cyan font-bold tracking-widest uppercase">Simulation Module</span>
              <h5 className="text-sm font-bold text-white">Series vs Parallel Distribution</h5>
            </div>
            
            {/* Toggle series/parallel visually as video progresses */}
            {progressFraction < 0.5 ? (
              <div className="text-center space-y-4 z-10">
                <span className="text-xs text-neon-purple font-bold block">Series connection</span>
                <div className="flex items-center gap-3 bg-slate-900/60 p-4 border border-dark-border/60 rounded-2xl">
                  <div className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950">R1 = 4 Ω</div>
                  <div className="text-slate-500 font-bold">+</div>
                  <div className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950">R2 = 6 Ω</div>
                  <div className="text-slate-500 font-bold">=</div>
                  <div className="px-3 py-1.5 rounded-lg border border-neon-purple bg-neon-purple/5 font-bold">R_tot = 10 Ω</div>
                </div>
                <p className="text-[10px] text-slate-400">Current is IDENTICAL through both resistors</p>
              </div>
            ) : (
              <div className="text-center space-y-4 z-10">
                <span className="text-xs text-neon-cyan font-bold block">Parallel connection</span>
                <div className="flex flex-col gap-2 items-center bg-slate-900/60 p-4 border border-dark-border/60 rounded-2xl">
                  <div className="px-3 py-1 rounded-lg border border-slate-700 bg-slate-950 text-xs">Branch 1: R1 = 6 Ω</div>
                  <div className="px-3 py-1 rounded-lg border border-slate-700 bg-slate-950 text-xs">Branch 2: R2 = 3 Ω</div>
                  <div className="w-full border-t border-slate-700 my-1"></div>
                  <div className="px-3 py-1 rounded-lg border border-neon-cyan bg-neon-cyan/5 font-bold text-xs">R_tot = 2 Ω</div>
                </div>
                <p className="text-[10px] text-slate-400">Current SPLITS; Voltage is identical across both branches</p>
              </div>
            )}
          </div>
        );

      case 'mirror-formula':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 overflow-hidden">
            <div className="text-center space-y-1.5 mb-6 z-10">
              <span className="text-[10px] text-neon-cyan font-bold tracking-widest uppercase">Simulation Module</span>
              <h5 className="text-sm font-bold text-white">Light Ray Tracing concavity</h5>
            </div>
            
            {/* Optical bench layout */}
            <div className="relative w-80 h-36 border-b border-slate-700 z-10 flex items-center justify-center">
              
              {/* Concave Mirror curvature */}
              <div className="absolute right-6 top-4 bottom-4 w-4 rounded-l-full bg-slate-800 border-l-4 border-neon-cyan"></div>
              
              {/* Principal axis lines */}
              <div className="absolute inset-x-4 h-0.5 bg-slate-700/60 top-1/2 -translate-y-1/2"></div>
              
              {/* Focal points */}
              <div className="absolute right-24 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-[10px] font-bold text-neon-purple">F</span>
                <span className="w-1.5 h-1.5 rounded-full bg-neon-purple"></span>
              </div>
              <div className="absolute right-44 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-500">C</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              </div>

              {/* Light rays reflecting */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Ray 1: Incident parallel to principal axis */}
                <line x1="20" y1="30" x2="310" y2="30" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4" />
                {/* Ray 1 Reflected: passing through F */}
                <line x1="310" y1="30" x2="225" y2="68" stroke="#f43f5e" strokeWidth="2" />
                <line x1="225" y1="68" x2="100" y2="120" stroke="#f43f5e" strokeWidth="2" />
              </svg>

              <div className="absolute left-6 top-1/3 bg-slate-900/80 px-2 py-1 rounded border border-dark-border text-[9px] font-bold">
                u (Object Distance) = Negative
              </div>
            </div>
          </div>
        );

      case 'quadratic-formula':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 overflow-hidden">
            <div className="text-center space-y-1.5 mb-6 z-10">
              <span className="text-[10px] text-neon-cyan font-bold tracking-widest uppercase">Simulation Module</span>
              <h5 className="text-sm font-bold text-white">Solving Quadratic Equations</h5>
            </div>
            
            {/* Whiteboard Math steps */}
            <div className="w-72 bg-slate-900 border border-dark-border/80 rounded-2xl p-4 font-mono z-10 space-y-2.5 text-xs text-left">
              <div className="text-slate-500">Solve: x² - 5x + 6 = 0</div>
              <div>a = 1, b = -5, c = 6</div>
              <div className="text-neon-cyan">
                Discriminant D = b² - 4ac
                <span className="block pl-3 text-white">D = (-5)² - 4(1)(6) = 25 - 24 = 1</span>
              </div>
              {progressFraction > 0.5 && (
                <div className="text-neon-purple animate-fade-in">
                  Apply Quadratic Formula:
                  <span className="block pl-3 text-white">x = [ -(-5) ± √1 ] / 2(1)</span>
                  <span className="block pl-3 text-white">x = (5 ± 1) / 2</span>
                  <span className="block pl-3 font-bold text-neon-emerald">Roots: x = 3 and x = 2</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-center p-6">
            <Tv className="w-12 h-12 text-slate-600 mb-3" />
            <h5 className="text-sm text-slate-400">Concept Explanation Visuals</h5>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8 page-container">
      
      {/* Navbar header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigateTo('chapter', { currentChapter: chapter })}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors w-fit border border-dark-border/60 hover:border-dark-border px-4.5 py-2.5 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Study Room
        </button>
        <div className="inline-flex items-center gap-2 text-sm text-neon-purple font-extrabold px-3.5 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20">
          <Sparkles className="w-4 h-4 animate-pulse" />
          Genro AI Lecture Module
        </div>
      </div>

      {/* Main player + transcript grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Video player */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="relative aspect-video rounded-[32px] overflow-hidden border border-dark-border shadow-2xl bg-black">
            
            {/* Visual simulation screen */}
            {renderVisualSimulation()}

            {/* Subtitles Overlay */}
            {currentSubtitle && (
              <div className="absolute bottom-20 inset-x-8 text-center pointer-events-none z-20">
                <p className="inline-block px-5 py-3 rounded-2xl bg-slate-950/80 border border-dark-border/60 text-white font-semibold text-sm md:text-base max-w-lg mx-auto backdrop-blur-sm shadow-lg">
                  {currentSubtitle}
                </p>
              </div>
            )}

            {/* Video Complete Card overlay */}
            {isVideoFinished && (
              <div className="absolute inset-0 bg-[#07090ebd]/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                <CheckCircle className="w-16 h-16 text-neon-emerald mb-4 animate-bounce" />
                <h4 className="text-2xl font-black text-white">Visual Lesson Completed!</h4>
                <p className="text-sm text-slate-400 max-w-md mt-2 mb-8 leading-relaxed">
                  You've reviewed the concept explanation. Ready to retest this specific topic to raise your dashboard progress?
                </p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setCurrentTime(0);
                      setIsVideoFinished(false);
                      setIsPlaying(true);
                    }}
                    className="px-5 py-3 rounded-xl border border-dark-border/80 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-900/60 cursor-pointer shadow-sm"
                  >
                    Watch Again
                  </button>
                  
                  <button 
                    onClick={handleRetestTopic}
                    className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white text-sm font-black shadow-lg shadow-purple-500/20 hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-4.5 h-4.5" />
                    Take Topic Test
                  </button>
                </div>
              </div>
            )}
            
            {/* Audio bar animations when playing */}
            {isPlaying && (
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-950/70 border border-dark-border/40 px-4 py-2 rounded-xl backdrop-blur-sm z-20">
                <div className="grid-visualizer flex gap-0.5 items-end h-[16px]">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">AI Voiceover</span>
              </div>
            )}

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-5 flex items-center justify-between gap-5 z-20">
              <button 
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-neon-purple/20 hover:bg-neon-purple/35 text-neon-purple border border-neon-purple/35 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <span className="text-xs font-bold text-slate-400 shrink-0 bg-slate-950/60 px-3 py-1.5 rounded-lg">
                {formatTime(currentTime)} / {formatTime(durationSec)}
              </span>

              {/* Scrubber slider */}
              <input 
                type="range"
                min="0"
                max="100"
                value={(currentTime / durationSec) * 100}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="flex-1 accent-neon-purple h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
              />

              <button 
                onClick={() => handleSeek(0)}
                className="p-2.5 rounded-xl border border-dark-border/40 text-slate-400 hover:text-white cursor-pointer bg-slate-950/40"
                title="Restart Video"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>

              <div className="hidden sm:flex items-center gap-3 text-slate-400">
                <Volume2 className="w-5 h-5 cursor-pointer hover:text-white" />
                <Maximize2 className="w-5 h-5 cursor-pointer hover:text-white" />
              </div>
            </div>

          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-black text-white">{topic.videoTitle}</h3>
            <p className="text-sm text-slate-400">Topic Diagnostic Review Module • Chapter: {chapter.name}</p>
          </div>

        </div>

        {/* Right column: Interactive Transcript / Lecture notes */}
        <div className="lg:col-span-1 flex flex-col h-[480px] lg:h-auto">
          <div className="glass-card rounded-[32px] border border-dark-border/80 flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-dark-border/60 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-neon-purple animate-pulse" />
              <h4 className="text-base font-extrabold text-white">Lecture Transcript</h4>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {script.map((line, idx) => {
                const lineTime = (line.time / 60) * durationSec;
                const isPassed = currentTime >= lineTime;
                
                return (
                  <div 
                    key={idx}
                    onClick={() => handleSeek((line.time / 60) * 100)}
                    className={`p-4 rounded-2xl border text-sm leading-relaxed text-left cursor-pointer transition-all ${
                      isPassed 
                        ? 'border-neon-purple/20 bg-neon-purple/[0.02] text-slate-200 font-medium' 
                        : 'border-transparent text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-bold uppercase tracking-wider text-xs ${isPassed ? 'text-neon-purple' : 'text-slate-600'}`}>
                        Coach AI
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">{formatTime(Math.round(lineTime))}</span>
                    </div>
                    {line.text}
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-dark-border/60 bg-slate-950/40 text-center">
              <button 
                onClick={handleRetestTopic}
                className="w-full py-4.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border-2 border-dark-border/80 text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4.5 h-4.5" />
                Skip to Topic Practice
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
