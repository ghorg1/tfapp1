import * as commentModel from '../models/commentModel';
import * as taskModel from '../models/taskModel';
import { JwtPayload } from '../types';
import { enqueueCommentAdded } from '../jobs/queues';

export async function addComment(taskId: number, body: string, user: JwtPayload) {
  if (!body) throw new Error('Comment body is required');
  const task = await taskModel.findById(taskId);
  if (!task) throw new Error('Task not found');

  const comment = await commentModel.createComment(taskId, user.userId, body);

  try {
    await enqueueCommentAdded(taskId, user.userId, comment.id);
  } catch {
    // Redis not available — skip notification
  }

  return comment;
}

export async function getComments(taskId: number) {
  const task = await taskModel.findById(taskId);
  if (!task) throw new Error('Task not found');
  return commentModel.getCommentsByTask(taskId);
}
