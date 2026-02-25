import * as userModel from '../models/userModel';
import { JwtPayload, UserRole } from '../types';

export async function getUsers() {
  return userModel.getAllUsers();
}

export async function deactivateUser(id: number, user: JwtPayload) {
  if (user.role !== UserRole.ADMIN) {
    throw new Error('Access denied');
  }
  const updated = await userModel.setActive(id, false);
  if (!updated) throw new Error('User not found');
  return updated;
}

export async function activateUser(id: number, user: JwtPayload) {
  if (user.role !== UserRole.ADMIN) {
    throw new Error('Access denied');
  }
  const updated = await userModel.setActive(id, true);
  if (!updated) throw new Error('User not found');
  return updated;
}
