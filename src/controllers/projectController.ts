import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/projectService';

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await projectService.createProject(
      req.body.name,
      req.body.description || null,
      req.user!
    );
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projects = await projectService.getProjects(req.user!);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await projectService.getProjectById(Number(req.params.id), req.user!);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await projectService.updateProject(
      Number(req.params.id),
      req.body.name,
      req.body.description || null,
      req.user!
    );
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await projectService.deleteProject(Number(req.params.id), req.user!);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
}
