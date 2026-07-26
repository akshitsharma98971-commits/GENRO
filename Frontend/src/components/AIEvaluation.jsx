import React from 'react';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Play
} from 'lucide-react';

export default function AIEvaluation({ chapter, result, navigateTo, onWatchVideo }) {
  if (!result) return null;

  const { overallScore, correctCount, totalCount, topicScores, weakTopics, strongTopics } = result;

  const isFailed = overallScore < 70;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-10 page-container">
      
      {/* Back to Subjects */}
      <button 
        onClick={() => navigateTo('subjects')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors w-fit border border-dark-border/60 hover:border-dark-border px-4 py-2.5 rounded-xl cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Subjects
      </button>

      {/* Grade Banner */}
      <div className="text-center space-y-4">
        <span className="text-xs text-neon-cyan font-bold tracking-widest uppercase px-3.5 py-1 bg-slate-900 border border-dark-border/40 rounded-xl">Evaluation Report</span>
        <h2 className="text-4xl md:text-5xl font-black text-white">Diagnostic Completed!</h2>
        <p className="text-slate-400 text-base max-w-lg mx-auto">
          Our AI has finished analyzing your responses. Below is your conceptual breakdown.
        </p>
      </div>

      {/* Main Score & stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Big circular score */}
        <div className="glass-card rounded-[32px] p-8 border border-dark-border/80 flex flex-col items-center justify-center text-center col-span-1 md:col-span-1 min-h-[250px]">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Overall Score</span>
          <div className="relative w-32 h-32 flex items-center justify-center mb-3">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="40" 
                stroke="rgba(255, 255, 255, 0.03)" 
                strokeWidth="8" 
                fill="transparent" 
              />
              <circle 
                cx="50" cy="50" r="40" 
                stroke={isFailed ? '#f43f5e' : '#10b981'} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-3xl font-black text-white">{overallScore}%</span>
          </div>
          <span className="text-sm text-slate-400 font-semibold">{correctCount} of {totalCount} correct</span>
        </div>

        {/* Diagnostic breakdown details */}
        <div className="glass-card rounded-[32px] p-8 border border-dark-border/80 col-span-1 md:col-span-2 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold text-white mb-4">AI Diagnostic Summary</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-lg bg-neon-emerald/10 text-neon-emerald flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-300">
                  <strong className="text-white font-bold">Strengths:</strong> You showed strong aptitude in **{strongTopics.length}** topic(s). You can skip detailed revision for these.
                </p>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-lg bg-neon-rose/10 text-neon-rose flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-300">
                  <strong className="text-white font-bold">Weaknesses:</strong> We identified **{weakTopics.length}** weak topic(s) scoring below 70%. We recommend watching your tailored video lectures.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-dark-border/40 mt-5 flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <TrendingUp className="w-4.5 h-4.5 text-neon-cyan" />
            Your progress score has been updated in the dashboard!
          </div>
        </div>

      </div>

      {/* Topic-by-topic breakdowns */}
      <div className="space-y-5">
        <h3 className="text-2xl font-black text-white tracking-wide">Topic Breakdown</h3>
        
        <div className="space-y-4">
          {chapter.topics.map(topic => {
            const score = topicScores[topic.id] || 0;
            const isWeak = score < 70;

            return (
              <div 
                key={topic.id}
                className="glass-card rounded-[24px] p-6 md:p-8 border border-dark-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h5 className="font-extrabold text-white text-base md:text-lg">{topic.name}</h5>
                    {isWeak ? (
                      <span className="text-xs px-3 py-1 rounded-full bg-neon-rose/10 border border-neon-rose/20 text-neon-rose font-bold uppercase tracking-wider">
                        Needs Review
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald font-bold uppercase tracking-wider">
                        Satisfactory
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{topic.description}</p>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                  {/* Score bar */}
                  <div className="text-right">
                    <span className={`font-black text-lg block ${isWeak ? 'text-neon-rose' : 'text-neon-emerald'}`}>
                      {score}% Accuracy
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">Topic Diagnostic</span>
                  </div>

                  {isWeak && (
                    <button 
                      onClick={() => onWatchVideo(topic)}
                      className="w-10 h-10 rounded-xl bg-neon-purple/20 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple hover:text-white transition-all flex items-center justify-center cursor-pointer glow-purple shadow-md"
                      title="Watch AI Lesson"
                    >
                      <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-dark-border/40 pt-6">
        <button 
          onClick={() => navigateTo('subjects')}
          className="px-6 py-4 rounded-xl border border-dark-border/60 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <BookOpen className="w-4.5 h-4.5" />
          Back to Subjects
        </button>

        <button 
          onClick={() => navigateTo('chapter', { currentChapter: chapter })}
          className="px-10 py-4.5 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white text-base font-black shadow-lg shadow-purple-500/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center group"
        >
          Proceed to Study Room
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

    </div>
  );
}
