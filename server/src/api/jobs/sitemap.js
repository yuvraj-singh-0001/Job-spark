const express = require('express');
const pool = require('../config/db');
const router = express.Router();

async function generateSitemap(req, res) {
  try {
    // Get all approved jobs (exclude expired, rejected, closed)
    const sql = `
      SELECT id, posted_at, updated_at
      FROM jobs
      WHERE status = 'approved'
      ORDER BY posted_at DESC
    `;

    const [rows] = await pool.query(sql);

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/jobs</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/companies</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/career-guide</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;

    // Add job URLs
    rows.forEach(job => {
      const lastMod = new Date(job.updated_at || job.posted_at).toISOString();
      sitemap += `  <url>
    <loc>${baseUrl}/jobs/${job.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
}

module.exports = generateSitemap;
