require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// CORS (clean setup)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const allowlist = new Set([CLIENT_ORIGIN]);
const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl) or matching allowlist
    if (!origin || allowlist.has(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 204,
};

// Enable CORS globally (this covers preflight OPTIONS too)
app.use(cors(corsOptions));

// If you still want an explicit options handler, use '/*' instead of '*'
// app.options('/*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

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
