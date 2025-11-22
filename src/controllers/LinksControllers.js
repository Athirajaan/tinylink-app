// src/controllers/LinksController.js
const Link = require('../models/link');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

class LinksController {

    //create a new link
static createLink = asyncHandler(async (req, res) => {
  let { code, targetUrl } = req.body;

  // CASE 1: auto-generate if no code
  if (!code) {
    code = await Link.generateUniqueCode();
  } else {
    // Validate user-provided code
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return res.status(400).json({
        error: "Code must be 6–8 characters (A–Z, a–z, 0–9)"
      });
    }

    // Check uniqueness
    const exists = await Link.codeExists(code);
    if (exists) {
      return res.status(409).json({ error: "Code already exists" });
    }
  }

  // Create link
  const link = await Link.create({ code, targetUrl });

  res.status(201).json({
    id: link.id,
    code: link.code,
    targetUrl: link.target_url,
    totalClicks: link.total_clicks,
    createdAt: link.created_at
  });
});



 //get all links
  static getAllLinks = asyncHandler(async (req, res) => {
    const links = await Link.getAll();

    const formattedLinks = links.map(link => ({
      id: link.id,
      code: link.code,
      targetUrl: link.target_url,
      totalClicks: link.total_clicks,
      lastClickedAt: link.last_clicked_at,
      createdAt: link.created_at
    }));

    res.status(HTTP_STATUS.OK).json(formattedLinks);
  });


  //get link by code
  static getLinkByCode = asyncHandler(async (req, res) => {
    const { code } = req.params;

    const link = await Link.findByCode(code);
    
    if (!link) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: ERROR_MESSAGES.LINK_NOT_FOUND
      });
    }

    res.status(HTTP_STATUS.OK).json({
      id: link.id,
      code: link.code,
      targetUrl: link.target_url,
      totalClicks: link.total_clicks,
      lastClickedAt: link.last_clicked_at,
      createdAt: link.created_at
    });
  });


  //delete link
  static deleteLink = asyncHandler(async (req, res) => {
    const { code } = req.params;

    const deleted = await Link.deleteByCode(code);

    if (!deleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: ERROR_MESSAGES.LINK_NOT_FOUND
      });
    }

    res.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.LINK_DELETED,
      code: deleted.code
    });
  });
}

module.exports = LinksController;