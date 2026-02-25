import * as taskModel from '../models/taskModel';
import { Task } from '../models/taskModel';

export async function createTask(title: string, userId: number): Promise<Task> {
  if (!title) throw new Error('Title required');
  return taskModel.createTask(title, userId);
}

export async function getTasks(): Promise<Task[]> {
  return taskModel.getTasks();
}
