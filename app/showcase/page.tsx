'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  Pause,
  Video,
  Download,
  Share2,
  CheckCircle2,
  Trophy,
  UploadCloud,
  FileText,
  BarChart3,
  Users,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Maximize2,
  Copy,
  Check,
  Star,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

interface ShowcaseStep {
  id: number;
  title: string;
  badge: string;
  description: string;
  highlight: string;
  durationMs: number;
}

const SHOWCASE_STEPS: ShowcaseStep[] = [
  {
    id: 1,
    title: 'Next-Gen AI Applicant Tracking System',
    badge: 'STAGE 1 • OVERVIEW',
    description:
      'Welcome to ResumeRank AI — a full-stack recruitment intelligence platform built with Next.js App Router, Prisma, PostgreSQL, and Google Gemini AI.',
    highlight: 'Automate 95% of initial resume screening with deep semantic understanding.',
    durationMs: 5000,
  },
  {
    id: 2,
    title: 'Recruitment Command Center & Real-Time KPIs',
    badge: 'STAGE 2 • DASHBOARD',
    description:
      'Monitor your active job pipelines, total candidate flow, and average AI match scores across every position in one unified dashboard.',
    highlight: 'Real-time hiring metrics and candidate status tracking across all pipeline stages.',
    durationMs: 5000,
  },
  {
    id: 3,
    title: 'Multi-Format Resume Upload & Universal Parser',
    badge: 'STAGE 3 • RESUME UPLOAD & PARSE',
    description:
      'Upload PDF, DOCX, or TXT resumes up to 10MB. Our custom extraction engine parses document structures and extracts skills, experience, and contact details seamlessly.',
    highlight: 'Robust multi-format parser supporting pdf-parse v2 & Mammoth word extraction.',
    durationMs: 6000,
  },
  {
    id: 4,
    title: 'Gemini AI Deep Evaluation & Match Matrix',
    badge: 'STAGE 4 • AI EVALUATION ENGINE',
    description:
      'Google Gemini AI scores candidates across 5 dimensions: Overall Match, Technical Skill Fit, Experience Level, Education Alignment, and Keyword Relevance.',
    highlight: 'Receives granular strengths, missing skills, and recruiter recommendations automatically.',
    durationMs: 6000,
  },
  {
    id: 5,
    title: 'Automated Leaderboard & Smart Candidate Ranking',
    badge: 'STAGE 5 • LEADERBOARD ENGINE',
    description:
      'Candidates are dynamically ranked and ordered by AI match score so recruiters instantly spot the top 5% talent for any job requisition.',
    highlight: 'Instant multi-candidate comparison and filtering by job role and score threshold.',
    durationMs: 6000,
  },
  {
    id: 6,
    title: 'Pipeline Analytics & Hiring Insights',
    badge: 'STAGE 6 • ANALYTICS & LINKEDIN READY',
    description:
      'Gain visibility into skill distribution, stage conversion rates, and hiring velocity. Ready to share your hiring achievements with the world!',
    highlight: 'End-to-end transparency from application submission to final offer.',
    durationMs: 5000,
  },
];

