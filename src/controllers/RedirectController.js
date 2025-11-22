// src/controllers/RedirectController.js
const Link = require('../models/link');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');
const { asyncHandler } = require('../middleware/errorHandler');

class RedirectController {
 
 //Redirect to target URL  
  static redirect = asyncHandler(async (req, res) => {
    const { code } = req.params;

    // Find and increment clicks atomically
    const link = await Link.incrementClicks(code);

    if (!link) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: ERROR_MESSAGES.LINK_NOT_FOUND
      });
    }

    // Perform redirect with 302 status
    res.redirect(HTTP_STATUS.FOUND, link.target_url);
  });
}

module.exports = RedirectController;