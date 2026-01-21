// Log immediately - before any imports
console.log('📝 Bundle Analyzer starting - loading modules...\n');

import inquirer from 'inquirer';
import { BundleAnalyzer } from './bundle-analyzer.js';
import { BundleReportManager } from './report-manager.js';
import { BundleComparisonEngine } from './comparison.js';
import { generateComparisonSummary } from './openai-summary.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📦 All modules loaded successfully\n');

// Load environment variables - first from qa/bundle-analyzer/.env, then from podverse-web/env/local.env
console.log('🔧 Loading environment variables...');
const localEnvPath = path.join(__dirname, '../.env');
if (fs.existsSync(localEnvPath)) {
  console.log(`   → Loading from: ${localEnvPath}`);
  dotenv.config({ path: localEnvPath });
} else {
  console.log(`   ⚠️  No .env file found at: ${localEnvPath}`);
}

const webEnvPath = path.join(__dirname, '../../../env/local.env');
if (fs.existsSync(webEnvPath)) {
  console.log(`   → Loading from: ${webEnvPath}`);
  dotenv.config({ path: webEnvPath });
} else {
  console.log(`   ⚠️  No env file found at: ${webEnvPath}`);
}

// Also load .env.openai for OpenAI API key
const openaiEnvPath = path.join(__dirname, '../../../.env.openai');
if (fs.existsSync(openaiEnvPath)) {
  console.log(`   → Loading from: ${openaiEnvPath}`);
  dotenv.config({ path: openaiEnvPath });
} else {
  console.log(`   ⚠️  No .env.openai file found at: ${openaiEnvPath}`);
}
console.log('✅ Environment variables loaded\n');

// Store analyzer in module scope for cleanup handlers
let bundleAnalyzer: BundleAnalyzer | null = null;

// Setup signal handlers for cleanup (at module level)
const cleanup = async (signal?: string) => {
  console.log(`\n\n🛑 ${signal ? `Shutdown signal (${signal}) received` : 'Shutting down'}, cleaning up...`);
  
  if (bundleAnalyzer) {
    try {
      await bundleAnalyzer.cleanup();
    } catch (error) {
      console.error('   ⚠️  Error during cleanup:', error);
    }
  }
};

process.on('SIGINT', () => cleanup('SIGINT').then(() => process.exit(0)));
process.on('SIGTERM', () => cleanup('SIGTERM').then(() => process.exit(0)));

// Also handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', async (error) => {
  console.error('❌ Uncaught exception:', error);
  await cleanup();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  const errorMessage = reason instanceof Error ? reason.message : String(reason);
  const errorStack = reason instanceof Error ? reason.stack : undefined;
  console.error('❌ Unhandled rejection:', errorMessage);
  if (errorStack) {
    console.error(errorStack);
  }
  await cleanup();
  process.exit(1);
});

