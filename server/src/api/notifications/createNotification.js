const pool = require("../../api/config/db");

async function createNotification(req, res) {
  const connection = await pool.getConnection();

  try {
    const { userId, type, title, message } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        ok: false,
        message: "userId, type, title, and message are required"
      });
    }

    const [result] = await connection.query(
      'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
      [userId, type, title, message]
    );

    res.json({
      ok: true,
      message: "Notification created successfully",
      notificationId: result.insertId
    });

  } catch (err) {
    console.error('CREATE /api/notifications error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  } finally {
    if (connection) connection.release();
  }
}

module.exports = createNotification;