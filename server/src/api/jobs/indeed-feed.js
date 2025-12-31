const express = require('express');
const pool = require('../config/db');
const router = express.Router();

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&#39;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function formatRFC822Date(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const d = new Date(date);
  const day = days[d.getUTCDay()];
  const dayNum = String(d.getUTCDate()).padStart(2, '0');
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');

  return `${day}, ${dayNum} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
}

async function generateIndeedFeed(req, res) {
  try {
    // Get approved jobs only (exclude expired, rejected, closed)
    const sql = `
      SELECT
        j.id,
        jr.name AS title,
        j.company,
        j.city,
        j.state,
        j.description,
        j.posted_at
      FROM jobs j
      LEFT JOIN job_roles jr ON j.role_id = jr.id
      WHERE j.status = 'approved'
        AND jr.name IS NOT NULL
        AND jr.name != ''
        AND j.description IS NOT NULL
        AND j.description != ''
        AND j.posted_at IS NOT NULL
        AND (j.work_mode = 'Remote' OR (j.city IS NOT NULL AND j.state IS NOT NULL))
      ORDER BY j.posted_at DESC
    `;

    const [rows] = await pool.query(sql);

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    // Generate Indeed XML feed
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>Jobion</publisher>
  <publisherurl>${baseUrl}</publisherurl>
`;

    rows.forEach(job => {
      // Skip invalid jobs
      if (!job.title || !job.description || !job.posted_at) return;

      const city = job.city || '';
      const state = job.state || '';
      const date = formatRFC822Date(job.posted_at);
      const jobUrl = `${baseUrl}/jobs/${job.id}`;

      xml += `  <job>
    <title><![CDATA[${escapeXml(job.title)}]]></title>
    <company><![CDATA[${escapeXml(job.company)}]]></company>
    <city><![CDATA[${escapeXml(city)}]]></city>
    <state><![CDATA[${escapeXml(state)}]]></state>
    <country>IN</country>
    <date>${date}</date>
    <referencenumber>${job.id}</referencenumber>
    <url><![CDATA[${jobUrl}]]></url>
    <description><![CDATA[${job.description}]]></description>
  </job>
`;
    });

    xml += '</source>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Indeed feed generation error:', err);
    res.status(500).send('Error generating Indeed feed');
  }
}

module.exports = generateIndeedFeed;
