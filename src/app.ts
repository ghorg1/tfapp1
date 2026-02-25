import express, { Request, Response, NextFunction } from 'express';
import { initSchema } from './config/schema';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import tagRoutes from './routes/tagRoutes';
import commentRoutes from './routes/commentRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(express.json());

let initialized = false;

async function ensureInit(): Promise<void> {
  if (!initialized) {
    await initSchema();
    initialized = true;
  }
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
  await ensureInit();
  next();
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);
app.use('/tags', tagRoutes);
app.use('/tasks/:taskId/comments', commentRoutes);
app.use(errorHandler);

export default app;
