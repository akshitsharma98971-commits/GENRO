import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Sparkles, HelpCircle, ArrowRight, ArrowLeft, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { evaluateChapterTest, getTopicQuestions, evaluateTopicTest } from '../utils/mockAIEngine';
import { fetchTopicTest } from '../utils/api';

export default function TestScreen({ 
  profile, 
  chapter, 
  topic, 
  subtopic,
  mode, // 'chapter' | 'topic' | 'subtopic'
  navigateTo, 
  onTestComplete 
}) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedIndex }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const cardRef = useRef(null);
  const loaderRef = useRef(null);

  // ── Normalize questions from API or fallback ──────────────────────────────

  /**
   * The API may return questions in various shapes. This normalizes them to:
   * { id, topicId, question, options: [], answerIndex, explanation }
   */
  function normalizeQuestions(rawQuestions, topicId) {
    return rawQuestions.map((q, i) => ({
      id: q.id || q._id || `${topicId}-q${i}`,
      topicId: q.topicId || q.topic_id || topicId,
      question: q.question || q.question_text || q.text || `Question ${i + 1}`,
      options: q.options || q.choices || ['Option A', 'Option B', 'Option C', 'Option D'],
      answerIndex: q.answerIndex ?? q.answer_index ?? q.correct_option ?? 0,
      explanation: q.explanation || q.hint || '',
    }));
  }

  // ── Fetch questions from API ──────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setIsLoadingQuestions(true);
      setLoadError(null);
      try {
        if (mode === 'chapter') {
          // Fetch questions for ALL topics in this chapter, then aggregate
          const topics = chapter.topics || [];
          const results = await Promise.all(
            topics.map(t => fetchTopicTest(t.id).catch(() => null))
          );
          if (cancelled) return;

          let aggregated = [];
          results.forEach((data, idx) => {
            if (data) {
              // API may return array directly, or { questions: [] }, or { data: [] }
              const raw = Array.isArray(data) ? data : (data.questions || data.data || []);
              const topicId = topics[idx].id;
              aggregated = [...aggregated, ...normalizeQuestions(raw, topicId)];
            }
          });

          // Fallback: use local mock if API returned nothing
          if (aggregated.length === 0) {
            topics.forEach(t => {
              aggregated.push(...getTopicQuestions(t.id).map(q => ({ ...q, topicId: t.id })));
            });
          }
          setQuestions(aggregated);

        } else if (mode === 'topic') {
          const data = await fetchTopicTest(topic.id).catch(() => null);
          if (cancelled) return;
          if (data) {
            const raw = Array.isArray(data) ? data : (data.questions || data.data || []);
            const normalized = normalizeQuestions(raw, topic.id);
            setQuestions(normalized.length > 0 ? normalized : getTopicQuestions(topic.id));
          } else {
            setQuestions(getTopicQuestions(topic.id));
          }
        } else if (mode === 'subtopic') {
          // Subtopic tests: fallback to mock
          const mockQs = Array.from({ length: 3 }).map((_, i) => ({
            id: `mock-sub-${subtopic.id}-${i}`,
            topicId: topic.id,
            subtopicId: subtopic.id,
            question: `Test Question ${i + 1} for ${subtopic.name}: Which of the following is correct?`,
            options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
            answerIndex: 0,
            explanation: `Explanation for ${subtopic.name} question ${i + 1}.`,
          }));
          if (!cancelled) setQuestions(mockQs);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load questions:', err);
          setLoadError('Questions load karne mein problem aayi. Local questions use kar rahe hain.');
          // Fallback to local mock
          if (mode === 'chapter') {
            let agg = [];
            (chapter.topics || []).forEach(t => {
              agg.push(...getTopicQuestions(t.id).map(q => ({ ...q, topicId: t.id })));
            });
            setQuestions(agg);
          } else if (mode === 'topic') {
            setQuestions(getTopicQuestions(topic.id));
          }
        }
      } finally {
        if (!cancelled) setIsLoadingQuestions(false);
      }
    }

    loadQuestions();
    return () => { cancelled = true; };
  }, [chapter, topic, subtopic, mode]);

  // Question transitions
  useEffect(() => {
    if (cardRef.current && questions.length > 0) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [currentIndex, questions]);

  const selectOption = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Animate loader
    setTimeout(() => setLoaderMessage('NST Genro grading answers...'), 0);
    setTimeout(() => setLoaderMessage('Mapping responses to curriculum graph...'), 900);
    setTimeout(() => setLoaderMessage('Analyzing weakness profiles...'), 1800);

    setTimeout(() => {
      if (mode === 'chapter') {
        const evaluation = evaluateChapterTest(answers, questions);
        onTestComplete(evaluation);
      } else if (mode === 'topic') {
        const evaluation = evaluateTopicTest(answers, questions);
        onTestComplete(evaluation);
      } else if (mode === 'subtopic') {
        // Mock evaluation for subtopic test
        const correctCount = questions.filter(q => answers[q.id] === q.answerIndex).length;
        const score = Math.round((correctCount / questions.length) * 100);
        onTestComplete({ score });
      }
    }, 2800);
  };

  const activeQuestion = questions.length > 0 ? questions[currentIndex] : null;
  const selectedOption = activeQuestion ? answers[activeQuestion.id] : undefined;
  const isLastQuestion = currentIndex === questions.length - 1;
  const isQuestionAnswered = selectedOption !== undefined;

  return (
    <div className="page-container w-full h-full flex flex-col">
      {isLoadingQuestions ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] flex-1 gap-4">
          <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
          <p className="text-slate-400 font-semibold text-sm">Loading test questions from server...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="flex items-center justify-center min-h-[300px] flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neon-purple"></div>
        </div>
      ) : isSubmitting ? (
        <div 
          ref={loaderRef}
          className="flex-1 flex flex-col items-center justify-center text-center p-8"
        >
          {/* Glowing Neural Net Simulator */}
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-neon-purple/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-4 border-neon-cyan/30 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-white mb-2">Genro AI Engine Active</h3>
          <p className="text-sm text-neon-cyan font-semibold tracking-wider uppercase h-6 animate-pulse">
            {loaderMessage}
          </p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full space-y-8 pb-10">
      {/* Back to Chapter */}
      <button 
        onClick={() => navigateTo('chapter')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors w-fit border border-dark-border/60 hover:border-dark-border px-4 py-2.5 rounded-xl cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Chapter
      </button>

      {/* Error banner if API failed and using fallback */}
      {loadError && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-900/20 border border-amber-500/30 text-amber-400 text-sm font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {loadError}
        </div>
      )}

      {/* Test Header */}
      <div className="flex items-center justify-between border-b border-dark-border/40 pb-5">
        <div>
          <span className="text-xs text-neon-cyan font-bold tracking-widest uppercase px-3 py-1 bg-slate-900 border border-dark-border/40 rounded-xl">
            {mode === 'chapter' ? 'Chapter Evaluation' : mode === 'subtopic' ? 'Subtopic Test' : 'Topic Retest'}
          </span>
          <h2 className="text-2xl font-black text-white mt-2.5">
            {mode === 'chapter' ? chapter.name : mode === 'subtopic' ? subtopic.name : topic.name}
          </h2>
        </div>
        <div className="text-sm text-slate-400 font-bold bg-slate-900 border border-dark-border/40 px-4 py-2.5 rounded-xl">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-950 border border-dark-border/40 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div 
        ref={cardRef}
        className="glass-card rounded-[32px] p-10 md:p-12 border border-dark-border/80 shadow-2xl space-y-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            <HelpCircle className="w-7 h-7" />
          </div>
          <p className="text-white font-bold text-lg md:text-xl leading-relaxed">
            {activeQuestion.question}
          </p>
        </div>

        {/* Options list */}
        <div className="space-y-4 pt-2">
          {activeQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => selectOption(activeQuestion.id, idx)}
                className={`w-full text-left px-6 py-5 rounded-2xl border-2 text-base md:text-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? 'border-neon-purple bg-neon-purple/10 text-white glow-purple' 
                    : 'border-dark-border/60 hover:border-slate-700 bg-slate-900/40 text-slate-300'
                }`}
              >
                <span>{option}</span>
                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-neon-purple text-white flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-4 rounded-xl border border-dark-border/60 text-sm font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-900/30 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            disabled={!isQuestionAnswered}
            className="px-7 py-4 rounded-xl bg-slate-900 border border-dark-border/60 text-sm font-bold text-slate-200 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            Next
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isQuestionAnswered}
            className="px-10 py-4.5 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white text-base font-black shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:pointer-events-none hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
          >
            Submit Answers
            <Sparkles className="w-5 h-5" />
          </button>
        )}
      </div>
      </div>
      )}
    </div>
  );
}
