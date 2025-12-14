const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const { requireAuth } = require('../../../middlewares/auth');

const getCandidateProfile = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const [rows] = await connection.execute('SELECT * FROM candidate_profiles WHERE user_id = ?', [userId]);
    if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: 'Profile not found' });

    // Parse key_skills JSON field if it exists
    const profile = rows[0];
    if (profile.key_skills) {
      try {
        profile.key_skills = JSON.parse(profile.key_skills);
      } catch (e) {
        // If parsing fails, try to handle as comma-separated string
        if (typeof profile.key_skills === 'string' && profile.key_skills.includes(',')) {
          profile.key_skills = profile.key_skills.split(',').map(s => s.trim()).filter(s => s);
        }
      }
    }

    res.json({ success: true, user: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
};

module.exports = getCandidateProfile;