import { Queue } from 'bullmq';
import { getRedisConnection } from '../config/redis';

let emailQueue: Queue | null = null;
let scheduledQueue: Queue | null = null;

function getEmailQueue(): Queue {
  if (!emailQueue) {
    emailQueue = new Queue('email', { connection: getRedisConnection() });
  }
  return emailQueue;
}

function getScheduledQueue(): Queue {
  if (!scheduledQueue) {
    scheduledQueue = new Queue('scheduled', { connection: getRedisConnection() });
  }
  return scheduledQueue;
}

export async function enqueueTaskAssigned(taskId: number, assignedTo: number, assignedBy: number): Promise<void> {
  await getEmailQueue().add('task-assigned', { taskId, assignedTo, assignedBy });
}

export async function enqueueCommentAdded(taskId: number, userId: number, commentId: number): Promise<void> {
  await getEmailQueue().add('comment-added', { taskId, userId, commentId });
}

export async function setupRecurringJobs(): Promise<void> {
  const queue = getScheduledQueue();
  await queue.add('due-date-reminder', {}, {
    repeat: { pattern: '0 * * * *' },
  });
  await queue.add('daily-report', {}, {
    repeat: { pattern: '0 8 * * *' },
  });
}
