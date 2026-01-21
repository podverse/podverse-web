// Log immediately - before any imports
console.log('📝 Script starting - loading modules...\n');

import inquirer from 'inquirer';
import { BrowserAutomation } from './browser-automation.js';
import { LighthouseRunner } from './lighthouse-runner.js';
import { ReportManager } from './report-manager.js';
import { ComparisonEngine } from './comparison.js';
import { generateComparisonSummary } from './openai-summary.js';
// Delay podverse-orm import to avoid ESM/CommonJS conflicts
// import { UserManager } from './user-manager.js';
import { DatabaseSetup } from './database-setup.js';
import { WebAppManager } from './web-app-manager.js';
import { ApiManager } from './api-manager.js';
import { ContainerChecker } from './container-checker.js';
import { killProcessOnPort } from './port-killer.js';
import { AssetGenerator } from './asset-generator.js';
import { AssetServer } from './asset-server.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📦 All modules loaded successfully\n');

// Load environment variables - first from qa/lighthouse/.env, then from podverse-web/env/local.env
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
console.log('✅ Environment variables loaded\n');

// Base URL will be set by WebAppManager (localhost:3111 for tests)
let BASE_URL = 'http://localhost:3111';

// Store managers in module scope for cleanup handlers
let webAppManager: WebAppManager | null = null;
let apiManager: ApiManager | null = null;
let assetServer: AssetServer | null = null;

