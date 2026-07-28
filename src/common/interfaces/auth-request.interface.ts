import { Request } from 'express';

export interface AuthUser {
  id: number;
  email?: string;
  phone?: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}
