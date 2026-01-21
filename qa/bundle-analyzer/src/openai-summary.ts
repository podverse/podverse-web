import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { OpenAI } from 'openai';
import type { BundleReport, BundleChunkSummary } from './report-manager.js';
import type { BundleComparisonResult } from './comparison.js';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, '../../../.env.openai');
config({ path: envPath });

const MODEL = 'gpt-4o-mini';

function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return 'N/A';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function extractBundleMetrics(report: BundleReport): {
  reportName: string;
  timestamp: string;
  serverBundleSize: string;
  clientBundleSize: string;
  serverChunkSummary?: ReturnType<typeof formatChunkSummary>;
  clientChunkSummary?: ReturnType<typeof formatChunkSummary>;
} {
  return {
    reportName: report.reportName,
    timestamp: report.timestamp,
    serverBundleSize: formatBytes(report.serverBundleSize),
    clientBundleSize: formatBytes(report.clientBundleSize),
    serverChunkSummary: report.serverChunkSummary ? formatChunkSummary(report.serverChunkSummary) : undefined,
    clientChunkSummary: report.clientChunkSummary ? formatChunkSummary(report.clientChunkSummary) : undefined
  };
}

function formatChunkSummary(summary: BundleChunkSummary) {
  return {
    totalChunks: summary.totalChunks,
    totalAssets: summary.totalAssets,
    totalAssetSize: formatBytes(summary.totalAssetSize),
    topChunks: summary.topChunks.map((chunk) => ({
      name: chunk.name,
      size: formatBytes(chunk.size),
      files: chunk.files
    }))
  };
}

function formatChunkComparison(
  comparison?: BundleComparisonResult['chunkSummary']
): BundleComparisonResult['chunkSummary'] | undefined {
  if (!comparison) {
    return undefined;
  }
  const formatMetric = (metric: {
    base: number | null;
    new: number | null;
    delta: number | null;
    percentChange: number | null;
  }) => ({
    base: metric.base !== null ? metric.base : null,
    new: metric.new !== null ? metric.new : null,
    delta: metric.delta !== null ? metric.delta : null,
    percentChange: metric.percentChange !== null ? `${metric.percentChange >= 0 ? '+' : ''}${metric.percentChange.toFixed(2)}%` : null
  });

  const formatBundle = (bundle: NonNullable<BundleComparisonResult['chunkSummary']>[keyof NonNullable<BundleComparisonResult['chunkSummary']>]) => ({
    totalChunks: formatMetric(bundle.totalChunks),
    totalAssets: formatMetric(bundle.totalAssets),
    totalAssetSize: {
      base: bundle.totalAssetSize.base !== null ? formatBytes(bundle.totalAssetSize.base) : null,
      new: bundle.totalAssetSize.new !== null ? formatBytes(bundle.totalAssetSize.new) : null,
      delta: bundle.totalAssetSize.delta !== null ? formatBytes(Math.abs(bundle.totalAssetSize.delta)) : null,
      percentChange: bundle.totalAssetSize.percentChange !== null ? `${bundle.totalAssetSize.percentChange >= 0 ? '+' : ''}${bundle.totalAssetSize.percentChange.toFixed(2)}%` : null
    },
    topChunks: bundle.topChunks.map((chunk) => ({
      name: chunk.name,
      base: chunk.base !== null ? formatBytes(chunk.base) : null,
      new: chunk.new !== null ? formatBytes(chunk.new) : null,
      delta: chunk.delta !== null ? formatBytes(Math.abs(chunk.delta)) : null,
      percentChange: chunk.percentChange !== null ? `${chunk.percentChange >= 0 ? '+' : ''}${chunk.percentChange.toFixed(2)}%` : null
    }))
  });

  return {
    ...(comparison.server ? { server: formatBundle(comparison.server) } : {}),
    ...(comparison.client ? { client: formatBundle(comparison.client) } : {})
  };
}

export async function generateComparisonSummary(
  baseReport: BundleReport,
  newReport: BundleReport,
  comparison: BundleComparisonResult
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(`OPENAI_API_KEY not set (expected in ${envPath})`);
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const payload = {
    baseReport: extractBundleMetrics(baseReport),
    newReport: extractBundleMetrics(newReport),
    comparison: {
      summary: comparison.summary,
      metrics: comparison.metrics.map(m => ({
        name: m.name,
        base: m.base !== null ? formatBytes(m.base) : null,
        new: m.new !== null ? formatBytes(m.new) : null,
        delta: m.delta !== null ? formatBytes(Math.abs(m.delta)) : null,
        percentChange: m.percentChange !== null ? `${m.percentChange >= 0 ? '+' : ''}${m.percentChange.toFixed(2)}%` : null
      })),
      chunkSummary: formatChunkComparison(comparison.chunkSummary)
    }
  };

  const systemPrompt = [
    'You are a bundle size optimization analyst. Produce a concise, actionable report comparing two bundle analysis runs.',
    'Use bundle size best practices as your reference:',
    '- Initial JS bundle: Good: < 200KB gzipped, Needs Improvement: < 500KB gzipped, Poor: > 500KB gzipped.',
    '- Total JS bundle: Good: < 500KB gzipped, Needs Improvement: < 1MB gzipped, Poor: > 1MB gzipped.',
    '- Individual chunks: Good: < 100KB gzipped, Needs Improvement: < 200KB gzipped, Poor: > 200KB gzipped.',
    '',
    'Output markdown with these sections, in order:',
    '1) Summary (2-4 sentences, high-level outcome. Explicitly mention the degree of concern relative to bundle size best practices.)',
    '2) Improvements (bullets, highlight bundle size reductions and their impact)',
    '3) Regressions (bullets, call out severity and likely impact. Mention specific bundle types that increased.)',
    '4) No Change (bullets, only the most stable/high-importance areas)',
    '5) Actions (2-5 short recommendations, prioritize biggest optimization opportunities)',
    'Rules:',
    '- Be concise; avoid repeating metrics unnecessarily.',
    '- Highlight only significant deltas; treat <=5% as no-change unless user impact is likely.',
    '- Use units (KB, MB) and indicate direction clearly.',
    '- Mention specific bundle types (server vs client) when discussing changes.',
    '- If chunk summary is present, call out notable top chunk size changes.',
    '- Focus on actionable optimization opportunities.',
    '- If data is insufficient for a section, say "None observed".'
  ].join('\n');

  const chat = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this bundle comparison JSON:\n\n${JSON.stringify(payload, null, 2)}` }
    ]
  });

  return chat.choices[0].message.content?.trim() ?? '';
}
