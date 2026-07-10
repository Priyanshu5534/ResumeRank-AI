import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScoreRing } from '@/components/ui/score-ring';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Lightbulb, Check, X, ShieldCheck, HelpCircle } from 'lucide-react';
import { getRecommendation } from '@/services/ranking';

interface AnalysisReportProps {
  analysis: {
    overallScore: number;
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    keywordMatch: number;
    matchedSkills: string;
    missingSkills: string;
    strengths: string;
    weaknesses: string;
    suggestions: string;
    summary: string;
    aiModel: string;
  };
}

export default function AnalysisReport({ analysis }: AnalysisReportProps) {
  const recommendation = getRecommendation(analysis.overallScore);

  const matchedSkillsList = analysis.matchedSkills ? analysis.matchedSkills.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const missingSkillsList = analysis.missingSkills ? analysis.missingSkills.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const strengthsList = analysis.strengths ? analysis.strengths.split('|').map((s) => s.trim()).filter(Boolean) : [];
  const weaknessesList = analysis.weaknesses ? analysis.weaknesses.split('|').map((s) => s.trim()).filter(Boolean) : [];
  const suggestionsList = analysis.suggestions ? analysis.suggestions.split('|').map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border-0 shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="info" className="bg-blue-600 border-0 text-white font-semibold">
                AI Match Assessment
              </Badge>
              <Badge variant="neutral" className="bg-slate-800 border-0 text-slate-300">
                Model: {analysis.aiModel}
              </Badge>
            </div>
            <h2 className="text-xl font-bold tracking-tight">AI Evaluation Summary</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-850">
            <ScoreRing score={analysis.overallScore} size="lg" />
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fit Recommendation</p>
              <h3 className="text-lg font-black text-white mt-1 leading-tight">{recommendation.label}</h3>
              <p className="text-xs text-slate-400 mt-1">Based on core requirements alignment</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Breakdown circular charts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Skills Alignment', score: analysis.skillMatch },
          { label: 'Experience Match', score: analysis.experienceMatch },
          { label: 'Education Match', score: analysis.educationMatch },
          { label: 'Keyword Relevance', score: analysis.keywordMatch },
        ].map((item, i) => (
          <Card key={i} className="p-4 flex items-center justify-between border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
              <h4 className="text-sm font-semibold text-slate-850 dark:text-slate-200 mt-1">Score Breakdown</h4>
            </div>
            <ScoreRing score={item.score} size="sm" />
          </Card>
        ))}
      </div>

      {/* Skills Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="bg-emerald-50/30 dark:bg-emerald-950/5">
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" />
              Matched Skills ({matchedSkillsList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {matchedSkillsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No matching skills identified.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {matchedSkillsList.map((skill, idx) => (
                  <Badge key={idx} variant="success" className="px-2.5 py-1 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="bg-red-50/30 dark:bg-red-950/5">
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" />
              Missing Skills ({missingSkillsList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {missingSkillsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No key missing skills identified.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {missingSkillsList.map((skill, idx) => (
                  <Badge key={idx} variant="danger" className="px-2.5 py-1 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {strengthsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No key strengths reported.</p>
            ) : (
              strengthsList.map((strength, idx) => (
                <div key={idx} className="flex gap-2 text-sm text-slate-650 dark:text-slate-350">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              Areas of Concern
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weaknessesList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific concerns identified.</p>
            ) : (
              weaknessesList.map((weakness, idx) => (
                <div key={idx} className="flex gap-2 text-sm text-slate-650 dark:text-slate-350">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{weakness}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recruiter Suggestions */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-blue-50/10 dark:bg-blue-950/5">
          <CardTitle className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-500" />
            Recommended Next Steps / Interview Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {suggestionsList.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No recommended next steps available.</p>
          ) : (
            suggestionsList.map((suggestion, idx) => (
              <div key={idx} className="flex gap-3 text-sm text-slate-750 dark:text-slate-300">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="mt-0.5 leading-relaxed">{suggestion}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
