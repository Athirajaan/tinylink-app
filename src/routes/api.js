
// src/routes/api.js
const express = require('express');
const router = express.Router();
const LinksController = require('../controllers/LinksControllers');
const { validateCreateLink, validateCodeParam } = require('../middleware/validators');

// POST /api/links - Create new link
router.post('/links', validateCreateLink, LinksController.createLink);

// GET /api/links - Get all links
router.get('/links', LinksController.getAllLinks);

// GET /api/links/:code - Get specific link
router.get('/links/:code', validateCodeParam, LinksController.getLinkByCode);

// DELETE /api/links/:code - Delete link
router.delete('/links/:code', validateCodeParam, LinksController.deleteLink);

module.exports = router;