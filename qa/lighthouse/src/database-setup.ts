import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = promisify(exec);

export class DatabaseSetup {
  private podverseOpsPath: string;

  constructor() {
    // Find podverse-ops directory relative to podverse-web
    // podverse-web is at: /path/to/podverse-web
    // podverse-ops should be at: /path/to/podverse-ops (sibling directory)
    const currentDir = __dirname;
    const webRoot = path.resolve(currentDir, '../../../');
    const opsRoot = path.resolve(webRoot, '../podverse-ops');
    
    this.podverseOpsPath = opsRoot;
  }

  async checkContainerRunning(): Promise<boolean> {
    try {
      const { stdout } = await execAsync('docker ps -a --filter "name=podverse_test_db" --format "{{.Names}}"');
      return stdout.trim() === 'podverse_test_db';
    } catch (error) {
      return false;
    }
  }

  async checkContainerUp(): Promise<boolean> {
    try {
      const { stdout } = await execAsync('docker ps --filter "name=podverse_test_db" --format "{{.Names}}"');
      return stdout.trim() === 'podverse_test_db';
    } catch (error) {
      return false;
    }
  }

  async ensureNetworkExists(): Promise<void> {
    const networkName = 'podverse_test_network';
    try {
      // Check if network exists
      const { stdout } = await execAsync(`docker network ls --filter "name=${networkName}" --format "{{.Name}}"`);
      if (stdout.trim() === networkName) {
        console.log(`   ✅ Network ${networkName} already exists`);
        return;
      }
      
      // Network doesn't exist, create it
      console.log(`   → Creating Docker network ${networkName}...`);
      await execAsync(`docker network create ${networkName}`);
      console.log(`   ✅ Network ${networkName} created`);
    } catch (error: any) {
      // Check if error is because network already exists (race condition)
      if (error.message && error.message.includes('already exists')) {
        console.log(`   ✅ Network ${networkName} already exists`);
        return;
      }
      throw new Error(`Failed to create Docker network ${networkName}: ${error.message}`);
    }
  }

  async ensureTestDatabaseUp(): Promise<void> {
    // Ensure the Docker network exists first
    await this.ensureNetworkExists();
    
    const containerExists = await this.checkContainerRunning();
    
    if (!containerExists) {
      console.log('📦 Test database container not found. Starting it...');
      await this.runMakeCommand('test_db_up');
      // Wait a bit for container to be ready
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      const isUp = await this.checkContainerUp();
      if (!isUp) {
        console.log('📦 Test database container exists but is not running. Starting it...');
        await this.runMakeCommand('test_db_up');
        // Wait a bit for container to be ready
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        console.log('✅ Test database container is running');
      }
    }
  }

  async resetTestDatabase(): Promise<void> {
    console.log('🔄 Resetting test database...');
    try {
      await this.runMakeCommand('test_db_reinit');
      console.log('✅ Test database reset and initialized');
    } catch (error) {
      console.error('❌ Failed to reset test database:', error);
      throw new Error(
        'Failed to reset test database. Please ensure:\n' +
        '1. Docker is running\n' +
        '2. You can run "make test_db_reinit" manually from podverse-ops directory\n' +
        '3. The test database container is accessible'
      );
    }
  }

  private async runMakeCommand(target: string): Promise<void> {
    if (!fs.existsSync(this.podverseOpsPath)) {
      throw new Error(
        `podverse-ops directory not found at: ${this.podverseOpsPath}\n` +
        'Please ensure podverse-ops is a sibling directory to podverse-web'
      );
    }

    console.log(`   → Running: make ${target} (in ${this.podverseOpsPath})`);
    
    try {
      const { stdout, stderr } = await execAsync(
        `make ${target}`,
        {
          cwd: this.podverseOpsPath,
          env: { ...process.env },
          maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
        }
      );

      // Output stdout if present (make commands often output useful info)
      if (stdout && stdout.trim()) {
        const lines = stdout.trim().split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            console.log(`      ${line}`);
          }
        });
      }

      if (stderr && !stderr.includes('WARNING')) {
        // Some make commands output to stderr but are successful
        // Only treat as error if it's not a warning
        if (!stderr.includes('Creating') && !stderr.includes('Starting') && !stderr.includes('Up')) {
          console.warn('   ⚠️  Make command stderr:', stderr);
        } else if (stderr.includes('Creating') || stderr.includes('Starting') || stderr.includes('Up')) {
          console.log(`      ${stderr.trim()}`);
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || String(error);
      throw new Error(`Make command failed: ${errorMessage}`);
    }
  }
}
