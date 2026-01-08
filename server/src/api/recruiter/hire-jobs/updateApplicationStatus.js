const pool = require("../../config/db");
const { sendEmail } = require("../../../services/emailService");

async function updateApplicationStatus(req, res) {
  const connection = await pool.getConnection();

  try {
    const recruiterId = req.user?.id;
    const { applicationId } = req.params;
    const { status, interviewDate, interviewTime, interviewMessage } = req.body;

    if (!recruiterId) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    if (!applicationId) {
      return res.status(400).json({ ok: false, message: "Application ID is required" });
    }

    // Validate status
    const validStatuses = ['applied', 'shortlisted', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Verify the application belongs to a job owned by this recruiter
    const [applicationRows] = await connection.query(
      `SELECT ja.id, ja.job_id, ja.user_id, j.recruiter_id, jr.name as job_title,
              u.email as candidate_email, u.name as candidate_name,
              r.company_name
       FROM job_applications ja
       INNER JOIN jobs j ON ja.job_id = j.id
       LEFT JOIN job_roles jr ON j.role_id = jr.id
       LEFT JOIN users u ON ja.user_id = u.id
       LEFT JOIN recruiter_profiles r ON j.recruiter_id = r.user_id
       WHERE ja.id = ? AND j.recruiter_id = ?`,
      [applicationId, recruiterId]
    );

    if (applicationRows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Application not found or access denied"
      });
    }

    const application = applicationRows[0];

    // Update application status
    await connection.beginTransaction();

    await connection.query(
      'UPDATE job_applications SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, applicationId]
    );

    // Send email notification and create in-app notification based on status
    if (application.candidate_email) {
      try {
        let emailSubject, emailHtml, notificationType, notificationTitle, notificationMessage;

        if (status === 'shortlisted') {
          const jobLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/jobs/${application.job_id}`;
          emailSubject = `You’ve Been Shortlisted – ${application.company_name || 'Company'}`;
          emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Hi ${application.candidate_name.split(' ')[0]}!</h2>

              <p>Great news 🎉</p>

              <p>You've been <strong>shortlisted</strong> for the role of <strong>${application.job_title}</strong> at <strong>${application.company_name || 'our company'}</strong>.</p>

              <p>The recruiter may contact you shortly with interview details.</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${jobLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  👉 View Job Details
                </a>
              </div>

              <p>Wishing you success,<br><strong>Team Jobion</strong></p>
            </div>
          `;
          notificationType = 'application_shortlisted';
          notificationTitle = 'Application Shortlisted!';
          notificationMessage = `Congratulations! Your application for "${application.job_title}" has been shortlisted. The recruiter will contact you soon.`;
        } else if (status === 'rejected') {
          emailSubject = `Update on your application for ${application.job_title}`;
          emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #374151;">Application Update</h2>
              <p>Dear ${application.candidate_name},</p>
              <p>Thank you for your interest in the position: <strong>${application.job_title}</strong> at <strong>${application.company_name || 'our company'}</strong>.</p>
              <p>After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current requirements.</p>
              <p>We appreciate the time and effort you invested in your application and encourage you to apply for future opportunities that match your skills and experience.</p>

              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">💡 Keep Applying!</h3>
                <p style="margin-bottom: 0; color: #92400e;">
                  Don't be discouraged! Many successful careers are built on persistence. Keep refining your applications and exploring new opportunities.
                </p>
              </div>

              <p>Best regards,<br>The Job-spark Team</p>
            </div>
          `;
          notificationType = 'application_rejected';
          notificationTitle = 'Application Update';
          notificationMessage = `Thank you for applying to "${application.job_title}". After careful consideration, we've decided to move forward with other candidates.`;
        }

        if (emailSubject && emailHtml) {
          await sendEmail(application.candidate_email, emailSubject, emailHtml);
        }

        if (notificationType && notificationTitle && notificationMessage) {
          // Create in-app notification
          await connection.query(
            'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
            [
              application.user_id, // candidate's user ID
              notificationType,
              notificationTitle,
              notificationMessage
            ]
          );
        }

      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Don't fail the main operation if notification fails
      }
    }

    await connection.commit();

    res.json({
      ok: true,
      message: "Application status updated successfully",
      status: status
    });

  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('UPDATE /api/recruiter/jobs/applications/:applicationId/status error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = updateApplicationStatus;