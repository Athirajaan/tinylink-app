// src/models/Link.js
const { pool } = require('../config/db');

class Link {
  /**
   * Create a new link
   */
  static async create({ code, targetUrl }) {
    const query = `
      INSERT INTO links (code, target_url)
      VALUES ($1, $2)
      RETURNING id, code, target_url, total_clicks, created_at, updated_at
    `;
    const values = [code, targetUrl];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * generate a new code
   */
  static async generateUniqueCode() {
  const regex = /^[A-Za-z0-9]{6,8}$/;

  function randomCode() {
    const length = Math.floor(Math.random() * 3) + 6; // 6, 7, or 8
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  let code;
  let exists = true;

  while (exists) {
    code = randomCode();

    // Must match regex
    if (!regex.test(code)) continue;

    // Check uniqueness
    exists = await this.codeExists(code);
  }

  return code;
}

  /**
   * Find link by code
   */
  static async findByCode(code) {
    const query = `
      SELECT id, code, target_url, total_clicks, last_clicked_at, created_at, updated_at
      FROM links
      WHERE code = $1
    `;
    const result = await pool.query(query, [code]);
    return result.rows[0] || null;
  }

  /**
   * Get all links (ordered by creation date)
   */
  static async getAll() {
    const query = `
      SELECT id, code, target_url, total_clicks, last_clicked_at, created_at, updated_at
      FROM links
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Check if code exists
   */
  static async codeExists(code) {
    const query = 'SELECT 1 FROM links WHERE code = $1';
    const result = await pool.query(query, [code]);
    return result.rows.length > 0;
  }

  /**
   * Delete link by code
   */
  static async deleteByCode(code) {
    const query = `
      DELETE FROM links
      WHERE code = $1
      RETURNING id, code
    `;
    const result = await pool.query(query, [code]);
    return result.rows[0] || null;
  }

  /**
   * Increment click count and update last clicked timestamp
   */
  static async incrementClicks(code) {
    const query = `
      UPDATE links
      SET total_clicks = total_clicks + 1,
          last_clicked_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE code = $1
      RETURNING id, code, target_url, total_clicks, last_clicked_at
    `;
    const result = await pool.query(query, [code]);
    return result.rows[0] || null;
  }

  /**
   * Get link statistics
   */
  static async getStats(code) {
    const query = `
      SELECT 
        id, 
        code, 
        target_url, 
        total_clicks, 
        last_clicked_at, 
        created_at,
        updated_at
      FROM links
      WHERE code = $1
    `;
    const result = await pool.query(query, [code]);
    return result.rows[0] || null;
  }

  /**
   * Get total links count
   */
  static async getCount() {
    const query = 'SELECT COUNT(*) as count FROM links';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }

  /**
   * Get total clicks across all links
   */
  static async getTotalClicks() {
    const query = 'SELECT SUM(total_clicks) as total FROM links';
    const result = await pool.query(query);
    return parseInt(result.rows[0].total || 0);
  }
}

module.exports = Link;