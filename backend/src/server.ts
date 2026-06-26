/**
 * Cognivo AI Backend Server
 * Express.js + MongoDB
 */

import express, {
  Express,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';

import cors from 'cors';
import mongoose from 'mongoose';

import { config } from './config/env';

import authRoutes from './routes/auth';

const app: Express = express();

// ========================
// MIDDLEWARE
// ========================

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger
app.use(
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      console.log(
        `[${new Date().toISOString()}] ${req.method} ${
          req.path
        } ${res.statusCode} (${duration}ms)`
      );
    });

    next();
  }
);

// ========================
// ROUTES
// ========================

app.use('/api/auth', authRoutes);

// Health check
app.get(
  '/health',
  (req: Request, res: Response) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
      database:
        mongoose.connection.readyState === 1
          ? 'connected'
          : 'disconnected',
    });
  }
);

// API status
app.get(
  '/api/status',
  (req: Request, res: Response) => {
    res.json({
      api: 'Cognivo AI Backend',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
    });
  }
);

// ========================
// DATABASE CONNECTION
// ========================

async function connectDatabase(): Promise<void> {
  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(config.MONGODB_URI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(
      'MongoDB connection failed:',
      error
    );

    process.exit(1);
  }
}

// ========================
// 404 HANDLER
// ========================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// ========================
// GLOBAL ERROR HANDLER
// ========================

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Server Error:', err);

  const statusCode =
    err.statusCode || err.status || 500;

  res.status(statusCode).json({
    error:
      err.message || 'Internal server error',

    code: err.code || 'INTERNAL_ERROR',

    statusCode,

    timestamp: new Date().toISOString(),

    ...(config.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

app.use(errorHandler);

// ========================
// START SERVER
// ========================

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    const server = app.listen(
      Number(config.PORT),
      () => {
        console.log(
          `Server running on http://localhost:${config.PORT}`
        );

        console.log(
          `Health: http://localhost:${config.PORT}/health`
        );

        console.log(
          `API Status: http://localhost:${config.PORT}/api/status`
        );

        console.log(
          `Environment: ${config.NODE_ENV}`
        );
      }
    );

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log(
        'SIGTERM received. Closing server...'
      );

      server.close(() => {
        mongoose.connection.close().then(() => {
          console.log(
            'MongoDB disconnected'
          );

          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error(
      'Failed to start server:',
      error
    );

    process.exit(1);
  }
}

// ========================
// PROCESS ERROR HANDLERS
// ========================

process.on(
  'unhandledRejection',
  (reason: any) => {
    console.error(
      'Unhandled Rejection:',
      reason
    );
  }
);

process.on(
  'uncaughtException',
  (error: Error) => {
    console.error(
      'Uncaught Exception:',
      error
    );

    process.exit(1);
  }
);

// ========================
// START APP
// ========================

startServer();

export default app;