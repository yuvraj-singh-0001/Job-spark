require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const schedule = require('node-schedule');
const { expireOldJobs } = require('./src/jobs/job-expiration-cleanup');

const app = express();

// Middlewares
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN,
    'https://jobion.in',
    'https://www.jobion.in',
    'https://api.jobion.in',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://accounts.google.com',
    'https://oauth2.googleapis.com',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Headers for Google Sign-In compatibility
app.use((req, res, next) => {
  // Remove COOP header that can block Google Sign-In
  res.removeHeader('Cross-Origin-Opener-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');

  // Add necessary headers for OAuth
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');

  // Special handling for Google OAuth requests - only add missing headers
  if (req.path.includes('/auth/google') || req.headers.origin?.includes('google') || req.headers.origin?.includes('googleusercontent')) {
    // Ensure CORS headers are properly set for Google OAuth (don't override existing ones)
    if (!res.get('Access-Control-Allow-Origin')) {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    }
    if (!res.get('Access-Control-Allow-Credentials')) {
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    if (!res.get('Access-Control-Max-Age')) {
      res.header('Access-Control-Max-Age', '86400'); // 24 hours
    }
  }

  next();
});

// Input validation middleware for SQL injection prevention
const { validateInput, validateJobFilters } = require('./src/middlewares/inputValidation');

// Skip input validation for Google OAuth endpoint
app.use((req, res, next) => {
  if (req.path === '/api/auth/google') {
    return next();
  }
  validateInput(req, res, next);
});

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, 'src', 'api', 'uploads');

// Middleware to handle PDF files with inline disposition
app.use('/uploads', (req, res, next) => {
  // Check if the request is for a PDF file
  if (req.path.toLowerCase().endsWith('.pdf')) {
    // Set headers to display PDF inline in browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
  }
  next();
});

app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
const routes = require('./src/routes/routes');
app.use('/api', routes);

// API 404 handler
app.use((req, res) => {
  if (req.path?.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Schedule job expiration cleanup to run daily at 2 AM
schedule.scheduleJob('0 2 * * *', async () => {
  try {
    console.log('Scheduled job cleanup started...');
    await expireOldJobs();
  } catch (error) {
    console.error('Scheduled job cleanup failed:', error);
  }
});

// Also run cleanup on server start (for development/testing)
if (process.env.NODE_ENV !== 'production') {
  expireOldJobs().catch(console.error);
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;