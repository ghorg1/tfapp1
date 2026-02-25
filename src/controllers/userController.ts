import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function deactivateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.deactivateUser(Number(req.params.id), req.user!);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function activateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.activateUser(Number(req.params.id), req.user!);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
