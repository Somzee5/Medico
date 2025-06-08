// your-backend-folder/utils/emailSender.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Configure Nodemailer transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail service
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Only for development
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP Configuration Error:', error);
    } else {
        console.log('SMTP Server is ready to send emails');
    }
});

/**
 * Sends an appointment reminder email.
 * @param {string} recipientEmail - The email address of the recipient.
 * @param {string} recipientName - The name of the recipient.
 * @param {string} doctorName - The name of the doctor.
 * @param {string} appointmentTime - Formatted string of the appointment time.
 * @param {string} joinUrl - The Zoom meeting join URL for the patient.
 * @param {string | null} startUrl - The Zoom meeting start URL for the doctor.
 * @param {boolean} isDoctor - True if the recipient is a doctor, false if a patient.
 */
export const sendAppointmentReminderEmail = async (recipientEmail, recipientName, doctorName, appointmentTime, joinUrl, startUrl, isDoctor) => {
    if (!recipientEmail) {
        throw new Error('Recipient email is required');
    }

    try {
        const subject = `Appointment Reminder: Your ${isDoctor ? 'Meeting with Patient' : 'Appointment with Dr. ' + doctorName} in 5 Minutes!`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2300a3;">Appointment Reminder</h2>
                <p>Dear ${recipientName},</p>
                <p>This is a friendly reminder that your online appointment is scheduled to start in <b>5 minutes</b>.</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><b>Meeting Time:</b> ${appointmentTime}</p>
                    <p><b>Meeting Link:</b> <a href="${joinUrl}" style="color: #2300a3;">Click here to join the meeting</a></p>
                    ${isDoctor && startUrl ? `<p><b>Start Meeting Link (for Doctor):</b> <a href="${startUrl}" style="color: #2300a3;">Click here to start the meeting</a></p>` : ''}
                </div>
                <p>Please join on time. We wish you a productive session.</p>
                <p>Best regards,<br>The Medico Team</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <small style="color: #666;">This is an automated email. Please do not reply.</small>
            </div>
        `;

        const mailOptions = {
            from: {
                name: 'Medico',
                address: process.env.EMAIL_USER
            },
            to: recipientEmail,
            subject: subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${recipientEmail}:`, info.messageId);
        return info;
    } catch (error) {
        console.error(`Error sending email to ${recipientEmail}:`, error);
        throw error; // Re-throw to handle in the scheduler
    }
};