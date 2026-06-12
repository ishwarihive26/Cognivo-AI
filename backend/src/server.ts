/**
 * Cognivo AI Backend Server
 * Express.js application with MongoDB integration
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config/env';

const app: Express = express();

// ========================
// MIDDLEWARE
// ========================

// CORS Configuration
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ========================
// DATABASE CONNECTION
// ========================

/**
 * Connect to MongoDB
 */
async function connectDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// ========================
// HEALTH CHECK ROUTES
// ========================

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

/**
 * API status endpoint
 */
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    api: 'Cognivo AI Backend',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date(),
  });
});

// ========================
// API ROUTES (To be added)
// ========================

// app.use('/api/auth', authRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/images', imageRoutes);
// app.use('/api/voice', voiceRoutes);
// app.use('/api/analytics', analyticsRoutes);

// ========================
// ERROR HANDLING
// ========================

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date(),
  });
});

/**
 * Global Error Handler
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    statusCode,
    timestamp: new Date(),
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ========================
// SERVER STARTUP
// ========================

/**
 * Start server
 */
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(config.PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${config.PORT}`);
      console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
      console.log(`🔧 API Status: http://localhost:${config.PORT}/api/status`);
      console.log(`📝 Environment: ${config.NODE_ENV}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start server
startServer();

export default app;