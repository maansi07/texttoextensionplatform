const express = require('express');
const cors = require('cors');
require('dotenv').config();

const extensionRoutes = require('./routes/extensions');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/extensions', extensionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Extensio.ai API' });
});

app.listen(PORT, () => {
  console.log(`Extensio.ai server running on port ${PORT}`);
});