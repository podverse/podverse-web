import { BuildManager } from './build-manager.js';
import { BundleReportManager, BundleReport, BundleChunkSummary } from './report-manager.js';

const DEFAULT_TOP_CHUNKS = Math.max(1, Number(process.env.BUNDLE_ANALYZER_TOP_N || 20));

function parseStatsJson(jsonContent: string): Record<string, unknown> | null {
  try {
    return JSON.parse(jsonContent) as Record<string, unknown>;
  } catch (error) {
    console.warn('⚠️  Failed to parse stats JSON:', error);
    return null;
  }
}

function getChunkName(chunk: Record<string, unknown>): string {
  const names = chunk.names as string[] | undefined;
  if (Array.isArray(names) && names.length > 0) {
    return names[0];
  }
  const files = chunk.files as string[] | undefined;
  if (Array.isArray(files) && files.length > 0) {
    return files[0];
  }
  if (typeof chunk.id === 'string' || typeof chunk.id === 'number') {
    return `chunk-${chunk.id}`;
  }
  return 'unknown';
}

function buildChunkSummary(stats: Record<string, unknown>, topN: number): BundleChunkSummary {
  const assets = Array.isArray(stats.assets) ? stats.assets : [];
  const chunks = Array.isArray(stats.chunks) ? stats.chunks : [];

  const totalAssetSize = assets.reduce((total, asset) => {
    const size = (asset as { size?: number }).size;
    return typeof size === 'number' ? total + size : total;
  }, 0);

  const topChunks = chunks
    .map((chunk) => ({
      chunk,
      size: (chunk as { size?: number }).size
    }))
    .filter((entry) => typeof entry.size === 'number')
    .sort((a, b) => (b.size as number) - (a.size as number))
    .slice(0, topN)
    .map((entry) => {
      const chunk = entry.chunk as Record<string, unknown>;
      const files = Array.isArray(chunk.files) ? (chunk.files as string[]) : [];
      return {
        name: getChunkName(chunk),
        size: entry.size as number,
        files
      };
    });

  return {
    totalChunks: chunks.length,
    totalAssets: assets.length,
    totalAssetSize,
    topChunks
  };
}

export class BundleAnalyzer {
  private buildManager: BuildManager;
  private reportManager: BundleReportManager;

  constructor() {
    this.buildManager = new BuildManager();
    this.reportManager = new BundleReportManager();
  }

  async analyze(reportName: string): Promise<BundleReport> {
    console.log(`\n📊 Starting bundle analysis: ${reportName}\n`);

    // Build the app with analyzer enabled
    const { serverHtml, clientHtml, serverStatsJson, clientStatsJson } =
      await this.buildManager.buildWithAnalyzer();

    // Save HTML reports
    let serverBundlePath: string | undefined;
    let clientBundlePath: string | undefined;
    let serverBundleSize: number | undefined;
    let clientBundleSize: number | undefined;
    let serverStatsPath: string | undefined;
    let clientStatsPath: string | undefined;
    let serverChunkSummary: BundleChunkSummary | undefined;
    let clientChunkSummary: BundleChunkSummary | undefined;

    if (serverHtml) {
      serverBundlePath = this.reportManager.saveHtmlReport(reportName, serverHtml, 'server');
      serverBundleSize = Buffer.byteLength(serverHtml, 'utf8');
      console.log(`✅ Server bundle report saved: ${serverBundlePath}`);
    }

    if (clientHtml) {
      clientBundlePath = this.reportManager.saveHtmlReport(reportName, clientHtml, 'client');
      clientBundleSize = Buffer.byteLength(clientHtml, 'utf8');
      console.log(`✅ Client bundle report saved: ${clientBundlePath}`);
    }

    if (serverStatsJson) {
      serverStatsPath = this.reportManager.saveStatsReport(reportName, serverStatsJson, 'server');
      const parsedStats = parseStatsJson(serverStatsJson);
      if (parsedStats) {
        serverChunkSummary = buildChunkSummary(parsedStats, DEFAULT_TOP_CHUNKS);
      }
      console.log(`✅ Server stats report saved: ${serverStatsPath}`);
    }

    if (clientStatsJson) {
      clientStatsPath = this.reportManager.saveStatsReport(reportName, clientStatsJson, 'client');
      const parsedStats = parseStatsJson(clientStatsJson);
      if (parsedStats) {
        clientChunkSummary = buildChunkSummary(parsedStats, DEFAULT_TOP_CHUNKS);
      }
      console.log(`✅ Client stats report saved: ${clientStatsPath}`);
    }

    // Create and save JSON report
    const report: BundleReport = {
      timestamp: new Date().toISOString(),
      reportName,
      serverBundlePath,
      clientBundlePath,
      serverBundleSize,
      clientBundleSize,
      serverStatsPath,
      clientStatsPath,
      serverChunkSummary,
      clientChunkSummary,
    };

    this.reportManager.saveReport(report);
    console.log(`✅ Bundle analysis complete: ${reportName}\n`);

    return report;
  }

  async cleanup(): Promise<void> {
    await this.buildManager.stop();
  }
}
