/**
 * Input validation middleware for SQL injection prevention
 */

// List of allowed characters for different input types
const ALLOWED_PATTERNS = {
  // Alphanumeric with spaces, hyphens, and underscores
  general: /^[a-zA-Z0-9\s\-_]+$/,
  // Email validation
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Phone number (Indian format)
  phone: /^[6-9]\d{9}$/,
  // Names (letters, spaces, hyphens, apostrophes)
  name: /^[a-zA-Z\s\-']+$/,
  // Alphanumeric only
  alphanumeric: /^[a-zA-Z0-9]+$/,
  // Numbers only
  numeric: /^\d+$/,
  // File extensions
  fileExtension: /^[a-zA-Z0-9]+$/,
  // Trade streams (allow forward slashes like "Computer / IT")
  trade_stream: /^[a-zA-Z0-9\s\-_\/]+$/,
  // Salary ranges (allow rupee symbols, commas, en-dashes like "â‚¹8,000â€“12,000")
  salary: /^[a-zA-Z0-9\s\-_,â‚¹â€“+]+$/,
  // File paths (allow forward slashes, dots for file extensions like "/uploads/resumes/file.pdf")
  file_path: /^[a-zA-Z0-9\s\-_\/\.]+$/,
};

/**
 * Sanitize string input - remove potentially dangerous characters
 * @param {string} input - Input string to sanitize
 * @param {string} type - Type of input validation to apply
 * @returns {string} - Sanitized string
 */
function sanitizeString(input, type = 'general') {
  if (typeof input !== 'string') return '';

  // Trim whitespace
  let sanitized = input.trim();

  // Apply type-specific validation
  if (ALLOWED_PATTERNS[type]) {
    if (!ALLOWED_PATTERNS[type].test(sanitized)) {
      throw new Error(`Invalid input format for type: ${type}`);
    }
  }

  // Additional sanitization - escape quotes and remove semicolons
  sanitized = sanitized.replace(/['";\\]/g, '');

  return sanitized;
}

/**
 * Validate and sanitize array inputs
 * @param {Array} input - Array to validate
 * @param {string} itemType - Type validation for each array item
 * @param {number} maxLength - Maximum array length
 * @returns {Array} - Sanitized array
 */
function sanitizeArray(input, itemType = 'general', maxLength = 50) {
  if (!Array.isArray(input)) return [];

  if (input.length > maxLength) {
    throw new Error(`Array exceeds maximum length of ${maxLength}`);
  }

  return input
    .filter(item => typeof item === 'string' && item.trim().length > 0)
    .map(item => sanitizeString(item, itemType));
}

/**
 * Validate numeric inputs
 * @param {any} input - Input to validate as number
 * @param {Object} options - Validation options
 * @returns {number} - Validated number
 */
function sanitizeNumber(input, options = {}) {
  const { min, max, integer = false } = options;

  const num = Number(input);
  if (isNaN(num)) {
    throw new Error('Invalid number format');
  }

  if (integer && !Number.isInteger(num)) {
    throw new Error('Must be an integer');
  }

  if (min !== undefined && num < min) {
    throw new Error(`Must be at least ${min}`);
  }

  if (max !== undefined && num > max) {
    throw new Error(`Must be at most ${max}`);
  }

  return num;
}

/**
 * Middleware to validate and sanitize request body/query/params
 */
function validateInput(req, res, next) {
  try {
    // Sanitize query parameters
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          req.query[key] = sanitizeString(value);
        } else if (Array.isArray(value)) {
          req.query[key] = sanitizeArray(value);
        }
      }
    }

    // Sanitize route parameters
    if (req.params) {
      for (const [key, value] of Object.entries(req.params)) {
        if (typeof value === 'string') {
          req.params[key] = sanitizeString(value);
        }
      }
    }

    // Sanitize body for common fields (don't sanitize file uploads)
    if (req.body && !req.file && !req.files) {
      for (const [key, value] of Object.entries(req.body)) {
        if (typeof value === 'string') {
          // Apply specific validation based on field name
          try {
            switch (key.toLowerCase()) {
              case 'email':
                req.body[key] = sanitizeString(value, 'email');
                break;
              case 'phone':
              case 'mobile':
              case 'contact_phone':
                req.body[key] = sanitizeString(value, 'phone');
                break;
              case 'name':
              case 'full_name':
              case 'company':
                req.body[key] = sanitizeString(value, 'name');
                break;
              case 'id':
              case 'userid':
              case 'user_id':
                req.body[key] = sanitizeNumber(value, { integer: true, min: 1 });
                break;
              case 'trade_stream':
                // Allow forward slashes for trade streams like "Computer / IT"
                req.body[key] = sanitizeString(value, 'trade_stream');
                break;
              case 'expected_salary':
                // Allow rupee symbols and en-dashes for salary ranges like "â‚¹8,000â€“12,000"
                req.body[key] = sanitizeString(value, 'salary');
                break;
              case 'resume_path':
                // Allow file paths with forward slashes like "/uploads/resumes/filename.pdf"
                req.body[key] = sanitizeString(value, 'file_path');
                break;
              default:
                req.body[key] = sanitizeString(value);
            }
          } catch (error) {
            return res.status(400).json({
              success: false,
              error: `Invalid ${key}: ${error.message}`
            });
          }
        } else if (Array.isArray(value)) {
          try {
            req.body[key] = sanitizeArray(value);
          } catch (error) {
            return res.status(400).json({
              success: false,
              error: `Invalid ${key}: ${error.message}`
            });
          }
        }
      }
    }

    next();
  } catch (error) {
    console.error('Input validation error:', error);
    return res.status(400).json({
      success: false,
      error: 'Invalid input data'
    });
  }
}

/**
 * Specific validation for job-related APIs
 */
function validateJobFilters(req, res, next) {
  try {
    const { jobTypes, workModes, cities, roles, tags, experience, salaryFilter } = req.query;

    // Validate arrays
    if (jobTypes) req.query.jobTypes = sanitizeArray(jobTypes, 'general', 10);
    if (workModes) req.query.workModes = sanitizeArray(workModes, 'general', 10);
    if (cities) req.query.cities = sanitizeArray(cities, 'general', 20);
    if (roles) req.query.roles = sanitizeArray(roles, 'general', 20);
    if (tags) req.query.tags = sanitizeArray(tags, 'general', 20);

    // Validate experience (should be "0" for fresher or empty)
    if (experience && experience !== '0') {
      throw new Error('Invalid experience value');
    }

    // Validate salary filter (should be a number or empty)
    if (salaryFilter) {
      req.query.salaryFilter = sanitizeNumber(salaryFilter, { integer: true, min: 0, max: 10000000 });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: `Invalid job filter: ${error.message}`
    });
  }
}

module.exports = {
  validateInput,
  validateJobFilters,
  sanitizeString,
  sanitizeArray,
  sanitizeNumber
};
