import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import database configuration
import dbConnect from './src/config/db.js';

// Import routes
import authRoutes from './src/routes/auth.js';
import courseRoutes from './src/routes/courses.js';
import orderRoutes from './src/routes/orders.js';
import videoRoutes from './src/routes/videos.js';
import uploadRoutes from './src/routes/upload.js';

// Load environment variables
dotenv.config();

// ES6 module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================================
// ROUTES CONFIGURATION
// ========================================

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'DevCourse API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      orders: '/api/orders',
      videos: '/api/videos',
      upload: '/api/upload',
      health: '/api/health'
    }
  });
});

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========================================
// SERVER STARTUP
// ========================================

const startServer = async () => {
  try {
    // Connect to database
    await dbConnect();
    
    // Start server
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();