export default function LinkedInShowcasePage() {
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [copiedLinkedInText, setCopiedLinkedInText] = React.useState<boolean>(false);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const recordedChunksRef = React.useRef<Blob[]>([]);

  // Autoplay progression loop
  React.useEffect(() => {
    if (!isPlaying) return;
    const currentStepObj = SHOWCASE_STEPS.find((s) => s.id === activeStep) || SHOWCASE_STEPS[0];
    const timer = setTimeout(() => {
      setActiveStep((prev) => (prev < SHOWCASE_STEPS.length ? prev + 1 : 1));
    }, currentStepObj.durationMs);
    return () => clearTimeout(timer);
  }, [activeStep, isPlaying]);

  async function startLinkedInRecording() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        toast.error('Screen recording API is not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false,
      });

      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ResumeRank_AI_LinkedIn_Demo.webm';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('LinkedIn demo video recorded & downloaded!');
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setActiveStep(1);
      setIsPlaying(true);
      toast.success('Recording started! The walkthrough will play from beginning to end.');
    } catch (err) {
      toast.error('Recording canceled or permission denied.');
    }
  }

  function stopLinkedInRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  }

  const linkedInPostCaption = `🚀 Excited to share my latest full-stack AI web application: ResumeRank AI!

Built with Next.js App Router, TypeScript, Prisma, PostgreSQL, and Google Gemini AI, ResumeRank AI transforms how recruitment teams parse, evaluate, and rank applicant resumes.

✨ Key Highlights:
1️⃣ Universal Resume Parsing — Supports PDF, DOCX, & TXT uploads with automated skill & contact extraction.
2️⃣ Google Gemini AI Evaluation — Deep 5-dimension candidate evaluation (Overall Score, Skills, Experience, Education, & Keywords).
3️⃣ Automated AI Leaderboard — Dynamically ranks applicants so recruiters instantly identify top-tier talent.
4️⃣ Rich Hiring Analytics — Comprehensive pipeline tracking and conversion insights.

Check out the full end-to-end screen recording below! 👇

#Nextjs #TypeScript #AI #GoogleGemini #FullStack #WebDevelopment #ApplicantTrackingSystem #RecruitmentTech`;

  function copyLinkedInCaption() {
    navigator.clipboard.writeText(linkedInPostCaption);
    setCopiedLinkedInText(true);
    toast.success('LinkedIn post caption copied to clipboard!');
    setTimeout(() => setCopiedLinkedInText(false), 2500);
  }

  const currentStep = SHOWCASE_STEPS[activeStep - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Banner Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ResumeRank AI
              </span>
              <span className="ml-2.5 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold uppercase tracking-wider">
                LinkedIn Showcase
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                onClick={startLinkedInRecording}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-purple-600/25 transition cursor-pointer"
              >
                <Video className="w-4 h-4" />
                Record Screen for LinkedIn
              </button>
            ) : (
              <button
                onClick={stopLinkedInRecording}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-red-600/30 animate-pulse transition cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                Stop & Download Recording
              </button>
            )}

            <button
              onClick={copyLinkedInCaption}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              {copiedLinkedInText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedLinkedInText ? 'Copied Post' : 'Copy LinkedIn Post'}
            </button>

            <Link
              href="/dashboard"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
            >
              Live App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Walkthrough Presentation Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Stage Timeline Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 flex-wrap">
            {SHOWCASE_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStep(step.id);
                  setIsPlaying(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeStep === step.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{step.id}.</span>
                <span className="hidden sm:inline">{step.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-purple-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              {isPlaying ? 'Autoplay On' : 'Autoplay Paused'}
            </button>

            <div className="flex items-center gap-1">
              <button
                disabled={activeStep === 1}
                onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400 px-2">
                {activeStep} / {SHOWCASE_STEPS.length}
              </span>
              <button
                disabled={activeStep === SHOWCASE_STEPS.length}
                onClick={() => setActiveStep((p) => Math.min(SHOWCASE_STEPS.length, p + 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stage Header Info */}
        <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              {currentStep.badge}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {currentStep.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentStep.description}
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 max-w-sm">
            <span className="text-purple-400 font-bold block mb-1">Key LinkedIn Takeaway:</span>
            {currentStep.highlight}
          </div>
        </div>

        {/* Interactive Simulation Screen Window */}
        <div className="border border-slate-800/80 rounded-2xl bg-slate-900/90 shadow-2xl overflow-hidden relative min-h-[520px] flex flex-col">
          {/* Browser Bar */}
          <div className="h-11 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-1 text-xs text-slate-400 font-mono w-72 text-center truncate">
              https://resumerank-ai.com/dashboard/stage-{activeStep}
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              Live Interactive Walkthrough
            </div>
          </div>

          {/* SIMULATED STAGES */}
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            {activeStep === 1 && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="text-center space-y-4 pt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Google Gemini 2.5 AI Powered
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                    Automated Applicant Tracking & <br />
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      AI Resume Match Scoring
                    </span>
                  </h3>
                  <p className="text-sm text-slate-400 max-w-2xl mx-auto">
                    Screen 100+ resumes in seconds with deep semantic comparison against job descriptions, skill matrices, and required experience.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white">Multi-Format Parser</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Extracts clean plaintext from PDF, DOCX, and TXT files with zero layout distortion.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white">5-Dimension Scoring</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Evaluates Overall Match, Skills, Experience, Education, and Keywords automatically.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white">Smart Leaderboard</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ranks candidates dynamically so recruiters interview the top 5% talent first.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">Total Pipeline Candidates</span>
                    <div className="text-3xl font-extrabold text-white mt-2">148</div>
                    <span className="text-xs text-emerald-400 font-medium mt-1 inline-block">+24 this week</span>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">Active Requisitions</span>
                    <div className="text-3xl font-extrabold text-white mt-2">12</div>
                    <span className="text-xs text-blue-400 font-medium mt-1 inline-block">Engineering & Design</span>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">Average AI Match Score</span>
                    <div className="text-3xl font-extrabold text-purple-400 mt-2">84.6%</div>
                    <span className="text-xs text-slate-400 font-medium mt-1 inline-block">Top tier pool</span>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">Time-to-Shortlist</span>
                    <div className="text-3xl font-extrabold text-emerald-400 mt-2">4.2h</div>
                    <span className="text-xs text-emerald-400 font-medium mt-1 inline-block">92% faster</span>
                  </div>
                </div>

                {/* Simulated activity stream */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">Live AI Screening Feed</h4>
                    <span className="text-xs text-purple-400 font-semibold">Live Automated Evaluation</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Elena Rostova', role: 'Staff React Engineer', score: 94, status: 'SHORTLISTED', time: '2 mins ago' },
                      { name: 'Marcus Vance', role: 'Senior Product Designer', score: 89, status: 'INTERVIEW', time: '14 mins ago' },
                      { name: 'Arjun Mehta', role: 'Full Stack Architect', score: 92, status: 'SELECTED', time: '1 hour ago' },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-xs">
                            {row.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">{row.name}</div>
                            <div className="text-xs text-slate-400">{row.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            AI Score: {row.score}%
                          </span>
                          <span className="text-xs text-slate-400">{row.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="border-2 border-dashed border-purple-500/60 bg-purple-950/10 rounded-2xl p-10 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-7 h-7 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">Drag & Drop Resume File Here</h4>
                      <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, or TXT • Up to 10MB</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30">
                      Simulate Resume Upload: Elena_Rostova_Resume.pdf
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Parsed Resume Structure
                      </span>
                      <span className="text-xs text-slate-400 font-mono">248 KB • PDF</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Candidate Name:</span>
                        <span className="font-bold text-white">Elena Rostova</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email & Phone:</span>
                        <span className="font-mono text-slate-300">elena.r@techmail.io • +1 (415) 890-2134</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Extracted Core Competencies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['React 19', 'Next.js App Router', 'TypeScript', 'System Architecture', 'GraphQL', 'Tailwind CSS'].map(sk => (
                            <span key={sk} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 font-mono">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">Elena Rostova</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                          TOP 1% MATCH
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Staff Full Stack React Engineer • Requisition #ENG-2026-04</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="text-3xl font-black text-purple-400">94%</span>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Overall Match</span>
                      </div>
                      <div className="text-center">
                        <span className="text-3xl font-black text-blue-400">96%</span>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Skill Fit</span>
                      </div>
                      <div className="text-center">
                        <span className="text-3xl font-black text-emerald-400">90%</span>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Experience</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Candidate Key Strengths
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>Extensive 7+ years production experience with Next.js & React Server Components.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>Architected micro-frontend systems scaling to 4M+ daily active users.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>Strong mentorship and technical leadership track record.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-sm text-purple-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Recruiter AI Suggestion
                      </h4>
                      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                        &quot;Elena is an exceptional fit for the Senior/Staff Frontend Lead role. Recommend fast-tracking to System Design technical interview round immediately.&quot;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      AI Leaderboard — Staff React Engineer Pool
                    </h4>
                    <span className="text-xs text-slate-400">Ranked by Gemini Match Algorithm</span>
                  </div>

                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Applied Job</th>
                        <th className="py-3 px-4">AI Score</th>
                        <th className="py-3 px-4">Skills Match</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {[
                        { rank: 1, name: 'Elena Rostova', job: 'Staff React Engineer', score: 94, skills: '96%', status: 'SHORTLISTED' },
                        { rank: 2, name: 'Arjun Mehta', job: 'Staff React Engineer', score: 92, skills: '94%', status: 'SELECTED' },
                        { rank: 3, name: 'Marcus Vance', job: 'Staff React Engineer', score: 89, skills: '88%', status: 'INTERVIEW' },
                        { rank: 4, name: 'Chloe Chen', job: 'Staff React Engineer', score: 85, skills: '86%', status: 'APPLIED' },
                        { rank: 5, name: 'David Miller', job: 'Staff React Engineer', score: 81, skills: '80%', status: 'APPLIED' },
                      ].map((row) => (
                        <tr key={row.rank} className="hover:bg-slate-900/50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-purple-400">#{row.rank}</td>
                          <td className="py-3 px-4 font-bold text-white">{row.name}</td>
                          <td className="py-3 px-4 text-slate-300">{row.job}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold font-mono">
                              {row.score}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{row.skills}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeStep === 6 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-bold text-sm text-white">Recruitment Velocity Insights</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Automated Resume Screening</span>
                          <span className="text-purple-400 font-bold">100%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div className="h-full bg-purple-500 w-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Shortlist Precision Rate</span>
                          <span className="text-blue-400 font-bold">92%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div className="h-full bg-blue-500 w-[92%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">Ready for LinkedIn Showcase!</h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        You can download the recorded MP4/WebM walkthrough and copy our curated LinkedIn post caption to share your project.
                      </p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={copyLinkedInCaption}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                      >
                        Copy Post Template
                      </button>
                      <Link
                        href="/dashboard"
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl text-center transition"
                      >
                        Launch App
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LinkedIn Post Generator Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm text-white">Curated LinkedIn Post Template</h3>
            </div>
            <button
              onClick={copyLinkedInCaption}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition cursor-pointer"
            >
              {copiedLinkedInText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLinkedInText ? 'Copied' : 'Copy Caption'}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {linkedInPostCaption}
          </pre>
        </div>
      </main>
    </div>
  );
}
