import dotenv from 'dotenv';
dotenv.config();

import { startEmailWorker } from './workers/emailWorker';
import { startScheduledWorker } from './workers/scheduledWorker';
import { setupRecurringJobs } from './queues';

async function main() {
  console.log('Starting workers...');

  startEmailWorker();
  console.log('Email worker started');

  startScheduledWorker();
  console.log('Scheduled worker started');

  await setupRecurringJobs();
  console.log('Recurring jobs configured');

  console.log('All workers running. Press Ctrl+C to stop.');
}

main().catch((err) => {
  console.error('Worker startup failed:', err);
  process.exit(1);
});
