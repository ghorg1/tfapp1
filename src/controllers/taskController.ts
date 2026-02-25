import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/taskService';
import { TaskStatus } from '../types';

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.createTask({
      title: req.body.title,
      userId: req.user!.userId,
      projectId: req.body.projectId,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
    }, req.user!);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters: {
      projectId?: number;
      status?: TaskStatus;
      assignedTo?: number;
      userId?: number;
    } = {};
    if (req.query.projectId) filters.projectId = Number(req.query.projectId);
    if (req.query.status) filters.status = req.query.status as TaskStatus;
    if (req.query.assignedTo) filters.assignedTo = Number(req.query.assignedTo);
    if (req.query.userId) filters.userId = Number(req.query.userId);

    const tasks = await taskService.getTasks(filters);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.getTaskById(Number(req.params.id));
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.updateTask(Number(req.params.id), {
      title: req.body.title,
      status: req.body.status,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      projectId: req.body.projectId,
    }, req.user!);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await taskService.deleteTask(Number(req.params.id), req.user!);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
}

export async function getTaskHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const history = await taskService.getTaskHistory(Number(req.params.id));
    res.json(history);
  } catch (err) {
    next(err);
  }
}
