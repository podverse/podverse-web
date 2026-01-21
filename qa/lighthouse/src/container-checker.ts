import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

interface ContainerStatus {
  name: string;
  isRunning: boolean;
  port?: number;
}

export class ContainerChecker {
  private requiredContainers = [
    { name: 'podverse_local_mq', port: 5672, description: 'Message Queue (ActiveMQ Artemis)' },
    { name: 'podverse_local_keyvaldb', port: 6379, description: 'Key-Value DB (Redis)' },
  ];

  async checkContainerRunning(containerName: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync(
        `docker ps --filter "name=${containerName}" --format "{{.Names}}" | grep -q "^${containerName}$" && echo "running" || echo "not_running"`
      );
      return stdout.trim() === 'running';
    } catch {
      return false;
    }
  }

  async checkContainerPort(containerName: string, port: number): Promise<boolean> {
    try {
      const { stdout } = await execAsync(
        `docker port ${containerName} 2>/dev/null | grep ":${port}" || echo ""`
      );
      return stdout.trim() !== '';
    } catch {
      return false;
    }
  }

  async checkAllContainers(): Promise<{ allRunning: boolean; statuses: ContainerStatus[] }> {
    const statuses: ContainerStatus[] = [];

    for (const container of this.requiredContainers) {
      const isRunning = await this.checkContainerRunning(container.name);
      let portOk = false;
      
      if (isRunning) {
        portOk = await this.checkContainerPort(container.name, container.port);
      }

      statuses.push({
        name: container.name,
        isRunning,
        port: portOk ? container.port : undefined,
      });
    }

    const allRunning = statuses.every(s => s.isRunning);

    return { allRunning, statuses };
  }

  async validateRequiredContainers(): Promise<void> {
    console.log('🔍 Checking required Docker containers...\n');
    
    const { allRunning, statuses } = await this.checkAllContainers();

    for (const status of statuses) {
      const container = this.requiredContainers.find(c => c.name === status.name)!;
      if (status.isRunning) {
        if (status.port) {
          console.log(`   ✅ ${container.name} is running on port ${status.port}`);
        } else {
          console.log(`   ⚠️  ${container.name} is running but port ${container.port} may not be exposed`);
        }
      } else {
        console.log(`   ❌ ${container.name} is not running`);
      }
    }

    console.log(); // Empty line

    if (!allRunning) {
      const missingContainers = statuses
        .filter(s => !s.isRunning)
        .map(s => {
          const container = this.requiredContainers.find(c => c.name === s.name)!;
          return `   - ${container.name} (${container.description}) on port ${container.port}`;
        })
        .join('\n');

      throw new Error(
        `Required Docker containers are not running. Please start the following containers:\n\n${missingContainers}\n\n` +
        `You can start them using make commands from podverse-ops:\n` +
        `  cd podverse-ops\n` +
        `  make local_mq_up          # Start message queue (port 5672)\n` +
        `  make local_keyvaldb_up    # Start keyvaldb/redis (port 6379)\n` +
        `\nOr using docker-compose directly:\n` +
        `  cd podverse-ops\n` +
        `  docker compose -f docker-compose/local/mq/docker-compose.yml up -d\n` +
        `  docker compose -f docker-compose/local/keyvaldb/docker-compose.yml up -d\n` +
        `\nThen run the tests again.`
      );
    }
  }
}
