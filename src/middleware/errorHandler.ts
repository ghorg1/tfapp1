import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const message = err.message;

  let status = 400;
  if (message.includes('Authentication required') || message.includes('Invalid token') || message.includes('Invalid credentials') || message.includes('Account is deactivated')) {
    status = 401;
  } else if (message.includes('Access denied') || message.includes('Not authorized')) {
    status = 403;
  } else if (message.includes('not found') || message.includes('Not found')) {
    status = 404;
  }

  res.status(status).json({ error: message });
};

export default errorHandler;
