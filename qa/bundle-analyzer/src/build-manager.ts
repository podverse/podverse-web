import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class BuildManager {
  private podverseWebPath: string;
  private buildProcess: ChildProcess | null = null;

  constructor() {
    // Calculate path to podverse-web root (3 levels up from qa/bundle-analyzer/src)
    const currentDir = __dirname;
    const webRoot = path.resolve(currentDir, '../../../');
    this.podverseWebPath = webRoot;
  }

  async buildWithAnalyzer(): Promise<{
    serverHtml?: string;
    clientHtml?: string;
    serverStatsJson?: string;
    clientStatsJson?: string;
  }> {
    console.log('🔨 Building Next.js app with bundle analyzer...');
    console.log(`   Working directory: ${this.podverseWebPath}`);

    // Set environment variable to enable bundle analyzer
    const env = {
      ...process.env,
      ANALYZE: 'true',
      NODE_ENV: 'production',
    };

    return new Promise((resolve, reject) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: this.podverseWebPath,
        env,
        stdio: ['inherit', 'pipe', 'pipe'],
        shell: true,
      });

      let stdout = '';
      let stderr = '';

      buildProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        process.stdout.write(output);
      });

      buildProcess.stderr?.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        process.stderr.write(output);
      });

      buildProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Build failed with exit code ${code}\n${stderr}`));
          return;
        }

        // Bundle analyzer generates HTML files in .next/analyze/ directory
        const analyzeDir = path.join(this.podverseWebPath, '.next', 'analyze');
        
        let serverHtml: string | undefined;
        let clientHtml: string | undefined;
        let serverStatsJson: string | undefined;
        let clientStatsJson: string | undefined;

        if (fs.existsSync(analyzeDir)) {
          const files = fs.readdirSync(analyzeDir);
          const jsonFiles = files.filter(file => file.endsWith('.json'));
          const unlabeledJsonFiles: Array<{ file: string; content: string }> = [];
          
          // Look for server and client bundle HTML files
          // @next/bundle-analyzer may output files with various naming patterns
          const htmlFiles = files.filter(file => file.endsWith('.html'));

          for (const file of files) {
            const filePath = path.join(analyzeDir, file);
            const lowerFile = file.toLowerCase();

            if (file.endsWith('.html')) {
              // Check for server bundle (common patterns: server.html, server-bundle.html, etc.)
              if (lowerFile.includes('server') && !serverHtml) {
                serverHtml = fs.readFileSync(filePath, 'utf-8');
              } 
              // Check for client bundle (common patterns: client.html, client-bundle.html, etc.)
              else if (lowerFile.includes('client') && !clientHtml) {
                clientHtml = fs.readFileSync(filePath, 'utf-8');
              }
              // Fallback: if only one HTML file, assume it's the client bundle
              else if (htmlFiles.length === 1 && !clientHtml) {
                clientHtml = fs.readFileSync(filePath, 'utf-8');
              }
            } else if (file.endsWith('.json')) {
              const content = fs.readFileSync(filePath, 'utf-8');
              if (lowerFile.includes('server') && !serverStatsJson) {
                serverStatsJson = content;
              } else if (lowerFile.includes('client') && !clientStatsJson) {
                clientStatsJson = content;
              } else {
                unlabeledJsonFiles.push({ file, content });
              }
            }
          }

          if (!clientStatsJson && jsonFiles.length === 1 && unlabeledJsonFiles.length === 1) {
            clientStatsJson = unlabeledJsonFiles[0].content;
          } else if (unlabeledJsonFiles.length > 0) {
            if (!clientStatsJson) {
              clientStatsJson = unlabeledJsonFiles[0].content;
            }
            if (!serverStatsJson && unlabeledJsonFiles.length > 1) {
              serverStatsJson = unlabeledJsonFiles[1].content;
            }
          }
        } else {
          console.warn('⚠️  Bundle analyzer output directory not found. Reports may not have been generated.');
        }

        resolve({ serverHtml, clientHtml, serverStatsJson, clientStatsJson });
      });

      buildProcess.on('error', (error) => {
        reject(error);
      });

      this.buildProcess = buildProcess;
    });
  }

  async stop(): Promise<void> {
    if (this.buildProcess) {
      this.buildProcess.kill();
      this.buildProcess = null;
    }
  }
}
