const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

function applyMiddlewares(app) {
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const allowlist = new Set([CLIENT_ORIGIN]);
  const corsOptions = {
    origin(origin, callback) {
      if (!origin || allowlist.has(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 204,
  };

  // CORS + parsers
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
}

module.exports = applyMiddlewares;