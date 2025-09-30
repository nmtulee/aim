import nodemailer from 'nodemailer';    

import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});



const sendEmail = async ({ to, subject, text, html }) => { 
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to,
            subject,
            text,
            html,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
    console.error("Error sending email:", error);
        
    }
}

export default sendEmail;