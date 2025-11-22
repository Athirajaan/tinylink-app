// src/routes/web.js
const express = require('express');
const router = express.Router();
const PagesController = require('../controllers/pagesController');
const RedirectController = require('../controllers/RedirectController');
const { validateCodeParam } = require('../middleware/validators');

// ⚠️ CRITICAL: Route order matters to prevent conflicts

// 1. Dashboard page
router.get('/', PagesController.dashboard);

// 2. Stats page (must come before /:code)
router.get('/code/:code', validateCodeParam, PagesController.stats);

// 3. Health check (JSON only - no EJS)
router.get('/healthz', PagesController.health);

// 4. Redirect (MUST BE LAST - catches all other /:code)
router.get('/:code', validateCodeParam, RedirectController.redirect);

module.exports = router;