// Setup signal handlers for cleanup (at module level)
const cleanup = async (signal?: string) => {
  console.log(`\n\n🛑 ${signal ? `Shutdown signal (${signal}) received` : 'Shutting down'}, cleaning up...`);
  
  if (webAppManager) {
    try {
      await webAppManager.stop();
    } catch (error) {
      console.error('   ⚠️  Error stopping web app:', error);
    }
  }
  
  if (apiManager) {
    try {
      await apiManager.stop();
    } catch (error) {
      console.error('   ⚠️  Error stopping API server:', error);
    }
  }
  
  if (assetServer) {
    try {
      await assetServer.stop();
    } catch (error) {
      console.error('   ⚠️  Error stopping asset server:', error);
    }
  }
  
  // Also try killing by port in case process references are lost
  try {
    await killProcessOnPort(3111); // Web app port
  } catch {
    // Ignore
  }
  try {
    await killProcessOnPort(1111); // API port
  } catch {
    // Ignore
  }
  try {
    await killProcessOnPort(2111); // Asset server port
  } catch {
    // Ignore
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
  console.log('🚀 Lighthouse QA System for Podverse Web\n');
  
  // Clean up any existing processes on test ports at startup
  console.log('🔍 Checking for existing processes on test ports...');
  try {
    const webPortKilled = await killProcessOnPort(3111);
    const apiPortKilled = await killProcessOnPort(1111);
    const assetPortKilled = await killProcessOnPort(2111);
    if (webPortKilled || apiPortKilled || assetPortKilled) {
      console.log('✅ Cleaned up existing processes\n');
    } else {
      console.log('✅ Test ports are free\n');
    }
  } catch (error) {
    console.warn('⚠️  Could not check/kill processes on test ports:', error);
    console.log('   Continuing anyway...\n');
  }

  // Check required Docker containers first
  const containerChecker = new ContainerChecker();
  try {
    await containerChecker.validateRequiredContainers();
    console.log('✅ All required containers are running\n');
  } catch (error) {
    console.error('❌ Container validation failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Generate test assets BEFORE database setup
  console.log('🎨 Generating test assets...\n');
  const assetGenerator = new AssetGenerator();
  try {
    await assetGenerator.generateAllAssets();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('❌ Failed to generate test assets:', errorMessage);
    if (errorStack) {
      console.error(errorStack);
    }
    if (errorMessage.includes('ffmpeg-static') || errorMessage.includes('npm install')) {
      console.error('\n💡 Hint: Run "npm install" in the qa/lighthouse directory to install required dependencies.');
    }
    process.exit(1);
  }

  // Setup test database BEFORE starting API (API needs database to start)
  console.log('🔧 Setting up test database...\n');
  const databaseSetup = new DatabaseSetup();
  try {
    console.log('   → Checking test database container...');
    await databaseSetup.ensureTestDatabaseUp();
    console.log('   → Resetting and initializing database schema...');
    await databaseSetup.resetTestDatabase();
    console.log('✅ Test database ready\n');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    console.error('\nYou can try running manually from podverse-ops:');
    console.error('  make test_db_up');
    console.error('  make test_db_reinit');
    process.exit(1);
  }

  // Start asset server BEFORE API/Web (assets need to be available)
  console.log('🌐 Starting asset server...\n');
  assetServer = new AssetServer();
  try {
    await assetServer.start();
    console.log(`   ✅ Asset server ready at http://localhost:${assetServer.getPort()}\n`);
  } catch (error) {
    console.error('❌ Failed to start asset server:', error);
    process.exit(1);
  }

  // Start API first (web app depends on it)
  console.log('🌐 Starting API server for testing...\n');
  apiManager = new ApiManager();
  try {
    await apiManager.start();
  } catch (error) {
    console.error('❌ Failed to start API server:', error);
    process.exit(1);
  }

  // Start web app (depends on API)
  console.log('🌐 Starting web app for testing...\n');
  webAppManager = new WebAppManager();
  try {
    BASE_URL = await webAppManager.start();
  } catch (error) {
    console.error('❌ Failed to start web app:', error);
    // Clean up API if web app fails to start
    if (apiManager?.isRunning()) {
      await apiManager.stop();
    }
    process.exit(1);
  }

  console.log('📍 Configuration:');
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);

  console.log('📂 Initializing components...');
  const reportManager = new ReportManager();
  const comparisonEngine = new ComparisonEngine();
  console.log('   ✅ ReportManager and ComparisonEngine initialized\n');

  // Get existing reports
  console.log('📋 Checking for existing reports...');
  const existingReports = reportManager.getAllReports();
  console.log(`   Found ${existingReports.length} existing report(s)\n`);
  
  // Prompt for base report (required if any exist)
  console.log('💬 Prompting for report selection...');
  let baseReport: string | undefined;
  if (existingReports.length === 0) {
    console.log('   → No existing reports found; skipping comparison.\n');
  } else {
    const { selectedBaseReport } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedBaseReport',
        message: 'Select the base report to compare against:',
        choices: existingReports.map(report => ({ name: report, value: report }))
      }
    ]);
    baseReport = selectedBaseReport as string;
  }

  // Prompt for new test report identifier
  console.log('   → Asking for new report name...');
  const { newReport } = await inquirer.prompt([
    {
      type: 'input',
      name: 'newReport',
      message: 'Enter a name for the new test report:',
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

  const trimmedReportId = newReport.trim();
  console.log(`   ✅ Report name entered: "${trimmedReportId}"\n`);

  // Check if new report already exists
  console.log(`🔍 Checking if report "${trimmedReportId}" already exists...`);
  if (reportManager.reportExists(trimmedReportId)) {
    console.log('   ⚠️  Report already exists');
    console.log('   → Asking for overwrite confirmation...');
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Report "${trimmedReportId}" already exists. Overwrite it?`,
        default: false
      }
    ]);

    if (!overwrite) {
      console.log('❌ Cancelled. Exiting...');
      process.exit(0);
    }
    console.log('   ✅ Overwrite confirmed\n');
  } else {
    console.log('   ✅ Report name is new\n');
  }

  // Load base report if it exists
  console.log('📖 Loading base report (if specified)...');
  let baseReportData = null;
  if (baseReport) {
    console.log(`   → Loading report: "${baseReport}"`);
    baseReportData = reportManager.loadReport(baseReport);
    if (baseReportData) {
      console.log(`\n✅ Loaded base report: "${baseReport}"`);
    } else {
      console.log(`\n❌ Base report "${baseReport}" could not be loaded. Exiting...`);
      process.exit(1);
    }
  }

  console.log(`\n🧪 Running Lighthouse tests...`);
  console.log(`Base URL: ${BASE_URL}\n`);

  // Initialize automation and runner
  console.log('🌐 Initializing browser automation...');
  const automation = new BrowserAutomation(BASE_URL);
  const lighthouseRunner = new LighthouseRunner();

  try {
    console.log('   → Launching browser...');
    await automation.initialize();
    console.log('✅ Browser ready\n');
    
    console.log('🧪 Starting Lighthouse test suite...\n');
    const results = await lighthouseRunner.runAllTests(automation);
    
    console.log('\n✅ All tests completed!\n');

    // Save new report
    console.log(`💾 Saving report "${trimmedReportId}"...`);
    reportManager.saveReport(trimmedReportId, results, baseReport);
    console.log(`✅ Report saved to reports/report-${reportManager.sanitizeReportId(trimmedReportId)}.json\n`);

    // Compare if base report exists
    if (baseReport && baseReportData) {
      console.log('📊 Comparing reports...\n');
      const newReportData = reportManager.loadReport(trimmedReportId);
      if (newReportData) {
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
          const summaryPath = path.join(
            path.dirname(reportManager.getReportPath(trimmedReportId)),
            `report-${reportManager.sanitizeReportId(trimmedReportId)}-summary.md`
          );
          fs.writeFileSync(summaryPath, summary || 'No summary generated.', 'utf-8');
          console.log(`✅ Summary saved to ${summaryPath}\n`);
        } catch (error) {
          console.error('⚠️  Failed to generate OpenAI summary:', error);
        }
      }
    } else {
      console.log('📊 No base report to compare against.');
      console.log('   Run the tool again with a different base report to compare results.');
    }
  } catch (error) {
    console.error('❌ Error running tests:', error);
    // Cleanup will happen in finally block
    throw error;
  } finally {
    console.log('🧹 Cleaning up...');
    
    // Stop browser automation
    try {
      await automation.cleanup();
      console.log('   ✅ Browser closed');
    } catch (error) {
      console.error('   ⚠️  Error closing browser:', error);
    }

    // Stop web app
    if (webAppManager) {
      try {
        await webAppManager.stop();
        console.log('   ✅ Web app stopped');
      } catch (error) {
        console.error('   ⚠️  Error stopping web app:', error);
      }
    }

    // Stop API server
    if (apiManager) {
      try {
        await apiManager.stop();
        console.log('   ✅ API server stopped');
      } catch (error) {
        console.error('   ⚠️  Error stopping API server:', error);
      }
    }

    // Stop asset server
    if (assetServer) {
      try {
        await assetServer.stop();
      } catch (error) {
        console.error('   ⚠️  Error stopping asset server:', error);
      }
    }
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
