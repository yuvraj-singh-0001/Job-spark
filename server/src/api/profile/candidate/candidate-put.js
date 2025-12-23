
const pool = require('../../config/db');

/**
 * Get table columns to verify structure
 */
async function getTableColumns(connection, tableName) {
  try {
    const [columns] = await connection.execute(`SHOW COLUMNS FROM ${tableName}`);
    return columns.map(col => col.Field);
  } catch (error) {
    return [];
  }
}

/**
 * Handler: Create or update user profile.
 * Exported as a const so you can attach it to a route elsewhere:
 *   router.put('/user', requireAuth, user);
 */
const candidateProfile = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    // Verify table structure
    const tableColumns = await getTableColumns(connection, 'candidate_profiles');
    // If you expect requireAuth to run before this handler, req.user should exist.
    // If not present, respond with 401 so caller knows to apply auth middleware.
    const authUserId = req.user?.id;
    if (!authUserId && !req.body?.user_id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: missing authenticated user. Apply requireAuth or send user_id in body.'
      });
    }

    const {
      user_id, // optional fallback if caller supplies it
      full_name,
      phone,
      date_of_birth,
      gender,
      city,
      state,
      country,
      highest_qualification,
      trade_stream,
      key_skills,
      job_type,
      availability,
      expected_salary,
      id_proof_available,
      preferred_contact_method,
      willing_to_relocate,
      experience_years,
      resume_path,
      linkedin_url,
      github_url
    } = req.body;

    const finalUserId = authUserId || user_id;
    if (!finalUserId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required (ensure authentication or provide user_id in request body).'
      });
    }

    if (!full_name) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required.'
      });
    }

    await connection.beginTransaction();

    // Check if profile exists
    const [existingProfiles] = await connection.execute(
      'SELECT user_id FROM candidate_profiles WHERE user_id = ?',
      [finalUserId]
    );

    const now = new Date();

    // Handle key_skills - convert array to JSON string if needed
    let keySkillsJson = null;
    if (key_skills) {
      if (Array.isArray(key_skills)) {
        // Only stringify if array has items
        if (key_skills.length > 0) {
          keySkillsJson = JSON.stringify(key_skills);
        }
      } else if (typeof key_skills === 'string') {
        // If it's a comma-separated string, convert to array then JSON
        try {
          const skillsArray = key_skills.split(',').map(s => s.trim()).filter(s => s);
          if (skillsArray.length > 0) {
            keySkillsJson = JSON.stringify(skillsArray);
          }
        } catch (e) {
          // If it's already JSON, try to parse and validate
          try {
            const parsed = JSON.parse(key_skills);
            if (Array.isArray(parsed) && parsed.length > 0) {
              keySkillsJson = key_skills;
            }
          } catch (e2) {
            // If parsing fails, use as is if not empty
            if (key_skills.trim()) {
              keySkillsJson = key_skills;
            }
          }
        }
      } else {
        keySkillsJson = JSON.stringify(key_skills);
      }
    }

    // Handle willing_to_relocate - convert to tinyint (0 or 1)
    let willingToRelocateValue = null;
    if (willing_to_relocate !== undefined && willing_to_relocate !== null) {
      if (typeof willing_to_relocate === 'boolean') {
        willingToRelocateValue = willing_to_relocate ? 1 : 0;
      } else if (typeof willing_to_relocate === 'string') {
        const lower = willing_to_relocate.toLowerCase();
        willingToRelocateValue = (lower === 'yes' || lower === 'true' || lower === '1') ? 1 : 0;
      } else {
        willingToRelocateValue = willing_to_relocate ? 1 : 0;
      }
    }

    if (existingProfiles.length > 0) {
      // Update existing profile
      const updateValues = [
        full_name,
        phone !== undefined ? phone : null,
        date_of_birth || null,
        gender || null,
        city || null,
        state || null,
        country || null,
        highest_qualification || null,
        trade_stream || null,
        keySkillsJson,
        job_type || null,
        availability || null,
        expected_salary || null,
        id_proof_available || null,
        preferred_contact_method || null,
        willingToRelocateValue,
        experience_years !== undefined && experience_years !== null ? parseFloat(experience_years) : null,
        resume_path || null,
        linkedin_url || null,
        github_url || null,
        now,
        finalUserId
      ];

      const updateColumns = [
        'full_name', 'phone', 'date_of_birth', 'gender', 'city', 'state', 'country',
        'highest_qualification', 'trade_stream', 'key_skills', 'job_type', 'availability',
        'expected_salary', 'id_proof_available', 'preferred_contact_method',
        'willing_to_relocate', 'experience_years', 'resume_path',
        'linkedin_url', 'github_url', 'updated_at'
      ];

      const updateResult = await connection.execute(
        `UPDATE candidate_profiles
         SET full_name = ?, phone = ?, date_of_birth = ?, gender = ?, city = ?, state = ?, country = ?,
             highest_qualification = ?, trade_stream = ?, key_skills = ?, job_type = ?, availability = ?,
             expected_salary = ?, id_proof_available = ?, preferred_contact_method = ?,
             willing_to_relocate = ?, experience_years = ?, resume_path = ?,
             linkedin_url = ?, github_url = ?, updated_at = ?
         WHERE user_id = ?`,
        updateValues
      );

      await connection.commit();

      const [updatedProfiles] = await connection.execute(
        'SELECT * FROM candidate_profiles WHERE user_id = ?',
        [finalUserId]
      );

      // Parse key_skills JSON for response
      if (updatedProfiles[0] && updatedProfiles[0].key_skills) {
        try {
          updatedProfiles[0].key_skills = JSON.parse(updatedProfiles[0].key_skills);
        } catch (e) {
          // If parsing fails, keep as is
        }
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedProfiles[0]
      });
    } else {
      // Create new profile
      const insertValues = [
        finalUserId,
        full_name,
        phone || null,
        date_of_birth || null,
        gender || null,
        city || null,
        state || null,
        country || null,
        highest_qualification || null,
        trade_stream || null,
        keySkillsJson,
        job_type || null,
        availability || null,
        expected_salary || null,
        id_proof_available || null,
        preferred_contact_method || null,
        willingToRelocateValue,
        experience_years !== undefined && experience_years !== null ? parseFloat(experience_years) : null,
        resume_path || null,
        linkedin_url || null,
        github_url || null,
        now,
        now
      ];

      const columnNames = [
        'user_id', 'full_name', 'phone', 'date_of_birth', 'gender', 'city', 'state', 'country',
        'highest_qualification', 'trade_stream', 'key_skills', 'job_type', 'availability', 'expected_salary', 'id_proof_available',
        'preferred_contact_method', 'willing_to_relocate', 'experience_years', 'resume_path',
        'linkedin_url', 'github_url', 'created_at', 'updated_at'
      ];

      const insertResult = await connection.execute(
        `INSERT INTO candidate_profiles
         (user_id, full_name, phone, date_of_birth, gender, city, state, country,
          highest_qualification, trade_stream, key_skills, job_type, availability, expected_salary, id_proof_available,
          preferred_contact_method, willing_to_relocate, experience_years, resume_path,
          linkedin_url, github_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        insertValues
      );

      await connection.commit();

      const [newProfiles] = await connection.execute(
        'SELECT * FROM candidate_profiles WHERE user_id = ?',
        [finalUserId]
      );

      // Parse key_skills JSON for response
      if (newProfiles[0] && newProfiles[0].key_skills) {
        try {
          newProfiles[0].key_skills = JSON.parse(newProfiles[0].key_skills);
        } catch (e) {
          // If parsing fails, keep as is
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        user: newProfiles[0]
      });
    }
  } catch (error) {
    try {
      await connection.rollback();
    } catch (e) {
      // Rollback error
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      sqlError: process.env.NODE_ENV === 'development' ? error.sqlMessage : undefined,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = candidateProfile;
