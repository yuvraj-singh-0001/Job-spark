require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const schedule = require('node-schedule');
const { expireOldJobs } = require('./src/jobs/job-expiration-cleanup');

const app = express();

// Middlewares
// Configure CORS with a function to handle origins dynamically and prevent duplicates
const allowedOrigins = [
  'https://jobion.in',
  'https://www.jobion.in',
  'https://api.jobion.in',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://accounts.google.com',
  'https://oauth2.googleapis.com',
].filter(Boolean);

// Early middleware to ensure clean headers from the start
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path} from origin: ${req.headers.origin || 'no-origin'}`);

  // Remove any existing CORS headers that might have been set by a proxy
  res.removeHeader('Access-Control-Allow-Origin');
  res.removeHeader('Access-Control-Allow-Credentials');
  res.removeHeader('Access-Control-Allow-Methods');
  res.removeHeader('Access-Control-Allow-Headers');
  res.removeHeader('Cross-Origin-Opener-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  res.removeHeader('Cross-Origin-Resource-Policy');

  next();
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log(`[CORS] Allowing request with no origin`);
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS] Allowing origin: ${origin}`);
      callback(null, true);  // ✅ FIXED: return true instead of origin
    } else {
      console.log(`[CORS] Blocked origin: ${origin} (allowed: ${allowedOrigins.join(', ')})`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'Accept',
    'Accept-Language',
    'Content-Language'
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware - ONLY ONCE
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Headers for Google Sign-In compatibility
// This middleware runs AFTER CORS to clean up headers that block Google Sign-In
app.use((req, res, next) => {
  // Store original methods
  const originalSetHeader = res.setHeader.bind(res);
  const originalWriteHead = res.writeHead.bind(res);
  const originalEnd = res.end.bind(res);

  // Track if Access-Control-Allow-Origin has been set
  let corsOriginSet = false;
  let corsOriginValue = null;

  // Intercept setHeader to prevent problematic headers and duplicates
  res.setHeader = function (name, value) {
    const lowerName = name.toLowerCase();

    // Block headers that interfere with Google Sign-In
    if (lowerName === 'cross-origin-opener-policy' ||
      lowerName === 'cross-origin-embedder-policy' ||
      lowerName === 'cross-origin-resource-policy') {
      console.log(`[CORS] Blocked problematic header: ${name}`);
      return res; // Don't set these headers
    }

    // Set specific headers for Google OAuth compatibility
    if (req.path.includes('/auth/google') && lowerName === 'access-control-allow-origin') {
      // Ensure proper origin for Google auth
      if (allowedOrigins.includes(value)) {
        console.log(`[CORS] Allowing Google auth origin: ${value} for path: ${req.path}`);
      } else {
        console.log(`[CORS] Rejecting Google auth origin: ${value} for path: ${req.path}`);
      }
    }

    // Prevent duplicate Access-Control-Allow-Origin headers
    if (lowerName === 'access-control-allow-origin') {
      if (corsOriginSet) {
        // Header already set, don't duplicate - log for debugging
        if (corsOriginValue !== value) {
          console.warn(`[CORS] Duplicate Access-Control-Allow-Origin blocked. Existing: ${corsOriginValue}, Attempted: ${value}`);
        }
        return res; // Block the duplicate
      }
      corsOriginSet = true;
      corsOriginValue = value;
    }

    return originalSetHeader(name, value);
  };

  // Intercept writeHead to clean up headers before sending
  res.writeHead = function (statusCode, statusMessage, headers) {
    // Clean up problematic headers first
    try {
      res.removeHeader('Cross-Origin-Opener-Policy');
      res.removeHeader('Cross-Origin-Embedder-Policy');
      res.removeHeader('Cross-Origin-Resource-Policy');
    } catch (e) {
      // Ignore if header doesn't exist
    }

    // Handle headers parameter
    if (headers && typeof headers === 'object') {
      // Remove problematic headers from headers object
      delete headers['cross-origin-opener-policy'];
      delete headers['Cross-Origin-Opener-Policy'];
      delete headers['cross-origin-embedder-policy'];
      delete headers['Cross-Origin-Embedder-Policy'];
      delete headers['cross-origin-resource-policy'];
      delete headers['Cross-Origin-Resource-Policy'];

      // Handle duplicate Access-Control-Allow-Origin in headers object
      const originKey = headers['access-control-allow-origin'] ? 'access-control-allow-origin' :
        headers['Access-Control-Allow-Origin'] ? 'Access-Control-Allow-Origin' : null;

      if (originKey) {
        let originValue = headers[originKey];

        // Handle array case
        if (Array.isArray(originValue)) {
          originValue = originValue[0];
        }
        // Handle comma-separated string case
        else if (typeof originValue === 'string' && originValue.includes(',')) {
          originValue = originValue.split(',')[0].trim();
        }

        // Set clean value and remove duplicates
        headers['Access-Control-Allow-Origin'] = originValue;
        if (originKey !== 'Access-Control-Allow-Origin') {
          delete headers[originKey];
        }
      }
    }

    // Ensure single Access-Control-Allow-Origin from response headers
    try {
      const existingOrigin = res.getHeader('access-control-allow-origin');
      if (existingOrigin) {
        let cleanOrigin = existingOrigin;
        if (Array.isArray(existingOrigin)) {
          cleanOrigin = existingOrigin[0];
        } else if (typeof existingOrigin === 'string' && existingOrigin.includes(',')) {
          cleanOrigin = existingOrigin.split(',')[0].trim();
        }
        res.removeHeader('Access-Control-Allow-Origin');
        originalSetHeader('Access-Control-Allow-Origin', cleanOrigin);
      }
    } catch (e) {
      // Ignore errors
    }

    // Call original writeHead
    if (typeof statusCode === 'number' && typeof statusMessage === 'object' && !headers) {
      return originalWriteHead(statusCode, statusMessage);
    } else if (typeof statusCode === 'number' && typeof statusMessage === 'string') {
      return originalWriteHead(statusCode, statusMessage, headers);
    } else if (typeof statusCode === 'number' && typeof statusMessage === 'object') {
      return originalWriteHead(statusCode, statusMessage);
    } else {
      return originalWriteHead(statusCode);
    }
  };

  // Clean up headers right before response ends - FINAL SAFETY CHECK
  res.end = function (chunk, encoding) {
    // Final cleanup before sending - remove problematic headers
    try {
      // Remove problematic headers
      res.removeHeader('Cross-Origin-Opener-Policy');
      res.removeHeader('Cross-Origin-Embedder-Policy');

      // CRITICAL: Ensure single Access-Control-Allow-Origin (handle all cases)
      const existingOrigin = res.getHeader('access-control-allow-origin');
      if (existingOrigin) {
        let cleanOrigin = existingOrigin;

        // Handle array case
        if (Array.isArray(existingOrigin)) {
          cleanOrigin = existingOrigin[0];
        }
        // Handle comma-separated string case (this is the main issue)
        else if (typeof existingOrigin === 'string' && existingOrigin.includes(',')) {
          cleanOrigin = existingOrigin.split(',')[0].trim();
        }

        // Remove ALL instances and set clean single value
        res.removeHeader('Access-Control-Allow-Origin');
        originalSetHeader('Access-Control-Allow-Origin', cleanOrigin);
      }

      // Double-check: Get all headers and verify no duplicates
      const allHeaders = res.getHeaders();
      const originHeaders = Object.keys(allHeaders).filter(key =>
        key.toLowerCase() === 'access-control-allow-origin'
      );

      if (originHeaders.length > 1) {
        // Multiple origin headers found - keep only the first one
        const firstOrigin = allHeaders[originHeaders[0]];
        originHeaders.forEach((key, index) => {
          if (index > 0) {
            res.removeHeader(key);
          }
        });
        res.removeHeader('Access-Control-Allow-Origin');
        originalSetHeader('Access-Control-Allow-Origin', firstOrigin);
      }
    } catch (err) {
      // Ignore errors during cleanup
      console.error('[CORS Cleanup] Error:', err.message);
    }

    return originalEnd(chunk, encoding);
  };

  // Add necessary headers for OAuth compatibility
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');

  next();
});

// Input validation middleware for SQL injection prevention
const { validateInput, validateJobFilters } = require('./src/middlewares/inputValidation');

// Skip input validation for Google OAuth endpoint and static file routes
app.use((req, res, next) => {
  if (req.path === '/api/auth/google' || req.path.startsWith('/uploads/')) {
    return next();
  }
  validateInput(req, res, next);
});

// Serve static files from uploads directory (server root)
const uploadsPath = path.join(__dirname, 'uploads');

// Log uploads path for debugging
console.log('Static files serving from:', uploadsPath);

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

// Serve static files - this should be after other middleware but before API routes
app.use('/uploads', express.static(uploadsPath, {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['pdf'],
  index: false,
  maxAge: '1d',
  setHeaders: (res, path) => {
    // Ensure CORS headers are set for static files
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
  }
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import database pool for job meta tags
const pool = require('./src/api/config/db');

// Function to detect if request is from a crawler/bot
function isCrawler(userAgent) {
  if (!userAgent) return false;
  const crawlers = [
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
    'TelegramBot',
    'Slackbot',
    'SkypeUriPreview',
    'bingbot',
    'googlebot',
    'baiduspider',
    'yandex',
    'sogou',
    'exabot',
    'ia_archiver',
    'AhrefsBot',
    'SemrushBot',
    'MJ12bot',
    'DotBot',
    'Applebot',
    'Pingdom',
    'StatusCake'
  ];
  const ua = userAgent.toLowerCase();
  return crawlers.some(crawler => ua.includes(crawler.toLowerCase()));
}

// Middleware to handle job detail pages for crawlers (for social media sharing)
// This must be BEFORE API routes but AFTER static file serving
app.get('/jobs/:id', async (req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  
  // Only handle for crawlers - let regular users get the React app
  if (!isCrawler(userAgent)) {
    return next(); // Skip this middleware for regular browsers
  }

  try {
    const jobId = parseInt(req.params.id, 10);
    if (Number.isNaN(jobId)) {
      return next();
    }

    console.log(`[Crawler] Serving meta tags for job ${jobId} to ${userAgent}`);

    // Fetch job data from database
    const sql = `
      SELECT
        j.id,
        jr.name AS title,
        j.company,
        j.description,
        j.city,
        j.state,
        j.min_salary,
        j.max_salary,
        j.logo_path,
        j.job_type,
        j.work_mode,
        j.created_at,
        j.posted_at
      FROM jobs j
      LEFT JOIN job_roles jr ON j.role_id = jr.id
      WHERE j.id = ? AND j.status = 'approved'
      LIMIT 1
    `;
    
    const [rows] = await pool.query(sql, [jobId]);
    
    if (!rows || rows.length === 0) {
      console.log(`[Crawler] Job ${jobId} not found`);
      return next();
    }

    const job = rows[0];
    const baseUrl = process.env.BASE_URL || 'https://jobion.in';
    
    // Helper function to escape HTML
    const escapeHtml = (text) => {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    
    // Helper function to escape JSON
    const escapeJson = (text) => {
      if (!text) return '';
      return String(text)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
    };
    
    const rawDescription = job.description || `Apply for ${job.title || 'this position'} at ${job.company}`;
    const description = rawDescription.substring(0, 160);
    const descriptionHtml = escapeHtml(description);
    const descriptionJson = escapeJson(description);
    const titleText = job.title || 'Job Opening';
    const titleHtml = escapeHtml(`${titleText} - ${job.company} | Jobion`);
    const titleMeta = escapeHtml(`${titleText} - ${job.company}`);
    const companyHtml = escapeHtml(job.company);
    const companyJson = escapeJson(job.company);
    const titleJson = escapeJson(titleText);
    const jobUrl = `${baseUrl}/jobs/${jobId}`;
    
    // Construct image URL - use logo if available, otherwise fallback
    let imageUrl = `${baseUrl}/og-image.jpg`; // Default OG image
    if (job.logo_path) {
      // Check if logo_path is already a full URL
      if (job.logo_path.startsWith('http')) {
        imageUrl = job.logo_path;
      } else {
        // Construct full URL from logo_path
        const logoPath = job.logo_path.startsWith('/') ? job.logo_path : `/${job.logo_path}`;
        
        // Determine the correct base URL for the image
        // If logo is in /uploads, it might be served by Express or Nginx
        // Try to use API_URL if set, otherwise use BASE_URL (uploads should be accessible from main domain)
        if (logoPath.includes('/uploads/')) {
          // Check if API_URL is explicitly set
          const apiUrl = process.env.API_URL;
          if (apiUrl && apiUrl !== baseUrl) {
            // Use API URL if it's different from base URL (e.g., api.jobion.in)
            imageUrl = `${apiUrl}${logoPath}`;
          } else {
            // Same domain - uploads should be accessible from base URL if Nginx serves them
            // Or Express serves them and Nginx proxies /uploads to Express
            imageUrl = `${baseUrl}${logoPath}`;
          }
        } else {
          // Not an upload, use base URL
          imageUrl = `${baseUrl}${logoPath}`;
        }
      }
    }
    
    // Build location string
    const location = job.city ? (job.state ? `${job.city}, ${job.state}` : job.city) : 'Location not specified';
    const locationHtml = escapeHtml(location);
    
    // Build salary string
    let salaryText = '';
    if (job.min_salary && job.max_salary) {
      salaryText = `₹${job.min_salary.toLocaleString('en-IN')} - ₹${job.max_salary.toLocaleString('en-IN')}/month`;
    } else if (job.min_salary) {
      salaryText = `₹${job.min_salary.toLocaleString('en-IN')}+/month`;
    } else if (job.max_salary) {
      salaryText = `Up to ₹${job.max_salary.toLocaleString('en-IN')}/month`;
    }
    const salaryHtml = escapeHtml(salaryText);

    // Generate HTML with proper meta tags for social media crawlers
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>${titleHtml}</title>
    <meta name="title" content="${titleHtml}" />
    <meta name="description" content="${descriptionHtml}" />
    <meta name="robots" content="index, follow" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${jobUrl}" />
    <meta property="og:title" content="${titleMeta}" />
    <meta property="og:description" content="${descriptionHtml}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${companyHtml} - ${escapeHtml(titleText)}" />
    <meta property="og:site_name" content="Jobion" />
    <meta property="og:locale" content="en_IN" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${jobUrl}" />
    <meta name="twitter:title" content="${titleMeta}" />
    <meta name="twitter:description" content="${descriptionHtml}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${companyHtml} - ${escapeHtml(titleText)}" />
    
    <!-- Additional Meta Tags -->
    <meta name="author" content="Jobion" />
    <meta name="theme-color" content="#BB1919" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${jobUrl}" />
    
    <!-- JobPosting Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "${titleJson}",
      "description": "${descriptionJson}",
      "identifier": {
        "@type": "PropertyValue",
        "name": "Jobion",
        "value": "${jobId}"
      },
      "datePosted": "${(job.created_at || job.posted_at) ? new Date(job.created_at || job.posted_at).toISOString() : new Date().toISOString()}",
      "validThrough": "${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}",
      "employmentType": "${job.job_type || 'FULL_TIME'}",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "${companyJson}",
        "sameAs": "${baseUrl}"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "${escapeJson(job.city || 'Not specified')}",
          "addressRegion": "${escapeJson(job.state || '')}",
          "addressCountry": "IN"
        }
      }${salaryText ? `,
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": ${job.min_salary || job.max_salary || 0},
          "unitText": "MONTH"
        }
      }` : ''},
      "workHours": "${job.work_mode || 'FULL_TIME'}",
      "url": "${jobUrl}"
    }
    </script>
    
    <!-- Redirect for non-crawlers (fallback) -->
    <script>
      if (typeof window !== 'undefined' && !/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
        window.location.href = '${jobUrl}';
      }
    </script>
  </head>
  <body>
    <noscript>
      <meta http-equiv="refresh" content="0; url=${jobUrl}" />
    </noscript>
    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
      <h1>${escapeHtml(titleText)}</h1>
      <h2>${companyHtml}</h2>
      <p>${descriptionHtml}</p>
      <p><strong>Location:</strong> ${locationHtml}</p>
      ${salaryText ? `<p><strong>Salary:</strong> ${salaryHtml}</p>` : ''}
      <p><a href="${jobUrl}">View Full Job Details</a></p>
    </div>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(html);
  } catch (err) {
    console.error('[Crawler] Error generating job meta HTML:', err);
    return next(); // Fall through to regular handling on error
  }
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

// Test database connection on server start
const { testConnection } = require('./src/api/config/db');

(async () => {
  // Test database connection
  await testConnection();

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

module.exports = app;