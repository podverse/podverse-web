import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { LighthouseTestResults } from './lighthouse-runner.js';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface LighthouseReport {
  timestamp: string;
  baseReport?: string;
  newReport: string;
  testChannelIds: string[];
  testItemIds: string[];
  scenarios: LighthouseTestResults;
}

export class ReportManager {
  private reportsDir: string;

  constructor(reportsDir: string = path.join(__dirname, '../reports')) {
    this.reportsDir = reportsDir;
    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  sanitizeReportId(reportId: string): string {
    // Sanitize report ID to be filesystem-safe
    return reportId.replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  getReportPath(reportId: string): string {
    const sanitized = this.sanitizeReportId(reportId);
    return path.join(this.reportsDir, `report-${sanitized}.json`);
  }

  reportExists(reportId: string): boolean {
    return fs.existsSync(this.getReportPath(reportId));
  }

  getAllReports(): string[] {
    if (!fs.existsSync(this.reportsDir)) {
      return [];
    }

    try {
      const files = fs.readdirSync(this.reportsDir);
      const reports: string[] = [];
      
      for (const file of files) {
        if (file.startsWith('report-') && file.endsWith('.json')) {
          // Extract report ID from filename: report-{id}.json
          const reportId = file.replace(/^report-/, '').replace(/\.json$/, '');
          reports.push(reportId);
        }
      }
      
      return reports.sort();
    } catch (error) {
      console.error('Error reading reports directory:', error);
      return [];
    }
  }

  saveReport(reportId: string, results: LighthouseTestResults, baseReport?: string): void {
    const report: LighthouseReport = {
      timestamp: new Date().toISOString(),
      baseReport,
      newReport: reportId,
      testChannelIds: ['lhtest-chan-1'],
      testItemIds: ['lhtest-item-1'],
      scenarios: results
    };

    const reportPath = this.getReportPath(reportId);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  }

  loadReport(reportId: string): LighthouseReport | null {
    const reportPath = this.getReportPath(reportId);
    
    if (!fs.existsSync(reportPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(reportPath, 'utf-8');
      return JSON.parse(content) as LighthouseReport;
    } catch (error) {
      console.error(`Error loading report ${reportId}:`, error);
      return null;
    }
  }
}
