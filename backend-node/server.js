const express = require('express');
const cors = require('cors');
require('dotenv').config();

const extensionRoutes = require('./routes/extensions');

const app = express();
const PORT = process.env.PORT || 8080;

// Allow requests from React frontend
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api/extensions', extensionRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Extensio.ai API',
    version: '1.0.0'
  });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    service: 'Extensio.ai',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware (handles JSON parsing body errors, etc.)
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

const server = app.listen(PORT, () => {
  console.log(`Extensio.ai server running on port ${PORT}`);
});

// Handle server startup errors (e.g. EADDRINUSE)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[FATAL ERROR] Port ${PORT} is already in use.`);
    console.error(`Please close any application using port ${PORT} or run with a different PORT environment variable (e.g. PORT=8081).\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});