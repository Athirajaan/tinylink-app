// src/middleware/validators.js
const { HTTP_STATUS, ERROR_MESSAGES, VALIDATION } = require('../config/constants');
const Link = require('../models/link');

/**
 * Validate link code format
 */
function validateCode(code) {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: ERROR_MESSAGES.INVALID_CODE };
  }

  if (!VALIDATION.CODE_PATTERN.test(code)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_CODE };
  }

  return { valid: true };
}

/**
 * Validate target URL
 */
function validateTargetUrl(url) {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_URL };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: ERROR_MESSAGES.INVALID_URL };
  }
}

/**
 * Middleware to validate link creation
 * - If user provides code → validate it
 * - If user doesn't → skip code validation (auto-generate later)
 */
async function validateCreateLink(req, res, next) {
  const { code, targetUrl } = req.body;

  // Step 1: Validate target URL format
  const urlValidation = validateTargetUrl(targetUrl);
  if (!urlValidation.valid) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: urlValidation.error });
  }

  // Step 2: Check if target URL already exists
  try {
    const existing = await Link.getAll(); // get all links
    const duplicate = existing.find(link => link.target_url === targetUrl);
    if (duplicate) {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: "URL already exists" });
    }
  } catch (err) {
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Database error" });
  }

  // Step 3: Validate custom code if provided
  if (code && code.trim() !== "") {
    const codeValidation = validateCode(code);
    if (!codeValidation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: codeValidation.error });
    }

    // Also check uniqueness of code
    const codeExists = await Link.codeExists(code);
    if (codeExists) {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: "Code already exists" });
    }
  }

  // Step 4: Everything is valid → continue
  next();
}

/**
 * Middleware to validate code parameter (:code)
 */
function validateCodeParam(req, res, next) {
  const { code } = req.params;

  const validation = validateCode(code);
  if (!validation.valid) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: validation.error
    });
  }

  next();
}

module.exports = {
  validateCode,
  validateTargetUrl,
  validateCreateLink,
  validateCodeParam
};
