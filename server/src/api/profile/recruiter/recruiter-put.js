const pool = require('../../config/db');
const { sendEmail } = require('../../../services/emailService');
const ALLOWED_COMPANY_TYPES = ['company', 'consultancy', 'startup'];
const ALLOWED_STATUSES = ['pending', 'approved', 'rejected'];

const recruiterProfile = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const authUserId = req.user?.id;
    const {
      user_id,
      company_name,
      company_website,
      company_type,
      hr_name,
      hr_mobile,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pincode,
      verified,  // Keep verified for frontend (0 or 1)
      verification_notes
    } = req.body;

    const finalUserId = authUserId || user_id;
    if (!finalUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: missing authenticated user.'
      });
    }

    if (!company_name) {
      return res.status(400).json({
        success: false,
        message: 'company_name is required.'
      });
    }

    if (company_type && !ALLOWED_COMPANY_TYPES.includes(company_type)) {
      return res.status(400).json({
        success: false,
        message: `company_type must be one of: ${ALLOWED_COMPANY_TYPES.join(', ')}.`
      });
    }

    // Convert verified (0/1) to status
    let statusValue = null;
    if (typeof verified !== 'undefined' && verified !== null) {
      // Convert verified number to status string
      if (verified === 1 || verified === '1' || verified === true) {
        statusValue = 'approved';
      } else if (verified === 0 || verified === '0' || verified === false) {
        statusValue = 'pending';
      }
    }

    await connection.beginTransaction();

    const [existing] = await connection.execute(
      'SELECT user_id FROM recruiter_profiles WHERE user_id = ?',
      [finalUserId]
    );

    const now = new Date();

    if (existing.length > 0) {
      // Update existing profile
      await connection.execute(
        `UPDATE recruiter_profiles
         SET company_name = ?, company_website = ?, company_type = ?,
             hr_name = ?, hr_mobile = ?,
             address_line1 = ?, address_line2 = ?, city = ?, state = ?, country = ?, pincode = ?,
             status = COALESCE(?, status), verification_notes = ?, updated_at = ?
         WHERE user_id = ?`,
        [
          company_name,
          company_website || null,
          company_type || null,
          hr_name || null,
          hr_mobile || null,
          address_line1 || null,
          address_line2 || null,
          city || null,
          state || null,
          country || null,
          pincode || null,
          statusValue || null,
          verification_notes || null,
          now,
          finalUserId
        ]
      );

      await connection.commit();

      const [updatedRows] = await connection.execute(
        'SELECT * FROM recruiter_profiles WHERE user_id = ?',
        [finalUserId]
      );

      // Add verified field for frontend compatibility
      const recruiterData = updatedRows[0];
      if (recruiterData) {
        recruiterData.verified = recruiterData.status === 'approved' ? 1 : 0;
      }

      return res.json({
        success: true,
        message: 'Recruiter profile updated successfully',
        recruiter: recruiterData
      });
    } else {
      // Fetch user email and name for welcome email (only if creating new profile)
      let userEmail = null;
      let userName = null;
      try {
        const [userRows] = await connection.execute(
          'SELECT email, name FROM users WHERE id = ?',
          [finalUserId]
        );
        if (userRows.length > 0) {
          userEmail = userRows[0].email;
          userName = userRows[0].name || hr_name || 'Recruiter';
        }
      } catch (err) {
        // Log error but don't fail profile creation
        console.error('Error fetching user data for email:', err);
      }

      // Create new recruiter profile
      const defaultStatus = statusValue || 'pending';
      
      await connection.execute(
        `INSERT INTO recruiter_profiles
         (user_id, company_name, company_website, company_type,
          hr_name, hr_mobile,
          address_line1, address_line2, city, state, country, pincode,
          status, verification_notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalUserId,
          company_name,
          company_website || null,
          company_type || null,
          hr_name || null,
          hr_mobile || null,
          address_line1 || null,
          address_line2 || null,
          city || null,
          state || null,
          country || null,
          pincode || null,
          defaultStatus,
          verification_notes || null,
          now,
          now
        ]
      );

      await connection.commit();

      const [newRows] = await connection.execute(
        'SELECT * FROM recruiter_profiles WHERE user_id = ?',
        [finalUserId]
      );

      // Add verified field for frontend compatibility
      const recruiterData = newRows[0];
      if (recruiterData) {
        recruiterData.verified = recruiterData.status === 'approved' ? 1 : 0;
      }

      // Send welcome email to recruiter (only for new profiles)
      if (userEmail && userName) {
        try {
          const firstName = userName.split(' ')[0] || userName;
          const dashboardLink = process.env.FRONTEND_URL || 'http://localhost:5173';
          const emailSubject = 'Welcome to Jobion – Start Hiring Smarter';
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>

              <p>Welcome to <strong>Jobion</strong> 🎉</p>

              <p>Your recruiter account is now active. Jobion helps you discover the right candidates faster using skill-based matching and verified profiles.</p>

              <h3 style="color: #374151; margin-top: 30px;">Get started by:</h3>
              <ul style="line-height: 1.8;">
                <li>Completing your company profile</li>
                <li>Posting your first job</li>
                <li>Reviewing matched candidates</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardLink}/recruiter/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  👉 Go to Recruiter Dashboard
                </a>
              </div>

              <p>We’re excited to support your hiring journey.</p>

              <p style="margin-top: 30px;">
                Warm regards,<br>
                <strong>Team Jobion</strong>
              </p>
            </div>
          `;

          await sendEmail(userEmail, emailSubject, emailHtml);
        } catch (emailError) {
          // Log error but don't fail profile creation
          console.error('Error sending welcome email:', emailError);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Recruiter profile created successfully',
        recruiter: recruiterData
      });
    }
  } catch (err) {
    if (connection) {
      try { await connection.rollback(); } catch (e) { /* ignore rollback error */ }
    }
    console.error('Recruiter profile handler error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = recruiterProfile;