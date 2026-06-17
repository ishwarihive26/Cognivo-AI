/**
 * Authentication Routes
 * POST /register - Register new user
 * POST /login - Login user
 * GET /me - Get current user
 * POST /logout - Logout user
 */

import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';
import { config } from '../config/env';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters',
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered',
      });
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      String(config.JWT_SECRET),
      {
        expiresIn: '7d',
      }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);

    res.status(500).json({
      error: 'Failed to register user',
    });
  }
});

/**
 * POST /login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Compare password
    const isPasswordValid =
      await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      String(config.JWT_SECRET),
      {
        expiresIn: '7d',
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);

    res.status(500).json({
      error: 'Failed to login',
    });
  }
});

/**
 * GET /me
 */
router.get(
  '/me',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(
        (req as any).userId
      );

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Get User Error:', error);

      res.status(500).json({
        error: 'Failed to get user',
      });
    }
  }
);

/**
 * POST /logout
 */
router.post(
  '/logout',
  authMiddleware,
  (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
);

export default router;