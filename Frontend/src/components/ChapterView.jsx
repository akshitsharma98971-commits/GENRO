import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import TestPopup from './TestPopup';
import InteractiveNeuralVortex from './ui/interactive-neural-vortex-background';

export default function ChapterView({ 
  profile, 
  subjectName, 
  chapter, 
  subtopicTestHistory, 
  navigateTo, 
  onWatchVideo 
}) {
  const [expandedTopics, setExpandedTopics] = useState({});
  const [selectedTestContext, setSelectedTestContext] = useState(null);

  if (!chapter) return null;

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handleTakeSubtopicTestClick = (topic, subtopic) => {
    setSelectedTestContext({ mode: 'subtopic', topic, subtopic });
  };

  const handleTakeChapterTestClick = () => {
    setSelectedTestContext({ mode: 'chapter', topic: { name: chapter.name } });
  };

  const confirmStartTest = () => {
    const { mode, topic, subtopic } = selectedTestContext;
    setSelectedTestContext(null);
    navigateTo('test', { 
      currentSubject: subjectName, 
      currentChapter: chapter, 
      currentTopic: mode === 'chapter' ? null : topic, 
      currentSubtopic: subtopic,
      testMode: mode || 'subtopic' 
    });
  };

  return (
    <>
      <InteractiveNeuralVortex />
      <div className="space-y-8 page-container relative z-10">
        {/* Back to Subject */}
        <button 
          onClick={() => navigateTo('subjects')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors w-fit border border-dark-border/60 hover:border-dark-border px-4.5 py-2.5 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to chapters
        </button>

        {/* Chapter Overview Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-dark-border/40 pb-6">
          <div>
            <span className="text-sm text-neon-cyan font-bold uppercase tracking-wider">{subjectName}</span>
            <h2 className="text-4xl font-black text-white mt-1.5">{chapter.name}</h2>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-3xl leading-relaxed">{chapter.description}</p>
          </div>
          <button 
            onClick={handleTakeChapterTestClick}
            className="px-6 py-3 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] shrink-0"
          >
            Take Chapter Test
          </button>
        </div>

        <div className="space-y-4">
          {chapter.topics.map(topic => {
            const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
            const isExpanded = expandedTopics[topic.id];
            
            // If no subtopics, we use the topic itself for testing/history
            const history = !hasSubtopics && subtopicTestHistory ? subtopicTestHistory[topic.id] : null;
            const score = history?.score;
            const hasScore = score !== undefined;
            const isWeak = hasScore && score < 70;

            return (
              <div key={topic.id} className={`glass-card rounded-[24px] border ${!hasSubtopics && isWeak ? 'border-neon-rose/30 bg-neon-rose/[0.02]' : 'border-dark-border/60'} overflow-hidden transition-all duration-300`}>
                 <div 
                   onClick={() => hasSubtopics ? toggleTopic(topic.id) : null}
                   className={`p-6 md:p-8 flex items-center justify-between ${hasSubtopics ? 'cursor-pointer hover:bg-white/[0.02]' : ''} transition-colors`}
                 >
                   <div>
                     <h3 className="text-xl font-bold text-white">{topic.name}</h3>
                     {topic.description && <p className="text-sm text-slate-400 mt-1">{topic.description}</p>}
                     
                     {!hasSubtopics && hasScore && (
                       <span className={`inline-flex items-center gap-1.5 mt-2 text-xs font-bold ${isWeak ? 'text-neon-rose' : 'text-neon-cyan'}`}>
                         {isWeak ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                         Score: {score}%
                       </span>
                     )}
                   </div>
                   
                   {hasSubtopics ? (
                     <div className="text-slate-400">
                       {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                     </div>
                   ) : (
                     <div className="flex items-center gap-2 shrink-0 mt-3 md:mt-0">
                       <button 
                         onClick={() => onWatchVideo(topic)}
                         className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors flex items-center gap-2"
                         title="Watch Tutorial"
                       >
                         <Play className="w-4 h-4" /> Watch Video
                       </button>
                     </div>
                   )}
                 </div>
                 
                 {hasSubtopics && isExpanded && (
                   <div className="border-t border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 md:p-8 space-y-4">
                     {topic.subtopics.map(subtopic => {
                        const subHistory = subtopicTestHistory ? subtopicTestHistory[subtopic.id] : null;
                        const subScore = subHistory?.score;
                        const subHasScore = subScore !== undefined;
                        const subIsWeak = subHasScore && subScore < 70;

                        return (
                          <div key={subtopic.id} className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border ${subIsWeak ? 'border-neon-rose/30 bg-neon-rose/[0.02] backdrop-blur-md' : 'border-white/10 bg-white/[0.03] backdrop-blur-md'} transition-colors shadow-[0_4px_24px_-10px_rgba(0,0,0,0.3)]`}>
                            <div className="flex-1">
                              <h4 className="text-white font-bold mb-1.5">{subtopic.name}</h4>
                              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                {subtopic.duration && <span>{subtopic.duration}</span>}
                                {subHasScore && (
                                  <span className={`flex items-center gap-1.5 ${subIsWeak ? 'text-neon-rose' : 'text-neon-cyan'}`}>
                                    {subIsWeak ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    Score: {subScore}%
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 mt-3 md:mt-0">
                              <button 
                                onClick={() => onWatchVideo(topic)}
                                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors flex items-center gap-2"
                                title="Watch Tutorial"
                              >
                                <Play className="w-4 h-4" /> Watch Video
                              </button>
                            </div>
                          </div>
                        );
                     })}
                   </div>
                 )}
              </div>
            );
          })}
        </div>
        
        {selectedTestContext && (
          <TestPopup 
            topic={selectedTestContext.topic}
            subtopic={selectedTestContext.subtopic}
            onClose={() => setSelectedTestContext(null)}
            onStartTest={confirmStartTest}
          />
        )}
      </div>
    </>
  );
}
