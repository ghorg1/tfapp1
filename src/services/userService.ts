import * as userModel from '../models/userModel';
import { User } from '../models/userModel';

export async function createUser(name: string): Promise<User> {
  if (!name) throw new Error('Name required');
  return userModel.createUser(name);
}

export async function getUsers(): Promise<User[]> {
  return userModel.getAllUsers();
}
