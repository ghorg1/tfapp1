import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/commentService';

export async function addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const comment = await commentService.addComment(
      Number(req.params.taskId),
      req.body.body,
      req.user!
    );
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const comments = await commentService.getComments(Number(req.params.taskId));
    res.json(comments);
  } catch (err) {
    next(err);
  }
}
