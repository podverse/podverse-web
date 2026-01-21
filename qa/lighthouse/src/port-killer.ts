import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Kill any process using the specified port
 * @param port Port number to free up
 * @returns true if a process was killed, false otherwise
 */
export async function killProcessOnPort(port: number): Promise<boolean> {
  try {
    // Find process ID(s) using the port
    const { stdout: pids } = await execAsync(`lsof -ti:${port} || echo ""`);
    const pidList = pids.trim();
    
    if (!pidList) {
      return false; // No process using this port
    }

    // Kill all processes using this port
    const pidsArray = pidList.split('\n').filter(pid => pid.trim());
    if (pidsArray.length === 0) {
      return false;
    }

    console.log(`   → Found process(es) on port ${port}: ${pidsArray.join(', ')}`);
    console.log(`   → Killing process(es)...`);
    
    // Try graceful kill first (SIGTERM)
    for (const pid of pidsArray) {
      try {
        await execAsync(`kill -TERM ${pid}`);
      } catch {
        // Process might already be gone, try force kill
        try {
          await execAsync(`kill -KILL ${pid}`);
        } catch {
          // Process already gone, continue
        }
      }
    }

    // Wait a moment for processes to exit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify port is now free (try SIGKILL if still in use)
    const { stdout: remainingPids } = await execAsync(`lsof -ti:${port} || echo ""`);
    if (remainingPids.trim()) {
      const remaining = remainingPids.trim().split('\n').filter(pid => pid.trim());
      console.log(`   → Force killing remaining process(es): ${remaining.join(', ')}`);
      for (const pid of remaining) {
        try {
          await execAsync(`kill -KILL ${pid}`);
        } catch {
          // Ignore errors
        }
      }
      // Wait again
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`   ✅ Port ${port} is now free`);
    return true;
  } catch (error) {
    // If lsof is not available or command fails, assume no process is using the port
    return false;
  }
}
