import { BundleReport, BundleChunkSummary } from './report-manager.js';

interface MetricComparison {
  name: string;
  base: number | null;
  new: number | null;
  delta: number | null;
  percentChange: number | null;
}

interface ChunkDelta {
  name: string;
  base: number | null;
  new: number | null;
  delta: number | null;
  percentChange: number | null;
}

interface BundleChunkComparison {
  totalChunks: MetricComparison;
  totalAssets: MetricComparison;
  totalAssetSize: MetricComparison;
  topChunks: ChunkDelta[];
}

export interface BundleComparisonResult {
  baseReport: string;
  newReport: string;
  metrics: MetricComparison[];
  summary: {
    regressions: number;
    improvements: number;
    neutral: number;
  };
  analysis: string;
  chunkSummary?: {
    server?: BundleChunkComparison;
    client?: BundleChunkComparison;
  };
}

export class BundleComparisonEngine {
  private readonly THRESHOLD_PERCENT = 5; // 5% change threshold

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  compareReports(baseReport: BundleReport, newReport: BundleReport): BundleComparisonResult {
    const metrics: MetricComparison[] = [];

    // Compare server bundle size
    const baseServerSize = baseReport.serverBundleSize ?? null;
    const newServerSize = newReport.serverBundleSize ?? null;
    if (baseServerSize !== null || newServerSize !== null) {
      const delta = baseServerSize !== null && newServerSize !== null ? newServerSize - baseServerSize : null;
      const percentChange = baseServerSize !== null && delta !== null ? (delta / baseServerSize) * 100 : null;
      metrics.push({
        name: 'Server Bundle Size',
        base: baseServerSize,
        new: newServerSize,
        delta,
        percentChange
      });
    }

    // Compare client bundle size
    const baseClientSize = baseReport.clientBundleSize ?? null;
    const newClientSize = newReport.clientBundleSize ?? null;
    if (baseClientSize !== null || newClientSize !== null) {
      const delta = baseClientSize !== null && newClientSize !== null ? newClientSize - baseClientSize : null;
      const percentChange = baseClientSize !== null && delta !== null ? (delta / baseClientSize) * 100 : null;
      metrics.push({
        name: 'Client Bundle Size',
        base: baseClientSize,
        new: newClientSize,
        delta,
        percentChange
      });
    }

    // Calculate summary
    let regressions = 0;
    let improvements = 0;
    let neutral = 0;

    for (const metric of metrics) {
      if (metric.percentChange === null) {
        neutral++;
      } else {
        // For bundle sizes, decrease is good (smaller bundles)
        if (metric.percentChange! < -this.THRESHOLD_PERCENT) {
          improvements++;
        } else if (metric.percentChange! > this.THRESHOLD_PERCENT) {
          regressions++;
        } else {
          neutral++;
        }
      }
    }

    const chunkSummary = this.compareChunkSummaries(baseReport, newReport);

    // Generate analysis text
    const analysis = this.generateAnalysis(metrics, regressions, improvements, chunkSummary);

    return {
      baseReport: baseReport.reportName,
      newReport: newReport.reportName,
      metrics,
      summary: {
        regressions,
        improvements,
        neutral
      },
      analysis,
      chunkSummary
    };
  }

  private compareChunkSummaries(
    baseReport: BundleReport,
    newReport: BundleReport
  ): BundleComparisonResult['chunkSummary'] | undefined {
    const server = this.buildChunkComparison(baseReport.serverChunkSummary, newReport.serverChunkSummary);
    const client = this.buildChunkComparison(baseReport.clientChunkSummary, newReport.clientChunkSummary);

    if (!server && !client) {
      return undefined;
    }

    return {
      ...(server ? { server } : {}),
      ...(client ? { client } : {})
    };
  }

  private buildChunkComparison(
    baseSummary?: BundleChunkSummary,
    newSummary?: BundleChunkSummary
  ): BundleChunkComparison | undefined {
    if (!baseSummary && !newSummary) {
      return undefined;
    }

    const totalChunks = this.buildMetricComparison(
      'Total Chunks',
      baseSummary?.totalChunks ?? null,
      newSummary?.totalChunks ?? null
    );
    const totalAssets = this.buildMetricComparison(
      'Total Assets',
      baseSummary?.totalAssets ?? null,
      newSummary?.totalAssets ?? null
    );
    const totalAssetSize = this.buildMetricComparison(
      'Total Asset Size',
      baseSummary?.totalAssetSize ?? null,
      newSummary?.totalAssetSize ?? null
    );

    const baseChunks = baseSummary?.topChunks ?? [];
    const newChunks = newSummary?.topChunks ?? [];
    const chunkMap = new Map<string, { base?: number; next?: number }>();

    for (const chunk of baseChunks) {
      chunkMap.set(chunk.name, { base: chunk.size });
    }
    for (const chunk of newChunks) {
      const existing = chunkMap.get(chunk.name);
      chunkMap.set(chunk.name, { base: existing?.base, next: chunk.size });
    }

    const topChunks: ChunkDelta[] = Array.from(chunkMap.entries()).map(([name, values]) =>
      this.buildChunkDelta(name, values.base ?? null, values.next ?? null)
    );

    return {
      totalChunks,
      totalAssets,
      totalAssetSize,
      topChunks
    };
  }

