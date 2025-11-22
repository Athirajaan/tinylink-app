// src/controllers/PagesController.js
const Link = require('../models/link');
const { HTTP_STATUS, APP_CONFIG } = require('../config/constants');
const { asyncHandler } = require('../middleware/errorHandler');

class PagesController {

  //dashborad
  static dashboard = asyncHandler(async (req, res) => {
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    
    res.render('dashboard', {
      title: 'TinyLink - Dashboard',
      baseUrl
    });
  });

 
  //stats page
  static stats = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

    const link = await Link.getStats(code);

    if (!link) {
      return res.status(HTTP_STATUS.NOT_FOUND).render('stats', {
        title: 'Link Not Found',
        error: 'Link not found',
        link: null,
        baseUrl
      });
    }

    res.render('stats', {
      title: `Stats - ${code}`,
      link: {
        code: link.code,
        targetUrl: link.target_url,
        totalClicks: link.total_clicks,
        lastClickedAt: link.last_clicked_at,
        createdAt: link.created_at
      },
      baseUrl,
      error: null
    });
  });

 
  // health check end point 
  static health = (req, res) => {
    res.status(HTTP_STATUS.OK).json({
      ok: true,
      version: APP_CONFIG.VERSION
    });
  };
}

module.exports = PagesController;