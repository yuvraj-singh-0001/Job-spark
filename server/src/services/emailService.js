const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info('Email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        logger.error('Email sending failed:', error);
        throw error;
    }
};

module.exports = { sendEmail };
