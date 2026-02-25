import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel';
import { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } from '../config/auth';
import { RegisterInput, LoginInput, JwtPayload, UserRole } from '../types';

function generateToken(userId: number, role: UserRole): string {
  const payload: JwtPayload = { userId, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export async function register(input: RegisterInput) {
  const { name, email, password } = input;

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await userModel.createUser(name, email, passwordHash);
  const token = generateToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

export async function login(input: LoginInput) {
  const { email, password } = input;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.active) {
    throw new Error('Account is deactivated');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}
