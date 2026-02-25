import { Worker, Job } from 'bullmq';
import { getRedisConnection } from '../../config/redis';

export function startScheduledWorker(): Worker {
  const worker = new Worker(
    'scheduled',
    async (job: Job) => {
      switch (job.name) {
        case 'due-date-reminder':
          console.log(`[Scheduled] Checking for tasks due soon...`);
          // In production: query tasks due within 24 hours and send reminders
          break;
        case 'daily-report':
          console.log(`[Scheduled] Generating daily report...`);
          // In production: aggregate task stats and send summary email
          break;
        default:
          console.log(`[Scheduled] Unknown job: ${job.name}`);
      }
    },
    { connection: getRedisConnection() }
  );

  worker.on('completed', (job) => {
    console.log(`[Scheduled] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Scheduled] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
