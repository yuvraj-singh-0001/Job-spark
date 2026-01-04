const path = require("path");
const fs = require("fs");
const multer = require("multer");
const pool = require("../../config/db");
const { requireAuth } = require("../../../middlewares/auth");

// Ensure upload directory exists
const UPLOAD_DIR = path.join(__dirname, "..", "..", "..", "uploads", "resumes");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer storage config - similar to job applications
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const userId = req.body.user_id || req.user?.id || 'unknown';
    // Use user_id + timestamp for unique filename
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}.pdf`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit (same as profile page)
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Upload resume handler
const uploadResume = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - user not authenticated"
      });
    }

    const { user_id } = req.body;
    const file = req.file;

    // Validate that file was uploaded
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    // Verify the user_id matches the authenticated user
    if (user_id && parseInt(user_id) !== userId) {
      return res.status(403).json({
        success: false,
        error: "User ID mismatch"
      });
    }

    // Get current resume path for cleanup
    const [currentProfile] = await conn.query(
      'SELECT resume_path FROM candidate_profiles WHERE user_id = ? LIMIT 1',
      [userId]
    );

    const oldResumePath = currentProfile.length > 0 ? currentProfile[0].resume_path : null;

    // Construct the full resume URL
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const resumePath = `${baseUrl}/uploads/resumes/${file.filename}`;

    // Update the user's profile with the resume path
    const updateSql = `
      UPDATE candidate_profiles
      SET resume_path = ?, updated_at = NOW()
      WHERE user_id = ?
    `;

    const [result] = await conn.query(updateSql, [resumePath, userId]);

    if (result.affectedRows === 0) {
      // Profile doesn't exist, fetch user name and create it with resume
      const [userRows] = await conn.query(
        'SELECT name FROM users WHERE id = ? LIMIT 1',
        [userId]
      );

      if (userRows.length === 0) {
        throw new Error('User not found');
      }

      const userName = userRows[0].name || 'Unknown';

      const insertSql = `
        INSERT INTO candidate_profiles
          (user_id, full_name, resume_path, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          resume_path = VALUES(resume_path),
          updated_at = NOW()
      `;

      await conn.query(insertSql, [userId, userName, resumePath]);
    }

    // Clean up old resume file if it exists
    if (oldResumePath && oldResumePath !== resumePath) {
      try {
        // Extract filename from the old resume URL
        const oldFilename = oldResumePath.split('/').pop();
        if (oldFilename) {
          const oldFilePath = path.join(UPLOAD_DIR, oldFilename);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log(`Cleaned up old resume file: ${oldFilePath}`);
          }
        }
      } catch (cleanupError) {
        console.error('Failed to cleanup old resume file:', cleanupError);
        // Don't fail the upload if cleanup fails
      }
    }

    res.json({
      success: true,
      resume_path: resumePath,
      message: "Resume uploaded successfully"
    });

  } catch (error) {
    console.error('Resume upload error:', error);

    // Clean up uploaded file if database update failed
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded file:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      error: error.message || "Failed to upload resume"
    });

  } finally {
    conn.release();
  }
};

module.exports = [upload.single('resume'), uploadResume];