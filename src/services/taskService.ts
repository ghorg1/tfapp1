import * as taskModel from '../models/taskModel';
import * as userModel from '../models/userModel';
import * as taskHistoryModel from '../models/taskHistoryModel';
import { JwtPayload, UserRole, AuditAction, CreateTaskInput, UpdateTaskInput, TaskStatus } from '../types';
import { enqueueTaskAssigned } from '../jobs/queues';

export async function createTask(input: CreateTaskInput, user: JwtPayload) {
  const { title, userId, projectId, assignedTo, dueDate } = input;
  if (!title) throw new Error('Title required');

  if (assignedTo) {
    const assignee = await userModel.findById(assignedTo);
    if (!assignee || !assignee.active) {
      throw new Error('Cannot assign to inactive or non-existent user');
    }
  }

  const task = await taskModel.createTask(title, userId, projectId, assignedTo, dueDate);

  await taskHistoryModel.recordHistory(task.id, user.userId, AuditAction.TASK_CREATED, {
    title, projectId, assignedTo, dueDate,
  });

  if (assignedTo) {
    try {
      await enqueueTaskAssigned(task.id, assignedTo, user.userId);
    } catch {
      // Redis not available — skip notification
    }
  }

  return task;
}

export async function getTaskById(id: number) {
  const task = await taskModel.findById(id);
  if (!task) throw new Error('Task not found');
  return task;
}

export async function getTasks(filters?: {
  projectId?: number;
  status?: TaskStatus;
  assignedTo?: number;
  userId?: number;
}) {
  return taskModel.getTasks(filters);
}

export async function updateTask(id: number, input: UpdateTaskInput, user: JwtPayload) {
  const task = await taskModel.findById(id);
  if (!task) throw new Error('Task not found');

  if (task.user_id !== user.userId && task.assigned_to !== user.userId && user.role !== UserRole.ADMIN) {
    throw new Error('Not authorized to update this task');
  }

  if (input.assignedTo !== undefined && input.assignedTo !== null) {
    const assignee = await userModel.findById(input.assignedTo);
    if (!assignee || !assignee.active) {
      throw new Error('Cannot assign to inactive or non-existent user');
    }
  }

  const fields: Record<string, unknown> = {};
  if (input.title !== undefined) fields.title = input.title;
  if (input.status !== undefined) fields.status = input.status;
  if (input.assignedTo !== undefined) fields.assigned_to = input.assignedTo;
  if (input.dueDate !== undefined) fields.due_date = input.dueDate;
  if (input.projectId !== undefined) fields.project_id = input.projectId;

  const updated = await taskModel.updateTask(id, fields);

  await taskHistoryModel.recordHistory(task.id, user.userId, AuditAction.TASK_UPDATED, fields);

  if (input.assignedTo && input.assignedTo !== task.assigned_to) {
    try {
      await enqueueTaskAssigned(task.id, input.assignedTo, user.userId);
    } catch {
      // Redis not available — skip notification
    }
  }

  return updated;
}

export async function deleteTask(id: number, user: JwtPayload) {
  const task = await taskModel.findById(id);
  if (!task) throw new Error('Task not found');

  if (task.user_id !== user.userId && user.role !== UserRole.ADMIN) {
    throw new Error('Not authorized to delete this task');
  }

  await taskHistoryModel.recordHistory(task.id, user.userId, AuditAction.TASK_DELETED, {});

  return taskModel.softDelete(id);
}

export async function getTaskHistory(taskId: number) {
  const task = await taskModel.findById(taskId);
  if (!task) throw new Error('Task not found');
  return taskHistoryModel.getHistoryByTask(taskId);
}
