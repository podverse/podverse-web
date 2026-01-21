import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as crypto from 'crypto';
import { killProcessOnPort } from './port-killer.js';

const execAsync = promisify(exec);

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_API_PORT = 1111; // Test API port (separate from dev)
const TEST_API_URL = `http://localhost:${TEST_API_PORT}`;

export class ApiManager {
  private apiProcess: ChildProcess | null = null;
  private podverseApiPath: string;
  private podverseOpsPath: string;

  constructor() {
    // Calculate path to podverse-api (sibling to podverse-web)
    const currentDir = __dirname;
    const webRoot = path.resolve(currentDir, '../../../');
    const reposRoot = path.resolve(webRoot, '../');
    this.podverseApiPath = path.join(reposRoot, 'podverse-api');
    this.podverseOpsPath = path.join(reposRoot, 'podverse-ops');
  }

  private async checkPortAvailable(port: number): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`lsof -ti:${port} || echo ""`);
      return stdout.trim() === '';
    } catch {
      return true;
    }
  }

  private async waitForServerReady(url: string, maxAttempts: number = 120, delay: number = 1000): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(url);
        if (response.ok || response.status === 404 || response.status === 401) {
          // Server is responding (401 is OK, means auth is required but server is up)
          return true;
        }
      } catch {
        // Server not ready yet
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
  }

  private async ensureNpmLinks(): Promise<void> {
    const linkScriptPath = path.join(this.podverseOpsPath, 'scripts/dev/npm-link-modules.sh');
    
    if (!fs.existsSync(linkScriptPath)) {
      console.log('   ⚠️  npm-link-modules.sh not found, skipping npm link setup');
      return;
    }

    // Check if links are already set up by checking for symlinks in node_modules
    // For now, we'll assume links are already set up or will be handled manually
    // The script could be run here if needed, but it might be slow
    console.log('   → Assuming npm links are already set up (run npm-link-modules.sh if needed)');
  }

  async start(): Promise<string> {
    if (this.apiProcess) {
      console.log('⚠️  API is already running');
      return TEST_API_URL;
    }

    // Check if port is available, and kill any process using it
    const portAvailable = await this.checkPortAvailable(TEST_API_PORT);
    if (!portAvailable) {
      console.log(`⚠️  Port ${TEST_API_PORT} is in use, attempting to free it...`);
      await killProcessOnPort(TEST_API_PORT);
    }

    console.log(`🚀 Starting podverse-api on port ${TEST_API_PORT}...`);
    console.log(`   Working directory: ${this.podverseApiPath}`);

    // Ensure npm links are set up
    await this.ensureNpmLinks();

    // Generate a valid UUID for AUTH_JWT_SECRET if not provided
    const authJwtSecret = process.env.AUTH_JWT_SECRET || crypto.randomUUID();

    // Set environment variables for test instance
    const env = {
      ...process.env,
      NODE_ENV: 'development',
      API_PORT: String(TEST_API_PORT),
      // Point to test database (port 5111)
      DB_HOST: 'localhost',
      DB_PORT: '5111',
      DB_DATABASE: 'postgres',
      DB_READ_USERNAME: process.env.DB_READ_USERNAME || 'read',
      DB_READ_PASSWORD: process.env.DB_READ_PASSWORD || '',
      DB_READ_WRITE_USERNAME: process.env.DB_READ_WRITE_USERNAME || 'read_write',
      DB_READ_WRITE_PASSWORD: process.env.DB_READ_WRITE_PASSWORD || '',
      DB_SSL_CONNECTION: 'false',
      // JWT Secret (required by API)
      AUTH_JWT_SECRET: authJwtSecret,
      // API configuration
      API_PREFIX: '/api',
      API_VERSION: '/v2',
      COOKIE_DOMAIN: 'localhost',
      // Disable mailer for testing
      MAILER_DISABLED: 'true',
      // Message Queue configuration (use existing podverse_local_mq)
      MESSAGE_QUEUE_PROTOCOL: 'amqp',
      MESSAGE_QUEUE_HOST: 'localhost',
      MESSAGE_QUEUE_PORT: '5672',
      MESSAGE_QUEUE_USERNAME: 'user',
      MESSAGE_QUEUE_PASSWORD: 'mysecretpw',
      // KeyvalDB configuration (use existing podverse_local_keyvaldb)
      KEYVALDB_HOST: '127.0.0.1',
      KEYVALDB_PORT: '6379',
      // KeyvalDB password is optional (not set in podverse-local-keyvaldb.env)
      // Log level
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    };

    // Check if package.json exists
    const packageJsonPath = path.join(this.podverseApiPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`podverse-api not found at: ${this.podverseApiPath}`);
    }

    console.log('   → API DB config:');
    console.log(`     DB_HOST=${env.DB_HOST}`);
    console.log(`     DB_PORT=${env.DB_PORT}`);
    console.log(`     DB_DATABASE=${env.DB_DATABASE}`);

    // Start API server
    this.apiProcess = spawn('npm', ['run', 'dev'], {
      cwd: this.podverseApiPath,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    // Capture stdout/stderr for debugging
    let output = '';
    let errorOutput = '';

    this.apiProcess.stdout?.on('data', (data) => {
      const text = data.toString();
      output += text;
      // Only log important messages to avoid spam
      if (text.includes('running on port') || text.includes('Connected to') || text.includes('error') || text.includes('Error')) {
        console.log(`   [api] ${text.trim()}`);
      }
    });

    this.apiProcess.stderr?.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      // Only log errors
      if (text.includes('error') || text.includes('Error') || text.includes('EADDRINUSE') || text.includes('FATAL')) {
        console.error(`   [api error] ${text.trim()}`);
      }
    });

    // Track if process exited with error
    let processExitedWithError = false;
    let exitCode: number | null = null;

    // Handle process exit
    this.apiProcess.on('exit', (code, signal) => {
      if (code !== null && code !== 0 && code !== 130) {
        // 130 is SIGINT (Ctrl+C), which is expected
        console.error(`⚠️  API process exited with code ${code}`);
        processExitedWithError = true;
        exitCode = code;
        this.apiProcess = null;
        // Exit immediately when API fails to start
        console.error('\n❌ API server failed to start. Exiting...\n');
        process.exit(code);
      }
      this.apiProcess = null;
    });

    // Wait for server to be ready
    console.log(`   → Waiting for API server to be ready...`);

    // Check if process exited during wait
    let checkInterval: NodeJS.Timeout | null = null;
    let checkTimeout: NodeJS.Timeout | null = null;
    const isReady = await Promise.race([
      this.waitForServerReady(`${TEST_API_URL}/api/v2/`, 180, 1000), // Wait up to 3 minutes
      new Promise<boolean>((resolve) => {
        checkInterval = setInterval(() => {
          if (processExitedWithError || !this.apiProcess || this.apiProcess.killed) {
            if (checkInterval) {
              clearInterval(checkInterval);
              checkInterval = null;
            }
            if (checkTimeout) {
              clearTimeout(checkTimeout);
              checkTimeout = null;
            }
            resolve(false);
          }
        }, 500);
        // Clear interval after max wait time
        checkTimeout = setTimeout(() => {
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
        }, 180000);
      }),
    ]);
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
    if (checkTimeout) {
      clearTimeout(checkTimeout);
      checkTimeout = null;
    }

    if (!isReady || processExitedWithError) {
      await this.stop();
      const errorMessage = processExitedWithError
        ? `API process exited with code ${exitCode} before server became ready.\n`
        : `API server failed to start on port ${TEST_API_PORT} within 3 minutes.\n`;
      throw new Error(
        errorMessage +
        `Last output:\n${output.slice(-500)}\n` +
        `Last errors:\n${errorOutput.slice(-500)}`
      );
    }

    console.log(`✅ API server is ready at ${TEST_API_URL}\n`);
    return TEST_API_URL;
  }

  async stop(): Promise<void> {
    const process = this.apiProcess;
    this.apiProcess = null; // Clear reference immediately to prevent double-stop

    if (!process) {
      // If we don't have a process reference, try killing by port
      await killProcessOnPort(TEST_API_PORT);
      return;
    }

    console.log(`🛑 Stopping API server...`);

    return new Promise((resolve) => {
      // Try graceful shutdown first
      const killed = process.kill('SIGTERM');

      if (!killed) {
        // Process might already be dead, try killing by port
        killProcessOnPort(TEST_API_PORT).then(() => resolve());
        return;
      }

      // Wait for process to exit (with timeout)
      const timeout = setTimeout(async () => {
        try {
          process.kill('SIGKILL');
        } catch {
          // Process already gone
        }
        // Also try killing by port in case process reference is stale
        await killProcessOnPort(TEST_API_PORT);
        resolve();
      }, 5000);

      process.on('exit', () => {
        clearTimeout(timeout);
        console.log('   ✅ API server stopped');
        resolve();
      });
    });
  }

  isRunning(): boolean {
    return this.apiProcess !== null && !this.apiProcess.killed;
  }

  getUrl(): string {
    return TEST_API_URL;
  }
}
