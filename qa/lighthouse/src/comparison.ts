import { LighthouseReport } from './report-manager.js';
import type { Result as LighthouseResult } from 'lighthouse';

interface MetricComparison {
  name: string;
  base: number | null;
  new: number | null;
  delta: number | null;
  percentChange: number | null;
}

interface ScenarioComparison {
  scenario: string;
  metrics: MetricComparison[];
}

export interface ComparisonResult {
  baseReport: string;
  newReport: string;
  scenarios: ScenarioComparison[];
  summary: {
    regressions: number;
    improvements: number;
    neutral: number;
  };
  analysis: string;
}

export class ComparisonEngine {
  private readonly THRESHOLD_PERCENT = 5; // 5% change threshold

  extractPerformanceScore(lhr: LighthouseResult | undefined): number | null {
    if (!lhr) return null;
    const performance = lhr.categories?.performance;
    return performance?.score ? Math.round(performance.score * 100) : null;
  }

  extractMetricValue(lhr: LighthouseResult | undefined, metricId: string): number | null {
    if (!lhr || !lhr.audits) return null;
    const audit = lhr.audits[metricId];
    if (!audit || audit.numericValue === undefined) return null;
    return audit.numericValue;
  }

  extractLcpElement(lhr: LighthouseResult | undefined): string | null {
    if (!lhr || !lhr.audits) return null;
    const audit = lhr.audits['largest-contentful-paint-element'];
    if (!audit || !audit.details || !Array.isArray((audit.details as any).items)) return null;
    const items = (audit.details as any).items;
    if (items.length === 0 || !items[0].node) return null;
    return items[0].node.nodeLabel || items[0].node.snippet || null;
  }

  compareMetrics(
    baseLhr: LighthouseResult | undefined,
    newLhr: LighthouseResult | undefined
  ): MetricComparison[] {
    const metrics: MetricComparison[] = [];

    // Performance score
    const baseScore = this.extractPerformanceScore(baseLhr);
    const newScore = this.extractPerformanceScore(newLhr);
    if (baseScore !== null || newScore !== null) {
      const delta = baseScore !== null && newScore !== null ? newScore - baseScore : null;
      const percentChange = baseScore !== null && delta !== null ? (delta / baseScore) * 100 : null;
      metrics.push({
        name: 'Performance Score',
        base: baseScore,
        new: newScore,
        delta,
        percentChange
      });
    }

    // Core Web Vitals
    const coreWebVitals = [
      { id: 'largest-contentful-paint', name: 'LCP' },
      { id: 'first-input-delay', name: 'FID' },
      { id: 'cumulative-layout-shift', name: 'CLS' }
    ];

    for (const metric of coreWebVitals) {
      const baseValue = this.extractMetricValue(baseLhr, metric.id);
      const newValue = this.extractMetricValue(newLhr, metric.id);
      if (baseValue !== null || newValue !== null) {
        const delta = baseValue !== null && newValue !== null ? newValue - baseValue : null;
        const percentChange = baseValue !== null && delta !== null ? (delta / baseValue) * 100 : null;
        metrics.push({
          name: metric.name,
          base: baseValue,
          new: newValue,
          delta,
          percentChange
        });
      }
    }

    // Load time
    const baseLoadTime = this.extractMetricValue(baseLhr, 'page-load-time');
    const newLoadTime = this.extractMetricValue(newLhr, 'page-load-time');
    if (baseLoadTime !== null || newLoadTime !== null) {
      const delta = baseLoadTime !== null && newLoadTime !== null ? newLoadTime - baseLoadTime : null;
      const percentChange = baseLoadTime !== null && delta !== null ? (delta / baseLoadTime) * 100 : null;
      metrics.push({
        name: 'Page Load Time (ms)',
        base: baseLoadTime,
        new: newLoadTime,
        delta,
        percentChange
      });
    }

    return metrics;
  }

