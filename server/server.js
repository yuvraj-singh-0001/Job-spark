require('dotenv').config();
const express = require('express');
const applyMiddlewares = require('./src/middlewares/auth');

const app = express();

// Enable CORS globally (this covers preflight OPTIONS too)
applyMiddlewares(app);

// If you still want an explicit options handler, use '/*' instead of '*'
// app.options('/*', cors(corsOptions));


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

try {
  const router = require('./src/routes/router');
  app.use('/api', router);
} catch (e) {
  // Log the error so you know why router failed to load during development
  console.error('Failed to load router:', e.message || e);
}

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