async function main() {
  console.log('🚀 Bundle Analyzer QA System for Podverse Web\n');

  console.log('📂 Initializing components...');
  const reportManager = new BundleReportManager();
  const comparisonEngine = new BundleComparisonEngine();
  bundleAnalyzer = new BundleAnalyzer();
  console.log('   ✅ BundleAnalyzer and ComparisonEngine initialized\n');

  // Prompt to select a previous report for comparison before running analysis
  console.log('📋 Checking for existing reports to compare against...');
  const existingReports = reportManager.getAllReports();
  let selectedBaseReport: string | null = null;

  if (existingReports.length === 0) {
    console.log('   → No existing reports found; comparison will be skipped.\n');
  } else {
    console.log(`   Found ${existingReports.length} existing report(s)\n`);
    const selection = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedBaseReport',
        message: 'Select a previous report to compare against (or "Skip comparison"):',
        choices: [
          { name: 'Skip comparison', value: null },
          ...existingReports.map(report => ({ name: report, value: report }))
        ]
      }
    ]);
    selectedBaseReport = selection.selectedBaseReport;
    if (selectedBaseReport) {
      console.log(`   ✅ Base report selected: "${selectedBaseReport}"\n`);
    } else {
      console.log('   → Comparison skipped\n');
    }
  }

  // Prompt for new test report identifier
  console.log('💬 Prompting for report name...');
  const { reportName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'reportName',
      message: 'Enter a name for the new bundle analysis report:',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Report name cannot be empty';
        }
        if (input.length > 50) {
          return 'Report name must be 50 characters or less';
        }
        return true;
      }
    }
  ]);

  const trimmedReportName = reportName.trim();
  console.log(`   ✅ Report name entered: "${trimmedReportName}"\n`);

  try {
    console.log(`\n🧪 Running bundle analysis...`);
    console.log(`Report name: ${trimmedReportName}\n`);

    const report = await bundleAnalyzer.analyze(trimmedReportName);

    console.log('\n✅ Bundle analysis complete!\n');

    // Save new report (report is already saved by bundleAnalyzer.analyze, but we ensure it's saved)
    console.log(`💾 Report "${trimmedReportName}" saved\n`);

    console.log('📊 Report Summary:');
    console.log(`   Report Name: ${report.reportName}`);
    console.log(`   Timestamp: ${report.timestamp}`);
    if (report.serverBundlePath) {
      console.log(`   Server Bundle: ${report.serverBundlePath}`);
      if (report.serverBundleSize) {
        const sizeKB = (report.serverBundleSize / 1024).toFixed(2);
        const sizeMB = (report.serverBundleSize / (1024 * 1024)).toFixed(2);
        console.log(`   Server Bundle Size: ${sizeKB} KB (${sizeMB} MB)`);
      }
    }
    if (report.clientBundlePath) {
      console.log(`   Client Bundle: ${report.clientBundlePath}`);
      if (report.clientBundleSize) {
        const sizeKB = (report.clientBundleSize / 1024).toFixed(2);
        const sizeMB = (report.clientBundleSize / (1024 * 1024)).toFixed(2);
        console.log(`   Client Bundle Size: ${sizeKB} KB (${sizeMB} MB)`);
      }
    }
    console.log('\n💡 Tip: Open the HTML files in your browser to view interactive bundle visualizations.\n');

    // Load the new report from disk
    const newReportData = reportManager.loadReport(trimmedReportName);
    if (!newReportData) {
      console.error(`❌ Could not load new report "${trimmedReportName}" for comparison. Exiting...`);
      process.exit(1);
    }

    if (selectedBaseReport && selectedBaseReport !== trimmedReportName) {
      // Load the base report
      console.log(`📖 Loading base report "${selectedBaseReport}"...`);
      const baseReportData = reportManager.loadReport(selectedBaseReport);
      if (!baseReportData) {
        console.error(`❌ Could not load base report "${selectedBaseReport}". Skipping comparison.\n`);
      } else {
        console.log(`✅ Loaded base report: "${selectedBaseReport}"\n`);
        
        console.log('📊 Comparing reports...\n');
        const comparison = comparisonEngine.compareReports(baseReportData, newReportData);
        
        console.log('='.repeat(60));
        console.log('COMPARISON RESULTS');
        console.log('='.repeat(60));
        console.log(`Base Report: ${comparison.baseReport}`);
        console.log(`New Report: ${comparison.newReport}`);
        console.log(`\nSummary:`);
        console.log(`  ✅ Improvements: ${comparison.summary.improvements}`);
        console.log(`  ⚠️  Regressions: ${comparison.summary.regressions}`);
        console.log(`  ➡️  Neutral: ${comparison.summary.neutral}`);
        console.log('\n' + comparison.analysis);
        console.log('='.repeat(60));

        try {
          console.log('\n🧠 Generating OpenAI summary...');
          const summary = await generateComparisonSummary(baseReportData, newReportData, comparison);
          if (!summary || summary.trim().length === 0) {
            console.error('⚠️  OpenAI summary was empty or null');
          } else {
            // Use the same reports directory as the report manager
            const reportsDir = path.join(__dirname, '../../reports/bundle-analyzer');
            // Ensure directory exists
            if (!fs.existsSync(reportsDir)) {
              fs.mkdirSync(reportsDir, { recursive: true });
            }
            const summaryPath = path.join(
              reportsDir,
              `bundle-report-${reportManager.sanitizeReportName(trimmedReportName)}-summary.md`
            );
            fs.writeFileSync(summaryPath, summary, 'utf-8');
            console.log(`✅ Summary saved to ${summaryPath}\n`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          const errorStack = error instanceof Error ? error.stack : undefined;
          console.error('⚠️  Failed to generate OpenAI summary:', errorMessage);
          if (errorStack) {
            console.error('   Stack trace:', errorStack);
          }
          console.error('   This might be due to missing OPENAI_API_KEY in .env.openai file');
          console.error(`   Expected location: ${path.resolve(__dirname, '../../../.env.openai')}\n`);
        }
      }
    } else if (selectedBaseReport === trimmedReportName) {
      console.log('   → Selected base report matches new report name; skipping comparison.\n');
    }
  } catch (error) {
    console.error('❌ Error running bundle analysis:', error);
    await cleanup();
    process.exit(1);
  } finally {
    await cleanup();
  }

  // Explicitly exit after successful completion
  console.log('\n✅ All processes completed. Exiting...\n');
  process.exit(0);
}

console.log('🚀 Starting main function...\n');

main().catch(async (error) => {
  console.error('❌ Fatal error:', error);
  await cleanup();
  process.exit(1);
});
