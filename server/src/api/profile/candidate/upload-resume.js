const path = require("path");
const fs = require("fs");
const multer = require("multer");
const pool = require("../../config/db");
const { requireAuth } = require("../../../middlewares/auth");

// Ensure upload directory exists
// Path: server/uploads/resumes (server root directory)
// File location: server/src/api/profile/candidate/upload-resume.js
// __dirname = server/src/api/profile/candidate
// .. = server/src/api/profile
// .. = server/src/api
// .. = server/src
// .. = server
// uploads = server/uploads
// resumes = server/uploads/resumes
const UPLOAD_DIR = path.join(__dirname, "..", "..", "..", "..", "uploads", "resumes");

// Create directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`Created upload directory: ${UPLOAD_DIR}`);
} else {
  console.log(`Upload directory exists: ${UPLOAD_DIR}`);
}

// Multer storage config - similar to job applications
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure directory exists before saving
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const userId = req.body.user_id || req.user?.id || 'unknown';
    // Use user_id + timestamp for unique filename
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}.pdf`;
    console.log(`Multer saving file: ${filename} to ${UPLOAD_DIR}`);
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

    // Verify file was actually saved - use file.path if available, otherwise construct it
    const filePath = file.path || path.join(UPLOAD_DIR, file.filename);

    // Wait a moment for file system to sync (Windows sometimes needs this)
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!fs.existsSync(filePath)) {
      console.error(`File not found after upload:`);
      console.error(`  Expected path: ${filePath}`);
      console.error(`  Upload directory: ${UPLOAD_DIR}`);
      console.error(`  File object:`, {
        filename: file.filename,
        path: file.path,
        destination: file.destination,
        size: file.size,
        mimetype: file.mimetype
      });

      // Check if directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        console.error(`  ERROR: Upload directory does not exist!`);
      } else {
        console.error(`  Directory exists, listing files:`);
        try {
          const files = fs.readdirSync(UPLOAD_DIR);
          console.error(`  Files in directory:`, files);
        } catch (err) {
          console.error(`  Cannot read directory:`, err.message);
        }
      }

      return res.status(500).json({
        success: false,
        error: "File upload failed - file not saved to disk"
      });
    }

    console.log(`Resume uploaded successfully: ${filePath} (${file.size} bytes)`);

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

    // Store only the path, not the full URL (e.g., /uploads/resumes/filename.pdf)
    const resumePath = `/uploads/resumes/${file.filename}`;

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
        // Extract filename from the old resume path/URL (handle both formats)
        // Old format might be: http://localhost:5000/uploads/resumes/filename.pdf
        // New format: /uploads/resumes/filename.pdf
        let oldFilename = oldResumePath.split('/').pop();
        // Remove query parameters if any
        if (oldFilename && oldFilename.includes('?')) {
          oldFilename = oldFilename.split('?')[0];
        }
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
    console.error('Error stack:', error.stack);

    // Clean up uploaded file if database update failed
    if (req.file) {
      try {
        // Try both file.path and UPLOAD_DIR + filename
        const filePath = req.file.path || path.join(UPLOAD_DIR, req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up uploaded file: ${filePath}`);
        }
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