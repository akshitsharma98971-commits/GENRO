import React from 'react';
import { 
  TrendingUp, 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { mockCurriculum } from '../data/mockCurriculum';
import GradientBarsBackground from './ui/gradient-bars-background';

export default function ProgressTracker({ profile, testHistory, topicTestHistory, navigateTo }) {
  
  const hasHistory = Object.keys(testHistory).length > 0;
  
  // Calculate analytics
  const testedChapters = Object.entries(testHistory);
  let totalScoreSum = 0;
  let totalTopics = 0;
  const weakTopics = [];
  const strongTopics = [];

  // Parse curriculum details to match topic names
  const boardData = mockCurriculum[profile.class]?.[profile.board] || {};
  
  testedChapters.forEach(([chId, res]) => {
    // Find chapter in curriculum to retrieve details
    let chapterObj = null;
    let subjectName = '';
    
    Object.entries(boardData).forEach(([subj, chapters]) => {
      const found = chapters.find(c => c.id === chId);
      if (found) {
        chapterObj = found;
        subjectName = subj;
      }
    });

    if (res && res.topicScores && chapterObj) {
      Object.entries(res.topicScores).forEach(([tId, score]) => {
        const topicObj = chapterObj.topics.find(t => t.id === tId);
        const name = topicObj ? topicObj.name : tId;
        const detail = { id: tId, name, subject: subjectName, score };
        
        totalScoreSum += score;
        totalTopics++;

        if (score < 70) {
          weakTopics.push(detail);
        } else {
          strongTopics.push(detail);
        }
      });
    }
  });

  const overallAverage = totalTopics > 0 ? Math.round(totalScoreSum / totalTopics) : 0;

  // Render mock SVG progress trend line chart
  const renderSVGChart = () => {
    // Grid coordinate size
    const width = 500;
    const height = 180;
    const padding = 30;
    
    // Fallback if no history yet
    if (!hasHistory) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 backdrop-blur-sm z-10">
          <BookOpen className="w-8 h-8 text-slate-600 mb-2" />
          <p className="text-xs text-slate-500 font-medium">No activity recorded yet</p>
          <span className="text-[10px] text-slate-600 max-w-[200px] mt-0.5">Take your first Chapter Diagnostic test to generate a performance trend!</span>
        </div>
      );
    }

    // Convert test history to chronologically ordered data points
    // Let's create mock chronological order based on key names
    const dataPoints = testedChapters.map(([chId, res], idx) => ({
      x: padding + (idx * (width - 2 * padding)) / Math.max(testedChapters.length - 1, 1),
      y: height - padding - (res.overallScore / 100) * (height - 2 * padding),
      score: res.overallScore,
      label: `Test ${idx + 1}`
    }));

    // If only one data point, double it for a straight line visual
    if (dataPoints.length === 1) {
      dataPoints.push({
        x: width - padding,
        y: dataPoints[0].y,
        score: dataPoints[0].score,
        label: `Test 2`
      });
    }

    // Build SVG Path
    let pathString = `M ${dataPoints[0].x} ${dataPoints[0].y}`;
    let areaString = `M ${dataPoints[0].x} ${height - padding} L ${dataPoints[0].x} ${dataPoints[0].y}`;
    
    for (let i = 1; i < dataPoints.length; i++) {
      pathString += ` L ${dataPoints[i].x} ${dataPoints[i].y}`;
      areaString += ` L ${dataPoints[i].x} ${dataPoints[i].y}`;
    }
    areaString += ` L ${dataPoints[dataPoints.length - 1].x} ${height - padding} Z`;

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(val => {
          const y = height - padding - (val / 100) * (height - 2 * padding);
          return (
            <g key={val} className="opacity-[0.05]">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="white" strokeWidth="1" />
              <text x={padding - 10} y={y + 3} fill="white" fontSize="9" textAnchor="end">{val}%</text>
            </g>
          );
        })}

        {/* Shaded Area */}
        <path d={areaString} fill="url(#chartGradient)" />

        {/* Line */}
        <path d={pathString} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Nodes */}
        {dataPoints.map((point, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="5" 
              fill="#080b11" 
              stroke="#06b6d4" 
              strokeWidth="2.5" 
              className="hover:scale-125 transition-transform"
            />
            <text 
              x={point.x} 
              y={point.y - 12} 
              fill="white" 
              fontSize="9" 
              fontWeight="bold" 
              textAnchor="middle" 
              className="opacity-80"
            >
              {point.score}%
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <>
      <GradientBarsBackground />
      <div className="space-y-8 page-container relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors w-fit border border-dark-border/60 hover:border-dark-border px-4.5 py-2.5 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between mt-3">
          <div>
            <h2 className="text-4xl font-black text-white flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-neon-emerald" />
              Progress Report
            </h2>
            <p className="text-slate-400 text-sm mt-1">Real-time statistics compiled across tested diagnostic modules.</p>
          </div>
        </div>
      </div>

      {/* Overview Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-[24px] p-6 md:p-8 border border-dark-border/60 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Learning Streak</span>
            <h4 className="text-3xl font-black text-white flex items-center gap-2">
              <Zap className="w-8 h-8 text-neon-cyan fill-neon-cyan/10" />
              {profile.streak} Days
            </h4>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan text-2xl font-bold">
            🔥
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-6 md:p-8 border border-dark-border/60 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Experience</span>
            <h4 className="text-3xl font-black text-white flex items-center gap-2">
              <Award className="w-8 h-8 text-neon-yellow fill-neon-yellow/10" />
              {profile.xp} XP
            </h4>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-neon-yellow/10 flex items-center justify-center text-neon-yellow text-2xl font-bold">
            ⭐
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-6 md:p-8 border border-dark-border/60 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Overall Progress Score</span>
            <h4 className="text-3xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-neon-emerald" />
              {overallAverage}%
            </h4>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-neon-emerald/10 flex items-center justify-center text-neon-emerald text-2xl font-bold">
            📈
          </div>
        </div>
      </div>

      {/* Main analytical dashboard grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trend Graph */}
        <div className="glass-card rounded-[32px] p-8 border border-dark-border/80 lg:col-span-2 space-y-6 shadow-2xl">
          <div className="flex justify-between items-center px-2">
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider">Performance Trend Chart</h4>
            <span className="text-xs text-slate-500 font-bold">Genro Diagnostics Track</span>
          </div>

          <div className="relative h-64 w-full rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 p-4 overflow-hidden shadow-[0_4px_24px_-10px_rgba(0,0,0,0.3)]">
            {renderSVGChart()}
          </div>
        </div>

        {/* Total stats breakdown */}
        <div className="glass-card rounded-[32px] p-8 border border-dark-border/80 space-y-6 shadow-2xl">
          <h4 className="text-base font-extrabold text-white uppercase tracking-wider">Overview Statistics</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-[20px] bg-white/[0.02] backdrop-blur-sm border border-white/10 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.3)]">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Average Accuracy</span>
              <span className="text-3xl font-black text-white text-glow-cyan mt-1 block">{overallAverage}%</span>
            </div>

            <div className="p-5 rounded-[20px] bg-white/[0.02] backdrop-blur-sm border border-white/10 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.3)]">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">XP Collected</span>
              <span className="text-3xl font-black text-white text-glow-purple mt-1 block">{profile.xp}</span>
            </div>
          </div>

          <div className="p-5 rounded-[20px] bg-white/[0.02] backdrop-blur-sm border border-white/10 space-y-4 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-semibold">Chapters Assessed</span>
              <span className="font-bold text-white">{testedChapters.length} / {Object.keys(boardData).reduce((sum, s) => sum + boardData[s].length, 0)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-semibold">Weak Topics Identified</span>
              <span className="font-bold text-neon-rose">{weakTopics.length} Areas</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-semibold">Mastered Topics</span>
              <span className="font-bold text-neon-emerald">{strongTopics.length} Areas</span>
            </div>
          </div>
        </div>

      </div>

      {/* Weak and Strong Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Weak Topics List */}
        <div className="glass-card rounded-[32px] p-8 border border-dark-border/80 space-y-5 shadow-2xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-dark-border/40">
            <AlertTriangle className="w-5.5 h-5.5 text-neon-rose" />
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider">Concept Revision Required</h4>
          </div>

          {weakTopics.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No weak topics detected. Keep maintaining high scores!
            </div>
          ) : (
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {weakTopics.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4.5 rounded-2xl bg-neon-rose/[0.02] backdrop-blur-sm border border-white/10 text-sm shadow-[0_4px_24px_-10px_rgba(0,0,0,0.3)]">
                  <div>
                    <h5 className="font-bold text-white text-base">{item.name}</h5>
                    <span className="text-xs text-slate-500 font-semibold">{item.subject} • Diagnostic</span>
                  </div>
                  <span className="font-black text-neon-rose bg-neon-rose/10 px-3 py-1.5 rounded-xl shadow-sm">
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strong Topics List */}
        <div className="glass-card rounded-[32px] p-8 border border-dark-border/80 space-y-5 shadow-2xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-dark-border/40">
            <CheckCircle2 className="w-5.5 h-5.5 text-neon-emerald" />
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider">Concept Masteries</h4>
          </div>

          {strongTopics.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No masteries recorded yet. Complete quizzes to populate strength reports!
            </div>
          ) : (
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {strongTopics.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4.5 rounded-2xl bg-neon-emerald/[0.02] backdrop-blur-sm border border-white/10 text-sm shadow-[0_4px_24px_-10px_rgba(0,0,0,0.3)]">
                  <div>
                    <h5 className="font-bold text-white text-base">{item.name}</h5>
                    <span className="text-xs text-slate-500 font-semibold">{item.subject} • Diagnostic</span>
                  </div>
                  <span className="font-black text-neon-emerald bg-neon-emerald/10 px-3 py-1.5 rounded-xl shadow-sm">
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
}
