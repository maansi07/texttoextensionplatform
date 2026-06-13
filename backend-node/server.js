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

app.listen(PORT, () => {
  console.log(`Extensio.ai server running on port ${PORT}`);
});