const pool = require("../../api/config/db");

async function getUserNotifications(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        }

        const [notifications] = await pool.query(
            'SELECT id, type, title, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json({
            ok: true,
            notifications: notifications
        });

    } catch (err) {
        console.error('GET /api/notifications error:', err);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
}

module.exports = getUserNotifications;
