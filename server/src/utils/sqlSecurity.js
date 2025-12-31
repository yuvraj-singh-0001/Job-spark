/**
 * SQL Security utilities to prevent injection attacks
 */

/**
 * Allowed SQL operators for dynamic queries
 */
const ALLOWED_OPERATORS = ['=', '!=', '<>', '<', '<=', '>', '>=', 'LIKE', 'IN', 'IS NULL', 'IS NOT NULL'];

/**
 * Allowed SQL logical operators
 */
const ALLOWED_LOGICAL_OPERATORS = ['AND', 'OR'];

/**
 * Allowed sort directions
 */
const ALLOWED_SORT_DIRECTIONS = ['ASC', 'DESC'];

/**
 * Validate if a column name is safe (only alphanumeric, underscore, dot allowed)
 * @param {string} column - Column name to validate
 * @returns {boolean} - True if safe
 */
function isValidColumnName(column) {
  // Allow alphanumeric, underscore, dot (for table.column)
  const columnRegex = /^[a-zA-Z0-9_.]+$/;
  return columnRegex.test(column) && !column.includes(' ') && column.length <= 100;
}

/**
 * Validate if an operator is allowed
 * @param {string} operator - SQL operator to validate
 * @returns {boolean} - True if allowed
 */
function isValidOperator(operator) {
  return ALLOWED_OPERATORS.includes(operator.toUpperCase());
}

/**
 * Validate if a sort direction is allowed
 * @param {string} direction - Sort direction to validate
 * @returns {boolean} - True if allowed
 */
function isValidSortDirection(direction) {
  return ALLOWED_SORT_DIRECTIONS.includes(direction.toUpperCase());
}

/**
 * Sanitize and validate ORDER BY clause
 * @param {string} orderBy - ORDER BY clause to validate
 * @returns {string|null} - Sanitized clause or null if invalid
 */
function sanitizeOrderBy(orderBy) {
  if (!orderBy || typeof orderBy !== 'string') return null;

  // Basic validation - should contain only column names and ASC/DESC
  const orderByRegex = /^[a-zA-Z0-9_.]+(\s+(ASC|DESC))?$/i;
  if (!orderByRegex.test(orderBy.trim())) return null;

  const parts = orderBy.trim().split(/\s+/);
  const column = parts[0];
  const direction = parts[1];

  if (!isValidColumnName(column)) return null;
  if (direction && !isValidSortDirection(direction)) return null;

  return orderBy.trim();
}

/**
 * Validate table name against whitelist
 * @param {string} tableName - Table name to validate
 * @returns {boolean} - True if allowed
 */
const ALLOWED_TABLES = [
  'users', 'candidate_profiles', 'recruiter_profiles', 'admins',
  'jobs', 'job_roles', 'job_tags', 'job_tag_map', 'applications'
];

function isValidTableName(tableName) {
  return ALLOWED_TABLES.includes(tableName.toLowerCase());
}

module.exports = {
  isValidColumnName,
  isValidOperator,
  isValidSortDirection,
  isValidTableName,
  sanitizeOrderBy,
  ALLOWED_OPERATORS,
  ALLOWED_LOGICAL_OPERATORS,
  ALLOWED_SORT_DIRECTIONS,
  ALLOWED_TABLES
};
