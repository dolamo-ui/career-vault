import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sparkles, Loader2, CheckCircle2,
  AlertCircle, Brain, RefreshCw,
} from 'lucide-react';
import type { JobApplication } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
}
const Button: React.FC<ButtonProps> = ({ variant = 'solid', className = '', disabled, children, ...props }) => {
  const base = 'inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    solid:   'bg-[#1A1A1A] text-white hover:bg-[#333] shadow-lg shadow-black/10',
    outline: 'border border-black/[0.10] text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-black/[0.03]',
    ghost:   'text-[#C5A059] hover:bg-[#C5A059]/[0.06]',
  };
  return (
    <button disabled={disabled} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-4 py-3 bg-black/[0.02] border border-black/[0.08] rounded-xl text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]/40 transition-all resize-none ${className}`}
    {...props}
  />
);

interface FeedbackResult {
  strengths:        string;
  improvements:     string;
  rating:           number;
  suggested_answer: string;
}
interface AnswerRecord {
  question: string;
  answer:   string;
  feedback: FeedbackResult;
}

// ─────────────────────────────────────────────────────────────────────────────
// Groq API
// ─────────────────────────────────────────────────────────────────────────────
async function callGroq(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY is missing from your .env file');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:       'llama-3.3-70b-versatile', // ✅ Fixed: updated from decommissioned llama3-8b-8192
      max_tokens:  1000,
      temperature: 0.7,
      messages:    [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `Groq API error ${response.status}`);
  }

  const data = await response.json();
  return (data.choices?.[0]?.message?.content as string) ?? '';
}

function parseJSON<T>(raw: string): T | null {
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim()) as T;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// InterviewPrep Page
// ─────────────────────────────────────────────────────────────────────────────
export default function InterviewPrep() {
  const location = useLocation();
  const navigate = useNavigate();

  const job = location.state?.job as JobApplication | undefined;

  const [loading, setLoading]                           = useState(false);
  const [questions, setQuestions]                       = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer]                     = useState('');
  const [feedback, setFeedback]                         = useState<FeedbackResult | null>(null);
  const [showFeedback, setShowFeedback]                 = useState(false);
  const [allAnswers, setAllAnswers]                     = useState<AnswerRecord[]>([]);
  const [error, setError]                               = useState<string | null>(null);

  useEffect(() => {
    if (job) generateQuestions();
  }, []);

  // ── Generate 5 questions via Groq ─────────────────────────────────────────
  const generateQuestions = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const raw = await callGroq(
        `Generate 10 realistic interview questions for a ${job!.title} position at ${job!.company}.
Include a mix of technical, behavioural, and situational questions.
Respond ONLY with valid JSON — no explanation, no markdown, no extra text:
{"questions":["question 1","question 2","question 3","question 4","question 5","question 6","question 7","question 8","question 9","question 10"]}`
      );
      const parsed = parseJSON<{ questions: string[] }>(raw);
      if (parsed?.questions?.length) {
        setQuestions(parsed.questions);
      } else {
        setError('Could not parse questions. Please try again.');
      }
    } catch (err) {
      setError(`Failed to generate questions: ${(err as Error).message}`);
    }
    setLoading(false);
  };

  // ── Submit answer + get feedback via Groq ────────────────────────────────
  const submitAnswer = async (): Promise<void> => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const raw = await callGroq(
        `You are an expert interview coach. Evaluate this interview answer.

Question: ${questions[currentQuestionIndex]}
Candidate's Answer: ${userAnswer}
Role: ${job!.title} at ${job!.company}

Respond ONLY with valid JSON — no explanation, no markdown, no extra text:
{"strengths":"specific strengths of the answer","improvements":"specific areas to improve","rating":7,"suggested_answer":"a strong example answer"}`
      );
      const parsed = parseJSON<FeedbackResult>(raw);
      if (parsed) {
        setFeedback(parsed);
        setShowFeedback(true);
        setAllAnswers((prev) => [
          ...prev,
          { question: questions[currentQuestionIndex], answer: userAnswer, feedback: parsed },
        ]);
      } else {
        setError('Could not parse feedback. Please try again.');
      }
    } catch (err) {
      setError(`Failed to get feedback: ${(err as Error).message}`);
    }
    setLoading(false);
  };

  const nextQuestion = (): void => {
    setShowFeedback(false);
    setFeedback(null);
    setUserAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    }
  };

  const resetSession = (): void => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setShowFeedback(false);
    setAllAnswers([]);
    setQuestions([]);
    generateQuestions();
  };

  const isComplete = currentQuestionIndex === questions.length - 1 && showFeedback;

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">No Application Selected</h2>
          <p className="text-sm text-[#1A1A1A]/40 mb-6">
            Open Interview Prep by clicking the button on any job card from your dashboard.
          </p>
          <Button onClick={() => navigate('/home')} className="w-full">← Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 text-sm text-[#1A1A1A]/40 hover:text-[#1A1A1A] font-medium transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-1">
                AI Interview Prep
              </h1>
              <p className="text-sm text-[#1A1A1A]/50">{job.title} · {job.company}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C5A059]/15 to-[#C5A059]/5 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-[#C5A059]" />
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Loading questions */}
        {loading && questions.length === 0 && (
          <div className="bg-white rounded-2xl border border-black/[0.06] p-16 text-center shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mx-auto mb-4" />
            <p className="text-sm text-[#1A1A1A]/40 font-medium">Generating personalised interview questions…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && questions.length === 0 && !error && (
          <div className="bg-white rounded-2xl border border-black/[0.06] p-16 text-center shadow-sm">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-4" />
            <p className="text-sm text-[#1A1A1A]/40 mb-4">No questions generated yet.</p>
            <Button onClick={generateQuestions}><RefreshCw className="w-4 h-4 mr-2" /> Try Again</Button>
          </div>
        )}

        {/* Main flow */}
        {questions.length > 0 && (
          <div className="space-y-5">

            {/* Progress */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#1A1A1A]/40">Progress</span>
                <span className="text-xs font-bold text-[#C5A059]">{currentQuestionIndex + 1} / {questions.length}</span>
              </div>
              <div className="h-2 bg-black/[0.04] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#C5A059] to-[#E8D5B0] rounded-full"
                />
              </div>
            </div>

            {/* Question card */}
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-black/[0.06] p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1A1A1A]/30 uppercase tracking-widest mb-1.5">
                    Question {currentQuestionIndex + 1}
                  </p>
                  <p className="text-base sm:text-lg text-[#1A1A1A] leading-relaxed font-medium">
                    {questions[currentQuestionIndex]}
                  </p>
                </div>
              </div>

              {!showFeedback && (
                <>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here… be specific and use examples from your experience."
                    rows={8}
                    className="mb-4"
                  />
                  <Button onClick={submitAnswer} disabled={loading || !userAnswer.trim()} className="w-full">
                    {loading
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analysing your answer…</>
                      : <><Brain className="w-4 h-4 mr-2" /> Get AI Feedback</>
                    }
                  </Button>
                </>
              )}
            </motion.div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Score */}
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-6 text-center shadow-sm">
                    <p className="text-xs font-bold text-[#1A1A1A]/30 uppercase tracking-widest mb-2">Your Score</p>
                    <p className="text-5xl font-bold text-[#C5A059]">
                      {feedback.rating}<span className="text-2xl text-[#1A1A1A]/20">/10</span>
                    </p>
                  </div>

                  {/* Your answer */}
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-sm">
                    <h4 className="text-sm font-bold text-[#1A1A1A] mb-3">Your Answer</h4>
                    <p className="text-sm text-[#1A1A1A]/50 leading-relaxed">{userAnswer}</p>
                  </div>

                  {/* Strengths */}
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-sm font-bold text-[#1A1A1A]">Strengths</h4>
                    </div>
                    <p className="text-sm text-[#1A1A1A]/50 leading-relaxed">{feedback.strengths}</p>
                  </div>

                  {/* Improvements */}
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <h4 className="text-sm font-bold text-[#1A1A1A]">Areas for Improvement</h4>
                    </div>
                    <p className="text-sm text-[#1A1A1A]/50 leading-relaxed">{feedback.improvements}</p>
                  </div>

                  {/* Suggested answer */}
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-sm">
                    <h4 className="text-sm font-bold text-[#1A1A1A] mb-3">Suggested Answer</h4>
                    <p className="text-sm text-[#1A1A1A]/50 leading-relaxed">{feedback.suggested_answer}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {!isComplete && (
                      <Button onClick={nextQuestion} className="flex-1">Next Question →</Button>
                    )}
                    {isComplete && (
                      <>
                        <Button variant="outline" onClick={resetSession} className="flex-1">
                          <RefreshCw className="w-4 h-4 mr-2" /> New Session
                        </Button>
                        <Button onClick={() => navigate('/home')} className="flex-1">Complete ✓</Button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Session summary */}
            {allAnswers.length > 0 && (
              <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-4">Session Summary</h3>
                <div className="space-y-2.5">
                  {allAnswers.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs gap-4">
                      <span className="text-[#1A1A1A]/40 truncate flex-1">
                        Q{i + 1}: {item.question.length > 60 ? item.question.slice(0, 60) + '…' : item.question}
                      </span>
                      <span className="font-bold text-[#C5A059] flex-shrink-0">{item.feedback.rating}/10</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1A1A1A]">Average Score</span>
                    <span className="text-lg font-bold text-[#C5A059]">
                      {(allAnswers.reduce((sum, a) => sum + a.feedback.rating, 0) / allAnswers.length).toFixed(1)}/10
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}