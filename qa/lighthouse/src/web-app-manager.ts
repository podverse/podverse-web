import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { killProcessOnPort } from './port-killer.js';

const execAsync = promisify(exec);

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_PORT = 3111;
const TEST_URL = `http://localhost:${TEST_PORT}`;

export class WebAppManager {
  private webAppProcess: ChildProcess | null = null;
  private podverseWebPath: string;

  constructor() {
    // Calculate path to podverse-web root (3 levels up from qa/lighthouse/src)
    const currentDir = __dirname;
    const webRoot = path.resolve(currentDir, '../../../');
    this.podverseWebPath = webRoot;
  }

  private async checkPortAvailable(port: number): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`lsof -ti:${port} || echo ""`);
      return stdout.trim() === '';
    } catch {
      return true;
    }
  }

  private async waitForServerReady(url: string, maxAttempts: number = 60, delay: number = 1000): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(url);
        if (response.ok || response.status === 404) {
          // Server is responding (404 is OK, means server is up)
          return true;
        }
      } catch {
        // Server not ready yet
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
  }

  async start(): Promise<string> {
    if (this.webAppProcess) {
      console.log('⚠️  Web app is already running');
      return TEST_URL;
    }

    // Check if port is available, and kill any process using it
    const portAvailable = await this.checkPortAvailable(TEST_PORT);
    if (!portAvailable) {
      console.log(`⚠️  Port ${TEST_PORT} is in use, attempting to free it...`);
      await killProcessOnPort(TEST_PORT);
    }

    console.log(`🚀 Starting podverse-web on port ${TEST_PORT}...`);
    console.log(`   Working directory: ${this.podverseWebPath}`);

    // Set environment variables for test instance
    const env = {
      ...process.env,
      PORT: String(TEST_PORT),
      NODE_ENV: 'production',
      // Point to test database (port 5111)
      DB_HOST: 'localhost',
      DB_PORT: '5111',
      DB_DATABASE: 'postgres',
      DB_READ_USERNAME: process.env.DB_READ_USERNAME || 'read',
      DB_READ_PASSWORD: process.env.DB_READ_PASSWORD || '',
      DB_READ_WRITE_USERNAME: process.env.DB_READ_WRITE_USERNAME || 'read_write',
      DB_READ_WRITE_PASSWORD: process.env.DB_READ_WRITE_PASSWORD || '',
      DB_SSL_CONNECTION: 'false',
      // Web domain for this test instance
      NEXT_PUBLIC_WEB_DOMAIN: `localhost:${TEST_PORT}`,
      NEXT_PUBLIC_WEB_PROTOCOL: 'http',
      // API configuration (matching local.env)
      NEXT_PUBLIC_SSR_API_PROTOCOL: 'http',
      NEXT_PUBLIC_SSR_API_HOST: 'localhost',
      NEXT_PUBLIC_SSR_API_PORT: '1111',
      NEXT_PUBLIC_API_PROTOCOL: 'http',
      NEXT_PUBLIC_API_HOST: 'localhost',
      NEXT_PUBLIC_API_PORT: '1111',
      NEXT_PUBLIC_API_PREFIX: '/api',
      NEXT_PUBLIC_API_VERSION: '/v2',
      NEXT_PUBLIC_SERVER_ENV: 'local',
      // Disable env validation for faster startup (Next.js will handle it)
      SKIP_ENV_VALIDATION: 'true',
      // Allow localhost proxy for Lighthouse test assets (even in production mode)
      ALLOW_LOCALHOST_PROXY: 'true',
    };

    // Check if package.json exists
    const packageJsonPath = path.join(this.podverseWebPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`podverse-web not found at: ${this.podverseWebPath}`);
    }

    console.log('   → Web app DB config:');
    console.log(`     DB_HOST=${env.DB_HOST}`);
    console.log(`     DB_PORT=${env.DB_PORT}`);
    console.log(`     DB_DATABASE=${env.DB_DATABASE}`);

    // Build the Next.js app (production) before starting
    console.log('   → Building web app (next build)...');
    const buildResult = await execAsync('npm run build', {
      cwd: this.podverseWebPath,
      env,
      maxBuffer: 10 * 1024 * 1024
    });
    if (buildResult.stderr && buildResult.stderr.trim()) {
      console.warn(`   ⚠️  Build stderr: ${buildResult.stderr.trim()}`);
    }
    console.log('   ✅ Build complete');

    // Start Next.js production server
    // PORT environment variable will be used by Next.js
    this.webAppProcess = spawn('npm', ['run', 'start'], {
      cwd: this.podverseWebPath,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    // Capture stdout/stderr for debugging
    let output = '';
    let errorOutput = '';

    this.webAppProcess.stdout?.on('data', (data) => {
      const text = data.toString();
      output += text;
      // Only log important messages to avoid spam
      if (text.includes('Ready') || text.includes('started') || text.includes('error')) {
        console.log(`   [web] ${text.trim()}`);
      }
    });

    this.webAppProcess.stderr?.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      // Only log errors
      if (text.includes('error') || text.includes('Error') || text.includes('EADDRINUSE')) {
        console.error(`   [web error] ${text.trim()}`);
      }
    });

    // Handle process exit
    this.webAppProcess.on('exit', (code, signal) => {
      if (code !== null && code !== 0 && code !== 130) {
        // 130 is SIGINT (Ctrl+C), which is expected
        console.error(`⚠️  Web app process exited with code ${code}`);
      }
      this.webAppProcess = null;
    });

    // Wait for server to be ready
    console.log(`   → Waiting for server to be ready...`);
    const isReady = await this.waitForServerReady(TEST_URL, 120, 1000); // Wait up to 2 minutes

    if (!isReady) {
      await this.stop();
      throw new Error(
        `Web app failed to start on port ${TEST_PORT} within 2 minutes.\n` +
        `Last output:\n${output.slice(-500)}\n` +
        `Last errors:\n${errorOutput.slice(-500)}`
      );
    }

    console.log(`✅ Web app is ready at ${TEST_URL}\n`);
    return TEST_URL;
  }

  async stop(): Promise<void> {
    const process = this.webAppProcess;
    this.webAppProcess = null; // Clear reference immediately to prevent double-stop

    if (!process) {
      // If we don't have a process reference, try killing by port
      await killProcessOnPort(TEST_PORT);
      return;
    }

    console.log(`🛑 Stopping web app...`);

    return new Promise((resolve) => {
      // Try graceful shutdown first
      const killed = process.kill('SIGTERM');

      if (!killed) {
        // Process might already be dead, try killing by port
        killProcessOnPort(TEST_PORT).then(() => resolve());
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
        await killProcessOnPort(TEST_PORT);
        resolve();
      }, 5000);

      process.on('exit', () => {
        clearTimeout(timeout);
        console.log('   ✅ Web app stopped');
        resolve();
      });
    });
  }

  isRunning(): boolean {
    return this.webAppProcess !== null && !this.webAppProcess.killed;
  }

  getUrl(): string {
    return TEST_URL;
  }
}
