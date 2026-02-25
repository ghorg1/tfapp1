import { Worker, Job } from 'bullmq';
import { getRedisConnection } from '../../config/redis';

export function startEmailWorker(): Worker {
  const worker = new Worker(
    'email',
    async (job: Job) => {
      switch (job.name) {
        case 'task-assigned':
          console.log(`[Email] Task ${job.data.taskId} assigned to user ${job.data.assignedTo} by user ${job.data.assignedBy}`);
          break;
        case 'comment-added':
          console.log(`[Email] Comment ${job.data.commentId} added to task ${job.data.taskId} by user ${job.data.userId}`);
          break;
        default:
          console.log(`[Email] Unknown job: ${job.name}`);
      }
    },
    { connection: getRedisConnection() }
  );

  worker.on('completed', (job) => {
    console.log(`[Email] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Email] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
