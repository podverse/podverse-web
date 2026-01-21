import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { OpenAI } from 'openai';
import type { LighthouseReport } from './report-manager.js';
import type { ComparisonResult } from './comparison.js';
import { ComparisonEngine } from './comparison.js';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, '../../../.env.openai');
config({ path: envPath });

const MODEL = 'gpt-4o-mini';

const scenarioPages = [
  'homepage',
  'podcastChannelPage'
] as const;

type ScenarioMetrics = Record<
  typeof scenarioPages[number],
  {
    performanceScore: number | null;
    lcpMs: number | null;
    lcpElement: string | null;
    fidMs: number | null;
    cls: number | null;
    pageLoadTimeMs: number | null;
  }
>;

function extractScenarioMetrics(report: LighthouseReport): {
  loggedOut: ScenarioMetrics;
} {
  const comparisonEngine = new ComparisonEngine();
  const loggedOut = {} as ScenarioMetrics;

  for (const page of scenarioPages) {
    const loggedOutLhr = report.scenarios.loggedOut[page];

    loggedOut[page] = {
      performanceScore: comparisonEngine.extractPerformanceScore(loggedOutLhr),
      lcpMs: comparisonEngine.extractMetricValue(loggedOutLhr, 'largest-contentful-paint'),
      lcpElement: comparisonEngine.extractLcpElement(loggedOutLhr),
      fidMs: comparisonEngine.extractMetricValue(loggedOutLhr, 'first-input-delay'),
      cls: comparisonEngine.extractMetricValue(loggedOutLhr, 'cumulative-layout-shift'),
      pageLoadTimeMs: comparisonEngine.extractMetricValue(loggedOutLhr, 'page-load-time')
    };
  }

  return { loggedOut };
}

export async function generateComparisonSummary(
  baseReport: LighthouseReport,
  newReport: LighthouseReport,
  comparison: ComparisonResult
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(`OPENAI_API_KEY not set (expected in ${envPath})`);
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const payload = {
    baseReport: {
      id: baseReport.newReport,
      timestamp: baseReport.timestamp,
      scenarios: extractScenarioMetrics(baseReport)
    },
    newReport: {
      id: newReport.newReport,
      timestamp: newReport.timestamp,
      scenarios: extractScenarioMetrics(newReport)
    },
    comparison: {
      summary: comparison.summary,
      scenarios: comparison.scenarios
    }
  };

  const systemPrompt = [
    'You are a performance analyst. Produce a concise, actionable report comparing two Lighthouse runs.',
    'Use Google Core Web Vitals (CWV) standards as your reference:',
    '- LCP (Largest Contentful Paint): Good: < 2500ms, Needs Improvement: < 4000ms, Poor: > 4000ms.',
    '- FID (First Input Delay): Good: < 100ms, Needs Improvement: < 300ms, Poor: > 300ms.',
    '- CLS (Cumulative Layout Shift): Good: < 0.1, Needs Improvement: < 0.25, Poor: > 0.25.',
    '',
    'Output markdown with these sections, in order:',
    '1) Summary (2-4 sentences, high-level outcome. Explicitly mention the degree of concern relative to Google CWV standards.)',
    '2) Improvements (bullets, group by scenario when useful)',
    '3) Regressions (bullets, call out severity and likely impact. If LCP increased, mention the LCP element identified.)',
    '4) No Change (bullets, only the most stable/high-importance areas)',
    '5) Actions (2-5 short recommendations, prioritize biggest wins)',
    'Rules:',
    '- Be concise; avoid repeating metrics for every scenario.',
    '- Highlight only significant deltas; treat <=5% as no-change unless user impact is likely.',
    '- Use units (ms, score, CLS) and indicate direction clearly.',
    '- Mention specific LCP elements provided in the data (e.g., "div.hero-image") when discussing LCP changes.',
    '- If data is insufficient for a section, say \"None observed\".'
  ].join('\n');

  const chat = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this comparison JSON:\n\n${JSON.stringify(payload)}` }
    ]
  });

  return chat.choices[0].message.content?.trim() ?? '';
}
