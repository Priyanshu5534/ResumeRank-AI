import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Users,
  Briefcase,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Nav */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              ResumeRank AI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition duration-150"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-28 px-6 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/50 border border-blue-800/60 text-blue-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen AI Applicant Tracking System
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
              Rank & Evaluate Resumes <br className="hidden md:inline" />
              with <span className="text-blue-500">Custom BGE AI Model</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-normal leading-relaxed">
              Powered by a custom fine-tuned BGE embedding model for semantic resume-job matching. Transform your recruitment workflow by evaluating candidate skills and instantly ranking top talent on an automated leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition"
              >
                Launch Recruiter Portal
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Feature highlights badge pill row */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Powered by ResumeRank AI (BGE)
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automatic PDF/DOCX Parsing
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time Match Score Rings
              </span>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              A Complete Commercial ATS Suite
            </h2>
            <p className="text-slate-400 text-sm">
              Designed from the ground up to feel like a modern Silicon Valley SaaS product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: 'Job Pipeline Management',
                desc: 'Create job postings with custom required skills, experience thresholds, and track candidate progress through recruitment stages.',
              },
              {
                icon: FileText,
                title: 'Intelligent Resume Parser',
                desc: 'Upload PDF or DOCX resumes. Our parser extracts clean text and structures applicant experience, education, and skills.',
              },
              {
                icon: Sparkles,
                title: 'AI Evaluation & Scoring',
                desc: 'Our custom fine-tuned BGE embedding model evaluates every candidate against the job description to output overall match scores, missing skills, strengths, and suggestions.',
              },
              {
                icon: TrendingUp,
                title: 'Automated Leaderboards',
                desc: 'Candidates are dynamically re-ranked as evaluations complete so recruiters can immediately identify top talent.',
              },
              {
                icon: Users,
                title: 'Collaborative Applicant Hub',
                desc: 'Add interview notes, switch status tags (Applied, Shortlisted, Interview, Selected), and inspect visual skill breakdowns.',
              },
              {
                icon: ShieldCheck,
                title: 'Production Auth & Security',
                desc: 'Secure JWT authentication with HttpOnly cookie sessions, Next.js Edge Middleware, and strict Zod validation.',
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{card.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 px-6 text-center text-xs text-slate-500">
        <p>© 2026 ResumeRank AI. Built for modern recruiting teams.</p>
      </footer>
    </div>
  );
}