  private buildMetricComparison(name: string, base: number | null, next: number | null): MetricComparison {
    const delta = base !== null && next !== null ? next - base : null;
    const percentChange = base !== null && delta !== null ? (delta / base) * 100 : null;
    return {
      name,
      base,
      new: next,
      delta,
      percentChange
    };
  }

  private buildChunkDelta(name: string, base: number | null, next: number | null): ChunkDelta {
    const delta = base !== null && next !== null ? next - base : null;
    const percentChange = base !== null && delta !== null ? (delta / base) * 100 : null;
    return {
      name,
      base,
      new: next,
      delta,
      percentChange
    };
  }

  generateAnalysis(
    metrics: MetricComparison[],
    regressions: number,
    improvements: number,
    chunkSummary?: BundleComparisonResult['chunkSummary']
  ): string {
    let analysis = `## Bundle Size Comparison Analysis\n\n`;
    
    if (improvements > regressions) {
      analysis += `✅ **Overall: Bundle sizes have improved** (${improvements} improvements vs ${regressions} regressions)\n\n`;
    } else if (regressions > improvements) {
      analysis += `⚠️ **Overall: Bundle sizes have regressed** (${regressions} regressions vs ${improvements} improvements)\n\n`;
    } else {
      analysis += `➡️ **Overall: Bundle sizes are relatively stable** (${improvements} improvements, ${regressions} regressions)\n\n`;
    }

    analysis += `### Detailed Changes:\n\n`;

    for (const metric of metrics) {
      if (metric.delta === null) continue;
      
      // For bundle sizes, decrease is good
      const isGood = metric.percentChange! < 0;
      const indicator = isGood ? '✅' : metric.percentChange! < -this.THRESHOLD_PERCENT || metric.percentChange! > this.THRESHOLD_PERCENT ? '⚠️' : '➡️';
      
      analysis += `${indicator} **${metric.name}**: `;
      if (metric.base !== null && metric.new !== null) {
        analysis += `${this.formatBytes(metric.base)} → ${this.formatBytes(metric.new)} `;
      }
      if (metric.delta !== null) {
        const sign = metric.delta >= 0 ? '+' : '';
        analysis += `(${sign}${this.formatBytes(Math.abs(metric.delta))})`;
      }
      if (metric.percentChange !== null) {
        const sign = metric.percentChange >= 0 ? '+' : '';
        analysis += ` ${sign}${metric.percentChange.toFixed(2)}%`;
      }
      analysis += `\n`;
    }

    if (chunkSummary?.server || chunkSummary?.client) {
      analysis += `\n### Chunk Summary Changes:\n\n`;
      if (chunkSummary.server) {
        analysis += this.formatChunkSummary('Server', chunkSummary.server);
      }
      if (chunkSummary.client) {
        analysis += this.formatChunkSummary('Client', chunkSummary.client);
      }
    }

    return analysis;
  }

  private formatChunkSummary(label: string, summary: BundleChunkComparison): string {
    const lines: string[] = [];
    lines.push(`**${label} Bundles**`);
    lines.push(
      `- Total chunks: ${this.formatMetric(summary.totalChunks)}`
    );
    lines.push(
      `- Total assets: ${this.formatMetric(summary.totalAssets)}`
    );
    lines.push(
      `- Total asset size: ${this.formatMetric(summary.totalAssetSize, true)}`
    );

    const topChanges = summary.topChunks
      .filter((chunk) => chunk.delta !== null)
      .sort((a, b) => Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0))
      .slice(0, 5);

    if (topChanges.length > 0) {
      lines.push(`- Top chunk changes:`);
      for (const chunk of topChanges) {
        const sizeBase = chunk.base !== null ? this.formatBytes(chunk.base) : 'N/A';
        const sizeNew = chunk.new !== null ? this.formatBytes(chunk.new) : 'N/A';
        const delta = chunk.delta !== null ? this.formatBytes(Math.abs(chunk.delta)) : 'N/A';
        const sign = chunk.delta !== null && chunk.delta >= 0 ? '+' : '-';
        lines.push(
          `  - ${chunk.name}: ${sizeBase} → ${sizeNew} (${sign}${delta})`
        );
      }
    }

    return `${lines.join('\n')}\n\n`;
  }

  private formatMetric(metric: MetricComparison, useBytes = false): string {
    const base = metric.base === null ? 'N/A' : useBytes ? this.formatBytes(metric.base) : metric.base.toString();
    const next = metric.new === null ? 'N/A' : useBytes ? this.formatBytes(metric.new) : metric.new.toString();
    if (metric.delta === null || metric.percentChange === null) {
      return `${base} → ${next}`;
    }
    const sign = metric.delta >= 0 ? '+' : '';
    const delta = useBytes ? this.formatBytes(Math.abs(metric.delta)) : Math.abs(metric.delta).toString();
    return `${base} → ${next} (${sign}${delta}, ${sign}${metric.percentChange.toFixed(2)}%)`;
  }
}
