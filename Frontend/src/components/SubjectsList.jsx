import React, { useState } from 'react';
import { BookOpen, GraduationCap, ChevronRight, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { mockCurriculum } from '../data/mockCurriculum';
import InteractiveNeuralVortex from './ui/interactive-neural-vortex-background';

export default function SubjectsList({ profile, navigateTo, testHistory, currentSubject }) {
  const [selectedSubject, setSelectedSubject] = useState(currentSubject || null);

  // Case-insensitive lookup for class and board
  const findKey = (obj, key) => {
    if (!obj || !key) return null;
    const lowerKey = key.toString().toLowerCase();
    return Object.keys(obj).find(k => k.toLowerCase() === lowerKey);
  };

  const classKey = findKey(mockCurriculum, profile?.class) || profile?.class;
  const boardDataAll = mockCurriculum[classKey] || {};
  const boardKey = findKey(boardDataAll, profile?.board) || profile?.board;
  const boardData = boardDataAll[boardKey] || {};
  
  const subjectsList = Object.keys(boardData);

  // Helper: calculate subject details
  const getSubjectStats = (subject) => {
    const chapters = boardData[subject] || [];
    let completedChaptersCount = 0;
    let scoreSum = 0;
    let scoresCount = 0;
    let status = 'Not Started';

    chapters.forEach(ch => {
      if (testHistory[ch.id]) {
        completedChaptersCount++;
        scoreSum += testHistory[ch.id].overallScore;
        scoresCount++;
      }
    });

    const averageScore = scoresCount > 0 ? Math.round(scoreSum / scoresCount) : 0;
    if (completedChaptersCount === chapters.length && chapters.length > 0) status = 'Mastered';
    else if (completedChaptersCount > 0) status = 'In Progress';

    return {
      totalChapters: chapters.length,
      completedChapters: completedChaptersCount,
      averageScore,
      status
    };
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  if (selectedSubject) {
    const chapters = boardData[selectedSubject] || [];
    return (
      <>
        <InteractiveNeuralVortex />
        <div className="space-y-8 page-container relative z-10">
          {/* Back Button and Headers */}
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                setSelectedSubject(null);
                navigateTo('subjects', { currentSubject: null });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors w-fit border border-dark-border/60 hover:border-dark-border px-4.5 py-2.5 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Subjects
            </button>
            <div className="flex items-center justify-between mt-3">
              <div>
                <h2 className="text-4xl font-black text-white flex items-center gap-3">
                  <BookOpen className="w-10 h-10 text-neon-purple" />
                  {selectedSubject} Chapters
                </h2>
                <p className="text-slate-400 text-sm mt-1">{profile.class} • {profile.board}</p>
              </div>
              <span className="text-sm px-4 py-2 rounded-xl bg-slate-900 border border-dark-border/40 text-slate-300 font-bold shadow-md">
                {chapters.length} Chapters Total
              </span>
            </div>
          </div>

          {/* Chapters list grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chapters.map((ch, idx) => {
              const hasTestRecord = testHistory[ch.id];
              const testResult = testHistory[ch.id];
              
              let statusBadge = (
                <span className="text-xs px-3 py-1 rounded-full bg-slate-950/60 border border-dark-border/60 text-slate-500 font-bold uppercase tracking-wider">
                  Unattempted
                </span>
              );
              
              if (hasTestRecord) {
                const weakCount = testResult.weakTopics ? testResult.weakTopics.length : 0;
                if (weakCount > 0) {
                  statusBadge = (
                    <span className="text-xs px-3.5 py-1 rounded-full bg-neon-rose/10 border border-neon-rose/30 text-neon-rose font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Needs Review ({weakCount} Weak)
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="text-xs px-3.5 py-1 rounded-full bg-neon-emerald/10 border border-neon-emerald/30 text-neon-emerald font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mastered ({testResult.overallScore}%)
                    </span>
                  );
                }
              }

              return (
                <div 
                  key={ch.id} 
                  onClick={() => navigateTo('chapter', { currentSubject: selectedSubject, currentChapter: ch })}
                  className="glass-card glass-card-hover rounded-[24px] p-6 border border-dark-border/60 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Chapter {idx + 1}</span>
                      {statusBadge}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">{ch.name}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {ch.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-dark-border/40 pt-5 mt-5 text-sm">
                    <span className="text-slate-500 font-semibold">{ch.topics.length} topics included</span>
                    <span className="text-neon-purple font-extrabold group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5">
                      Enter Study Panel <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <InteractiveNeuralVortex />
      <div className="space-y-8 page-container relative z-10">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigateTo('dashboard')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors w-fit border border-dark-border/60 hover:border-dark-border px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div>
            <h2 className="text-4xl font-black text-white flex items-center gap-3">
              <GraduationCap className="w-10 h-10 text-neon-cyan" />
              Browse Subjects
            </h2>
            <p className="text-slate-400 text-sm mt-1">Select a subject portal to access chapters and practice diagnostics.</p>
          </div>
        </div>

        {/* Grid of subjects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjectsList.map(subject => {
            const stats = getSubjectStats(subject);
            
            return (
              <div 
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                className="glass-card glass-card-hover rounded-[32px] p-8 md:p-10 border border-dark-border/80 cursor-pointer flex flex-col justify-between group relative overflow-hidden h-[340px]"
              >
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-neon-purple/5 rounded-full blur-xl pointer-events-none"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    {stats.completedChapters > 0 ? (
                      <span className="text-xs px-3.5 py-1 rounded-full bg-neon-cyan/15 border border-neon-cyan/20 text-neon-cyan font-bold uppercase tracking-wider">
                        {stats.status}
                      </span>
                    ) : (
                      <span className="text-xs px-3.5 py-1 rounded-full bg-slate-900 border border-dark-border/40 text-slate-500 font-bold uppercase tracking-wider">
                        Locked
                      </span>
                    )}
                  </div>

                  <h4 className="text-2xl font-black text-white mb-2.5 group-hover:text-neon-cyan transition-colors">{subject}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Access complete course chapters, mock evaluations, and AI recommendation videos.
                  </p>
                </div>

                {/* Progress calculation */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-semibold">Chapters Tested</span>
                    <span className="font-bold text-slate-300">{stats.completedChapters} / {stats.totalChapters}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-3 rounded-full bg-slate-950 border border-dark-border/40 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-500"
                      style={{ width: `${(stats.completedChapters / Math.max(stats.totalChapters, 1)) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2.5 border-t border-dark-border/20">
                    <span className="text-slate-500 font-semibold">Average Score</span>
                    <span className="font-black text-neon-cyan">{stats.averageScore}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
