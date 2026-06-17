/**
 * Authentication Middleware
 * Verifies JWT token and extracts user ID
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: 'No authorization token provided',
      });
    }

    // Extract token (Bearer <token>)
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: 'Invalid authorization header format',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
      });
    }

    res.status(401).json({
      error: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication middleware
 * Does not fail if no token, but extracts user if present
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;
      req.userId = decoded.userId;
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
  }
  next();
};