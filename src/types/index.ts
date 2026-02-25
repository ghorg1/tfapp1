export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum TaskStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum AuditAction {
  TASK_CREATED = 'task_created',
  TASK_UPDATED = 'task_updated',
  TASK_DELETED = 'task_deleted',
}

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  active: boolean;
  role: UserRole;
  created_at: Date;
}

export type SafeUser = Omit<User, 'password_hash'>;

export interface Project {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  deleted_at: Date | null;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  user_id: number;
  project_id: number | null;
  status: TaskStatus;
  assigned_to: number | null;
  due_date: Date | null;
  deleted_at: Date | null;
  created_at: Date;
}

export interface Tag {
  id: number;
  name: string;
  created_at: Date;
}

export interface TaskTag {
  task_id: number;
  tag_id: number;
}

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  body: string;
  created_at: Date;
}

export interface TaskHistory {
  id: number;
  task_id: number;
  user_id: number;
  action: AuditAction;
  changes: Record<string, unknown>;
  created_at: Date;
}

export interface JwtPayload {
  userId: number;
  role: UserRole;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface CreateTaskInput {
  title: string;
  userId: number;
  projectId?: number;
  assignedTo?: number;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  status?: TaskStatus;
  assignedTo?: number | null;
  dueDate?: string | null;
  projectId?: number | null;
}

export interface CreateCommentInput {
  body: string;
}
