import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
