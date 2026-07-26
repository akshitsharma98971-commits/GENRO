import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  LogOut, 
  User, 
  Zap, 
  Award,
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

import LoginSignup from './components/LoginSignup';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SubjectsList from './components/SubjectsList';
import ChapterView from './components/ChapterView';
import TestScreen from './components/TestScreen';
import AIEvaluation from './components/AIEvaluation';
import ProgressTracker from './components/ProgressTracker';
import AIChatbot from './components/AIChatbot';
import VideoPopup from './components/VideoPopup';
import VideoPlayer from './components/VideoPlayer';

import { mockCurriculum } from './data/mockCurriculum';
import { saveProgress } from './utils/api';

import heroBackdrop from './hero-backdrop.jpg';
import ParticlesBackground from './components/ParticlesBackground';

export default function App() {
  // --- States ---
  const [profile, setProfile] = useState({
    name: '',
    class: '',
    board: '',
    isLoggedIn: false,
    onboarded: false,
    xp: 0,
    streak: 0
  });

  const [navigation, setNavigation] = useState({
    view: 'landing', // landing | login | dashboard | subjects | chapter | test | evaluation | progress | chatbot | video
    currentSubject: null,
    currentChapter: null,
    currentTopic: null,
    currentSubtopic: null,
    testMode: 'chapter', // chapter | topic | subtopic
    authMode: 'signup',  // signup | login
  });

  const [testHistory, setTestHistory] = useState({}); // { [chapterId]: evaluationResult }
  const [topicTestHistory, setTopicTestHistory] = useState({}); // { [topicId]: { score, attempts } }
  const [subtopicTestHistory, setSubtopicTestHistory] = useState({}); // { [subtopicId]: { score, attempts } }
  
  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      text: "Hey there! 👋 I am your Genro AI Coach. I'll automatically analyze your performance when you take quizzes, and customize lesson plans for you. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  // Video and Recommendation States
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [recommendedTopic, setRecommendedTopic] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null); // { topicId, title, ... }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerRef = useRef(null);

  // Load profile and navigation from localStorage on mount to persist active login session and exact page position
  useEffect(() => {
    const savedProfile = localStorage.getItem('genro_profile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile && parsedProfile.isLoggedIn) {
          setProfile(parsedProfile);
          
          // Restore navigation view state if available
          const savedNav = localStorage.getItem('genro_navigation');
          if (savedNav) {
            try {
              const parsedNav = JSON.parse(savedNav);
              if (parsedNav) {
                setNavigation(parsedNav);
                return;
              }
            } catch (navErr) {
              console.warn('Error restoring navigation:', navErr);
            }
          }
          
          setNavigation(prev => ({ ...prev, view: 'dashboard' }));
        }
      } catch (error) {
        console.warn('Error restoring session from localStorage:', error);
      }
    }
  }, []);

  // Sync navigation updates to localStorage
  useEffect(() => {
    if (profile.isLoggedIn) {
      localStorage.setItem('genro_navigation', JSON.stringify(navigation));
    }
  }, [navigation, profile.isLoggedIn]);

  // --- GSAP Page transition ---
  useEffect(() => {
    if (containerRef.current) {
      // Fade and slide transition on page view change
      gsap.fromTo(
        containerRef.current.querySelectorAll('.page-container'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  }, [navigation.view]);

  // --- Handlers ---
  const handleLogin = (name, className, boardName, userId, email) => {
    const newProfile = {
      name,
      class: className,
      board: boardName,
      isLoggedIn: true,
      onboarded: true,
      xp: 150,
      streak: 1,
      userId: userId || null,
      email: email || '',
    };
    setProfile(newProfile);
    
    // Save session to localStorage
    localStorage.setItem('genro_profile', JSON.stringify(newProfile));
    
    setNavigation({ ...navigation, view: 'dashboard' });
  };

  const handleLogout = () => {
    setProfile({
      name: '',
      class: '',
      board: '',
      isLoggedIn: false,
      onboarded: false,
      xp: 0,
      streak: 0
    });
    setTestHistory({});
    setTopicTestHistory({});
    
    // Clear session and navigation from localStorage
    localStorage.removeItem('genro_profile');
    localStorage.removeItem('genro_navigation');
    
    setNavigation({ view: 'landing', currentSubject: null, currentChapter: null, currentTopic: null, authMode: 'signup' });
  };

  const handleDeleteAccount = () => {
    // Clear all state and return to login
    setProfile({
      name: '',
      class: '',
      board: '',
      isLoggedIn: false,
      onboarded: false,
      xp: 0,
      streak: 0
    });
    setTestHistory({});
    setTopicTestHistory({});
    setChatMessages([
      {
        id: 'welcome',
        text: "Hey there! 👋 I am your Genro AI Coach. I'll automatically analyze your performance when you take quizzes, and customize lesson plans for you. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    
    // Clear session and navigation from localStorage
    localStorage.removeItem('genro_profile');
    localStorage.removeItem('genro_navigation');
    
    setNavigation({ view: 'landing', currentSubject: null, currentChapter: null, currentTopic: null, authMode: 'signup' });
  };

  const navigateTo = (view, extra = {}) => {
    setNavigation(prev => ({
      ...prev,
      view,
      ...extra
    }));
    setMobileMenuOpen(false);
  };

  // Add XP
  const addXP = (amount) => {
    setProfile(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  // Renders the main active section
  const renderActiveView = () => {
    switch (navigation.view) {
      case 'landing':
        return (
          <LandingPage 
            onNavigateToAuth={(mode) => navigateTo('login', { authMode: mode })} 
          />
        );
      case 'login':
        return <LoginSignup onLogin={handleLogin} initialMode={navigation.authMode} />;
      case 'dashboard':
        return (
          <Dashboard 
            profile={profile} 
            navigateTo={navigateTo} 
            testHistory={testHistory}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        );
      case 'subjects':
        return (
          <SubjectsList 
            profile={profile} 
            navigateTo={navigateTo} 
            testHistory={testHistory}
            currentSubject={navigation.currentSubject}
          />
        );
      case 'chapter':
        return (
          <ChapterView 
            profile={profile}
            subjectName={navigation.currentSubject}
            chapter={navigation.currentChapter}
            testHistory={testHistory}
            topicTestHistory={topicTestHistory}
            subtopicTestHistory={subtopicTestHistory}
            navigateTo={navigateTo}
            onWatchVideo={(topic) => {
              setActiveVideo(topic);
              navigateTo('video');
            }}
          />
        );
      case 'test':
        return (
          <TestScreen 
            profile={profile}
            chapter={navigation.currentChapter}
            topic={navigation.currentTopic}
            subtopic={navigation.currentSubtopic}
            mode={navigation.testMode}
            navigateTo={navigateTo}
            onTestComplete={(result) => {
              if (navigation.testMode === 'chapter') {
                const evaluation = result;
                setTestHistory(prev => ({
                  ...prev,
                  [navigation.currentChapter.id]: evaluation
                }));
                if (evaluation.weakTopics && evaluation.weakTopics.length > 0) {
                  const weakTopicId = evaluation.weakTopics[0];
                  const topicObj = navigation.currentChapter.topics.find(t => t.id === weakTopicId);
                  if (topicObj) {
                    setRecommendedTopic({
                      ...topicObj,
                      chapterId: navigation.currentChapter.id
                    });
                    setShowVideoPopup(true);
                  }
                }
                const xpEarned = 100 + evaluation.overallScore;
                addXP(xpEarned);
                // Save progress to backend
                if (profile.userId) {
                  saveProgress(profile.userId, {
                    chapter_id: navigation.currentChapter.id,
                    subject: navigation.currentSubject,
                    accuracy_percentage: evaluation.overallScore,
                    status: evaluation.overallScore >= 70 ? 'Mastered' : 'Needs Review',
                    xp_earned: xpEarned,
                  }).catch(err => console.warn('Progress save failed:', err));
                }
                navigateTo('evaluation', { currentChapter: navigation.currentChapter });
              } else if (navigation.testMode === 'topic') {
                setTopicTestHistory(prev => {
                  const prevRecord = prev[navigation.currentTopic.id] || { attempts: 0 };
                  return {
                    ...prev,
                    [navigation.currentTopic.id]: {
                      score: result.score,
                      attempts: prevRecord.attempts + 1
                    }
                  };
                });
                
                if (testHistory[navigation.currentChapter.id]) {
                  const currentResult = testHistory[navigation.currentChapter.id];
                  const updatedTopicScores = {
                    ...currentResult.topicScores,
                    [navigation.currentTopic.id]: result.score
                  };
                  
                  const updatedWeak = [...currentResult.weakTopics].filter(tId => tId !== navigation.currentTopic.id);
                  const updatedStrong = [...currentResult.strongTopics];
                  
                  if (result.score < 70) {
                    if (!updatedWeak.includes(navigation.currentTopic.id)) updatedWeak.push(navigation.currentTopic.id);
                  } else {
                    if (!updatedStrong.includes(navigation.currentTopic.id)) updatedStrong.push(navigation.currentTopic.id);
                  }
                  
                  const scoreValues = Object.values(updatedTopicScores);
                  const newOverall = Math.round(scoreValues.reduce((a,b) => a+b, 0) / scoreValues.length);

                  setTestHistory(prev => ({
                    ...prev,
                    [navigation.currentChapter.id]: {
                      ...currentResult,
                      overallScore: newOverall,
                      topicScores: updatedTopicScores,
                      weakTopics: updatedWeak,
                      strongTopics: updatedStrong
                    }
                  }));
                } else {
                  const initialTopicScores = { [navigation.currentTopic.id]: result.score };
                  setTestHistory(prev => ({
                    ...prev,
                    [navigation.currentChapter.id]: {
                      overallScore: result.score,
                      topicScores: initialTopicScores,
                      weakTopics: result.score < 70 ? [navigation.currentTopic.id] : [],
                      strongTopics: result.score >= 70 ? [navigation.currentTopic.id] : []
                    }
                  }));
                }

                addXP(50 + result.score);
                navigateTo('chapter', { currentChapter: navigation.currentChapter });
              } else if (navigation.testMode === 'subtopic') {
                setSubtopicTestHistory(prev => {
                  const prevRecord = prev[navigation.currentSubtopic.id] || { attempts: 0 };
                  return {
                    ...prev,
                    [navigation.currentSubtopic.id]: {
                      score: result.score,
                      attempts: prevRecord.attempts + 1
                    }
                  };
                });
                
                addXP(10 + result.score);
                
                if (result.score < 70) {
                  setRecommendedTopic({
                    ...navigation.currentSubtopic,
                    chapterId: navigation.currentChapter.id,
                    topicId: navigation.currentTopic.id
                  });
                  setShowVideoPopup(true);
                }
                
                navigateTo('chapter');
              }
            }}
          />
        );
      case 'evaluation':
        return (
          <AIEvaluation 
            chapter={navigation.currentChapter}
            result={testHistory[navigation.currentChapter.id]}
            navigateTo={navigateTo}
            onWatchVideo={(topic) => {
              setActiveVideo(topic);
              navigateTo('video');
            }}
          />
        );
      case 'progress':
        return (
          <ProgressTracker 
            profile={profile}
            testHistory={testHistory}
            topicTestHistory={topicTestHistory}
            navigateTo={navigateTo}
          />
        );
      case 'chatbot':
        return (
          <AIChatbot 
            profile={profile}
            testHistory={testHistory}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            navigateTo={navigateTo}
            userId={profile.userId}
          />
        );
      case 'video':
        return (
          <VideoPlayer 
            topic={activeVideo}
            chapter={navigation.currentChapter}
            navigateTo={navigateTo}
          />
        );
      default:
        return <Dashboard profile={profile} navigateTo={navigateTo} testHistory={testHistory} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030008] text-slate-100 flex flex-col relative font-sans overflow-x-hidden">
      
      {['dashboard'].includes(navigation.view) && (
        <>
          {/* Page-level centered background image (No crop, fully visible) */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden bg-[#030008]">
            <img 
              src={heroBackdrop} 
              className="w-full h-full max-w-full max-h-full object-contain filter saturate-[1.1] contrast-[1.05] brightness-[1.0]" 
              alt="Wallpaper Backdrop" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030008] via-transparent to-transparent opacity-25"></div>
          </div>

          {/* Animated Particles & Mesh Background */}
          <ParticlesBackground />

          {/* Symmetric Glowing Neon Vector Waves */}
          <svg className="absolute top-[260px] left-0 right-0 w-full h-32 pointer-events-none opacity-40 z-0" viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none">
            <path d="M0,50 Q360,95 720,40 T1440,60" stroke="url(#waveGrad1)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M0,60 Q360,25 720,70 T1440,30" stroke="url(#waveGrad2)" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="25%" stopColor="#a855f7" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.85" />
                <stop offset="75%" stopColor="#a855f7" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                <stop offset="35%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.7" />
                <stop offset="65%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </>
      )}


      {profile.isLoggedIn ? (
        <div className="flex flex-col min-h-screen relative z-10">
          
          {/* --- MAIN CONTENT WINDOW --- */}
          <main ref={containerRef} className="flex-1 flex flex-col min-w-0 p-4 md:p-8 overflow-y-auto">
            {renderActiveView()}
          </main>

        </div>
      ) : navigation.view === 'landing' ? (
        <LandingPage 
          onNavigateToAuth={(mode) => navigateTo('login', { authMode: mode })} 
        />
      ) : (
        /* Login Screen Layout */
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginSignup onLogin={handleLogin} initialMode={navigation.authMode} />
        </main>
      )}



      {/* --- AI VIDEO POPUP RECOMMENDATION --- */}
      {showVideoPopup && recommendedTopic && (
        <VideoPopup 
          topic={recommendedTopic} 
          onClose={() => setShowVideoPopup(false)}
          onWatch={() => {
            setShowVideoPopup(false);
            setActiveVideo(recommendedTopic);
            navigateTo('video');
          }}
        />
      )}
    </div>
  );
}
