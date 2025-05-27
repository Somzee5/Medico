// your-backend-folder/utils/emailSender.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Configure Nodemailer transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail's SMTP host
    port: 587,              // Standard port for TLS
    secure: false,          // 'true' for port 465 (SSL), 'false' for other ports (like 587 for TLS)
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env
        pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
    },
});

/**
 * Sends an appointment reminder email.
 * @param {string} recipientEmail - The email address of the recipient.
 * @param {string} recipientName - The name of the recipient.
 * @param {string} doctorName - The name of the doctor.
 * @param {string} appointmentTime - Formatted string of the appointment time (e.g., "Monday, July 15, 2024, 10:00 AM IST").
 * @param {string} joinUrl - The Zoom meeting join URL for the patient.
 * @param {string | null} startUrl - The Zoom meeting start URL for the doctor (null for patients).
 * @param {boolean} isDoctor - True if the recipient is a doctor, false if a patient.
 */
export const sendAppointmentReminderEmail = async (recipientEmail, recipientName, doctorName, appointmentTime, joinUrl, startUrl, isDoctor) => {
    try {
        const subject = `Appointment Reminder: Your ${isDoctor ? 'Meeting with Patient' : 'Appointment with Dr. ' + doctorName} in 5 Minutes!`;
        const htmlContent = `
            <p>Dear ${recipientName},</p>
            <p>This is a friendly reminder that your online appointment is scheduled to start in <b>5 minutes</b>.</p>
            <p><b>Meeting Time:</b> ${appointmentTime}</p>
            <p><b>Meeting Link:</b> <a href="${joinUrl}">Click here to join the meeting</a></p>
            ${isDoctor && startUrl ? `<p><b>Start Meeting Link (for Doctor):</b> <a href="${startUrl}">Click here to start the meeting</a></p>` : ''}
            <p>Please join on time. We wish you a productive session.</p>
            <p>Best regards,</p>
            <p>The MediEase Team</p>
            <hr>
            <small>This is an automated email. Please do not reply.</small>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER, // The 'from' address (your Gmail)
            to: recipientEmail,
            subject: subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent successfully to ${recipientEmail}`);
    } catch (error) {
        console.error(`Error sending reminder email to ${recipientEmail}:`, error);
        // Log more details if available, e.g., error.response for some APIs
    }
};