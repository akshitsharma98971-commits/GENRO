import React, { useState, useEffect } from 'react';
import MetallicBusinessCard from "./ui/metallic-business-card";
import { 
  Sparkles,
  AlertTriangle,
  User,
  X,
  Zap,
  Award,
  GraduationCap,
  School,
  ShieldCheck,
  LogOut,
  Trash2,
  BarChart3,
  TrendingUp,
  BookOpen,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { mockCurriculum } from '../data/mockCurriculum';
import AnimatedFolder from './AnimatedFolder';
import { fetchUserDashboard } from '../utils/api';

// ─── Preview image sets for each portal folder ───
const PROGRESS_PREVIEWS = [
  { id: 'pr1', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400', label: 'Score Trends' },
  { id: 'pr2', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400', label: 'Analytics' },
  { id: 'pr3', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', label: 'Performance' },
  { id: 'pr4', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400', label: 'Weak Areas' },
  { id: 'pr5', image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=400', label: 'Mastery Map' },
];

const SUBJECTS_PREVIEWS = [
  { id: 'su1', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400', label: 'Physics' },
  { id: 'su2', image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=400', label: 'Chemistry' },
  { id: 'su3', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400', label: 'Mathematics' },
  { id: 'su4', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400', label: 'Biology' },
  { id: 'su5', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400', label: 'Study Room' },
];

const CHAT_PREVIEWS = [
  { id: 'ch1', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad979?auto=format&fit=crop&q=80&w=400', label: 'AI Coach' },
  { id: 'ch2', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400', label: 'Weak Topics' },
  { id: 'ch3', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=400', label: 'Practice Q&A' },
  { id: 'ch4', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400', label: 'Explanations' },
];

const PROFILE_PREVIEWS = [
  { id: 'pf1', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400', label: 'Achievements' },
  { id: 'pf2', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400', label: 'Study Stats' },
  { id: 'pf3', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400', label: 'Account Info' },
];

export default function Dashboard({ profile, navigateTo, testHistory, onLogout, onDeleteAccount }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [apiXP, setApiXP] = useState(null);
  const [apiStreak, setApiStreak] = useState(null);

  // Fetch dashboard data from backend
  useEffect(() => {
    if (!profile.userId) return;
    fetchUserDashboard(profile.userId)
      .then(data => {
        const d = data.data || data;
        if (d.xp !== undefined) setApiXP(d.xp);
        if (d.streak !== undefined) setApiStreak(d.streak);
      })
      .catch(err => console.warn('Dashboard data fetch failed:', err));
  }, [profile.userId]);

  // Use API data if available, else use local profile
  const displayXP = apiXP !== null ? apiXP : profile.xp;
  const displayStreak = apiStreak !== null ? apiStreak : profile.streak;

  // ── Aggregate stats ──
  const totalChaptersTested = Object.keys(testHistory).length;
  let overallScoreSum = 0;
  let totalTopicsScored = 0;
  let weakTopicsCount = 0;
  let strongTopicsCount = 0;

  Object.values(testHistory).forEach(res => {
    if (res && res.topicScores) {
      Object.values(res.topicScores).forEach(score => {
        overallScoreSum += score;
        totalTopicsScored++;
        if (score < 70) weakTopicsCount++;
        else strongTopicsCount++;
      });
    }
  });

  const aggregateProgress = totalTopicsScored > 0
    ? Math.round(overallScoreSum / totalTopicsScored)
    : 0;

  const activeBoardCurriculum = mockCurriculum[profile.class]?.[profile.board] || {};
  const activeSubjects = Object.keys(activeBoardCurriculum);

  const activeWeakTopics = [];
  Object.entries(testHistory).forEach(([chId, res]) => {
    const chObj = Object.values(activeBoardCurriculum).flatMap(ch => ch).find(c => c.id === chId);
    if (res && res.topicScores && chObj) {
      Object.entries(res.topicScores).forEach(([tId, score]) => {
        if (score < 70) {
          const topicObj = chObj.topics.find(t => t.id === tId);
          if (topicObj && !activeWeakTopics.includes(topicObj.name)) activeWeakTopics.push(topicObj.name);
        }
      });
    }
  });

  const hasTested = Object.keys(testHistory).length > 0;

  let mascotMessage = "Welcome to Genro! I am your AI Coach. Take your first Subject Diagnostic quiz, and I will customize a visual learning loop specifically for you. Let's do this! 🚀";
  if (hasTested) {
    mascotMessage = activeWeakTopics.length > 0
      ? `Coach report: We've identified some learning gaps in ${activeWeakTopics.slice(0, 2).join(', ')}. Don't sweat it—I've constructed target review videos! 🛡️`
      : "Phenomenal status! You've mastered all attempted topics with flying colors (70%+). 🏆";
  }

  const initials = profile.name
    ? profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className="space-y-10 page-container">

      {/* ── Hero ── */}
      <section className="relative text-center pt-16 md:pt-24 pb-6 space-y-6 max-w-4xl mx-auto z-10 px-6">

        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
          Harness the Power of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple">AI-Powered Learning.</span>
        </h2>
        <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Welcome back, <strong className="text-white font-bold">{profile.name}</strong>. Discover a smarter way to analyze your conceptual weaknesses, study with interactive visual lectures, and track your progress in real time.
        </p>
      </section>

      {/* ── Weakness Alert ── */}
      {weakTopicsCount > 0 && (
        <div className="bg-neon-rose/5 border border-neon-rose/30 rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-float">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neon-rose/10 flex items-center justify-center text-neon-rose shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-base">Critical Revision Modules Available</h5>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                We've identified <strong className="text-neon-rose">{weakTopicsCount} topics</strong> scoring below 70%. Watch the AI-generated concept videos to get back on track.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('progress')}
            className="px-5 py-3 rounded-xl bg-neon-rose/15 hover:bg-neon-rose/25 text-neon-rose border border-neon-rose/30 font-bold text-sm transition-all cursor-pointer whitespace-nowrap"
          >
            Review Weaknesses
          </button>
        </div>
      )}

      {/* ── 3D Folder Portal Grid ── */}
      <div className="space-y-5 mt-40">

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Progress Report */}
          <AnimatedFolder
            title="Progress Report"
            subtitle="Learning curve, mastery & evaluation charts"
            icon={<TrendingUp size={36} />}
            accentColor="#10b981"
            previews={PROGRESS_PREVIEWS}
            onClick={() => navigateTo('progress')}
          />

          {/* Subject Syllabus */}
          <AnimatedFolder
            title="Subject Syllabus"
            subtitle={`Browse ${activeSubjects.length > 0 ? activeSubjects.join(', ') : 'all subjects'}`}
            icon={<BookOpen size={36} />}
            accentColor="#a855f7"
            previews={SUBJECTS_PREVIEWS}
            onClick={() => navigateTo('subjects', { currentSubject: null })}
          />

          {/* AI Chat */}
          <AnimatedFolder
            title="Genro AI Chat"
            subtitle="AI tutor shaped by your weak areas"
            icon={<MessageSquare size={36} />}
            accentColor="#06b6d4"
            previews={CHAT_PREVIEWS}
            onClick={() => navigateTo('chatbot')}
          />

          {/* My Profile */}
          <AnimatedFolder
            title="My Profile"
            subtitle={`${profile.name} · Class ${profile.class} · ${profile.board}`}
            icon={<User size={36} />}
            accentColor="#f43f5e"
            previews={PROFILE_PREVIEWS}
            onClick={() => setShowProfile(true)}
          />

        </div>
      </div>


      {/* ── Profile Modal ── */}
      {showProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowProfile(false); setShowDeleteConfirm(false); } }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <div className="relative w-full flex justify-center items-center pointer-events-none">
            <div className="relative pointer-events-auto">
              {/* Close button */}
              <button
                onClick={() => { setShowProfile(false); setShowDeleteConfirm(false); }}
                className="absolute -top-12 right-0 w-9 h-9 rounded-xl bg-slate-900/80 border border-dark-border/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer z-50"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Metallic Business Card */}
              <MetallicBusinessCard
                name={profile.name}
                role={`${profile.class} • ${profile.board}`}
                company={null}
                email={profile.email}
                metal="gold"
                width={420}
              >
                {!showDeleteConfirm ? (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowProfile(false); onLogout(); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-dark-border/60 hover:border-dark-border text-white font-bold text-sm transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neon-rose/5 hover:bg-neon-rose/10 border border-neon-rose/20 hover:border-neon-rose/40 text-neon-rose font-bold text-sm transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </>
                ) : (
                  <div className="space-y-3 mt-2">
                    <div className="bg-neon-rose/5 border border-neon-rose/30 rounded-xl p-3 text-center">
                      <p className="text-white font-bold text-xs mb-1">Delete your account?</p>
                      <p className="text-slate-400 text-[10px] leading-tight">
                        This will permanently erase all your progress.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }}
                        className="flex-1 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-dark-border/60 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowProfile(false); setShowDeleteConfirm(false); onDeleteAccount(); }}
                        className="flex-1 py-2 rounded-xl bg-neon-rose/15 hover:bg-neon-rose/25 border border-neon-rose/40 text-neon-rose font-bold text-xs transition-all cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                )}
              </MetallicBusinessCard>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
