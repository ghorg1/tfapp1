import { Request, Response, NextFunction } from 'express';
import * as tagService from '../services/tagService';

export async function createTag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tag = await tagService.createTag(req.body.name);
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
}

export async function getAllTags(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tags = await tagService.getAllTags();
    res.json(tags);
  } catch (err) {
    next(err);
  }
}

export async function addTagToTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await tagService.addTagToTask(Number(req.body.taskId), Number(req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function removeTagFromTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await tagService.removeTagFromTask(Number(req.body.taskId), Number(req.params.id));
    res.json({ message: 'Tag removed from task' });
  } catch (err) {
    next(err);
  }
}

export async function getTagsForTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tags = await tagService.getTagsForTask(Number(req.params.taskId));
    res.json(tags);
  } catch (err) {
    next(err);
  }
}

export async function deleteTag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await tagService.deleteTag(Number(req.params.id));
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    next(err);
  }
}
