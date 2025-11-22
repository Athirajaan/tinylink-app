// src/config/constants.js

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  FOUND: 302,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_CODE: 'Code must be 6-8 alphanumeric characters',
  INVALID_URL: 'Target URL is required and must be valid',
  CODE_EXISTS: 'Code already exists',
  LINK_NOT_FOUND: 'Link not found',
  DATABASE_ERROR: 'Database operation failed',
  VALIDATION_ERROR: 'Validation error'
};

// Success Messages
const SUCCESS_MESSAGES = {
  LINK_CREATED: 'Link created successfully',
  LINK_DELETED: 'Link deleted successfully',
  LINK_FETCHED: 'Link retrieved successfully'
};

// Validation Patterns
const VALIDATION = {
  CODE_PATTERN: /^[A-Za-z0-9]{6,8}$/,
  CODE_MIN_LENGTH: 6,
  CODE_MAX_LENGTH: 8,
  URL_MAX_LENGTH: 2048
};

// Application Constants
const APP_CONFIG = {
  VERSION: '1.0',
  DEFAULT_CODE_LENGTH: 6
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  APP_CONFIG
};