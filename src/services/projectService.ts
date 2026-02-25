import * as projectModel from '../models/projectModel';
import * as taskModel from '../models/taskModel';
import { JwtPayload, UserRole } from '../types';

export async function createProject(name: string, description: string | null, user: JwtPayload) {
  if (!name) throw new Error('Project name is required');
  return projectModel.createProject(name, description, user.userId);
}

export async function getProjects(user: JwtPayload) {
  if (user.role === UserRole.ADMIN) {
    return projectModel.getAllProjects();
  }
  return projectModel.getProjectsByOwner(user.userId);
}

export async function getProjectById(id: number, user: JwtPayload) {
  const project = await projectModel.findById(id);
  if (!project) throw new Error('Project not found');
  if (project.owner_id !== user.userId && user.role !== UserRole.ADMIN) {
    throw new Error('Access denied');
  }
  return project;
}

export async function updateProject(id: number, name: string, description: string | null, user: JwtPayload) {
  const project = await projectModel.findById(id);
  if (!project) throw new Error('Project not found');
  if (project.owner_id !== user.userId && user.role !== UserRole.ADMIN) {
    throw new Error('Access denied');
  }
  if (!name) throw new Error('Project name is required');
  return projectModel.updateProject(id, name, description);
}

export async function deleteProject(id: number, user: JwtPayload) {
  const project = await projectModel.findById(id);
  if (!project) throw new Error('Project not found');
  if (project.owner_id !== user.userId && user.role !== UserRole.ADMIN) {
    throw new Error('Access denied');
  }
  await taskModel.softDeleteByProjectId(id);
  return projectModel.softDelete(id);
}
