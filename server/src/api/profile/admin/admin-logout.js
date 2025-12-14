const adminLogout = (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    // Clear cookie with same options used when setting it (matching admin-login.js)
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
    });

    res.json({
      success: true,
      message: 'Admin logged out successfully'
    });
  } catch (err) {
    console.error('Admin logout error', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = adminLogout;