  compareReports(baseReport: LighthouseReport, newReport: LighthouseReport): ComparisonResult {
    const scenarios: ScenarioComparison[] = [];

    // Compare logged out scenarios
    const loggedOutPages = [
      'homepage',
      'podcastChannelPage'
    ] as const;
    
    for (const page of loggedOutPages) {
      const base = baseReport.scenarios.loggedOut[page];
      const newLhr = newReport.scenarios.loggedOut[page];
      const metrics = this.compareMetrics(base, newLhr);
      if (metrics.length > 0) {
        scenarios.push({
          scenario: `Logged Out - ${page}`,
          metrics
        });
      }
    }

    // Calculate summary
    let regressions = 0;
    let improvements = 0;
    let neutral = 0;

    for (const scenario of scenarios) {
      for (const metric of scenario.metrics) {
        if (metric.percentChange === null) {
          neutral++;
        } else if (metric.name === 'Performance Score') {
          // For performance score, increase is good
          if (metric.percentChange! > this.THRESHOLD_PERCENT) {
            improvements++;
          } else if (metric.percentChange! < -this.THRESHOLD_PERCENT) {
            regressions++;
          } else {
            neutral++;
          }
        } else if (metric.name === 'CLS') {
          // For CLS, decrease is good (closer to 0)
          if (metric.percentChange! < -this.THRESHOLD_PERCENT) {
            improvements++;
          } else if (metric.percentChange! > this.THRESHOLD_PERCENT) {
            regressions++;
          } else {
            neutral++;
          }
        } else {
          // For LCP, FID, Load Time - decrease is good
          if (metric.percentChange! < -this.THRESHOLD_PERCENT) {
            improvements++;
          } else if (metric.percentChange! > this.THRESHOLD_PERCENT) {
            regressions++;
          } else {
            neutral++;
          }
        }
      }
    }

    // Generate analysis text
    const analysis = this.generateAnalysis(scenarios, regressions, improvements);

    return {
      baseReport: baseReport.newReport,
      newReport: newReport.newReport,
      scenarios,
      summary: {
        regressions,
        improvements,
        neutral
      },
      analysis
    };
  }

  generateAnalysis(scenarios: ScenarioComparison[], regressions: number, improvements: number): string {
    let analysis = `## Performance Comparison Analysis\n\n`;
    
    if (improvements > regressions) {
      analysis += `✅ **Overall: Performance has improved** (${improvements} improvements vs ${regressions} regressions)\n\n`;
    } else if (regressions > improvements) {
      analysis += `⚠️ **Overall: Performance has regressed** (${regressions} regressions vs ${improvements} improvements)\n\n`;
    } else {
      analysis += `➡️ **Overall: Performance is relatively stable** (${improvements} improvements, ${regressions} regressions)\n\n`;
    }

    analysis += `### Detailed Changes:\n\n`;

    for (const scenario of scenarios) {
      analysis += `#### ${scenario.scenario}\n\n`;
      for (const metric of scenario.metrics) {
        if (metric.delta === null) continue;
        
        const isGood = (metric.name === 'Performance Score' && metric.percentChange! > 0) ||
                      (metric.name !== 'Performance Score' && metric.name !== 'CLS' && metric.percentChange! < 0) ||
                      (metric.name === 'CLS' && metric.percentChange! < 0);
        
        const indicator = isGood ? '✅' : metric.percentChange! < -this.THRESHOLD_PERCENT || metric.percentChange! > this.THRESHOLD_PERCENT ? '⚠️' : '➡️';
        
        analysis += `${indicator} **${metric.name}**: `;
        if (metric.base !== null && metric.new !== null) {
          analysis += `${metric.base} → ${metric.new} `;
        }
        if (metric.delta !== null) {
          const sign = metric.delta >= 0 ? '+' : '';
          analysis += `(${sign}${metric.delta.toFixed(2)})`;
        }
        if (metric.percentChange !== null) {
          const sign = metric.percentChange >= 0 ? '+' : '';
          analysis += ` ${sign}${metric.percentChange.toFixed(2)}%`;
        }
        analysis += `\n`;
      }
      analysis += `\n`;
    }

    return analysis;
  }
}
