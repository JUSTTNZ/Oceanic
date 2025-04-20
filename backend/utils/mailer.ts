import nodemailer from 'nodemailer';

interface SendMailProps {
  subject: string;
  text?: string;
  html?: string;
}
 const sendAdminEmail = async ({ subject, text, html }: SendMailProps): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL, 
        pass: process.env.ADMIN_EMAIL_PASS, // Gmail App Password
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 20000,
    });

    const info = await transporter.sendMail({
      from: `"Oceanic Charts 🚀" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL, // allow override
      subject,
      text,
      html,
    });

    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error(' Failed to send email:', error);
  }
};


export {sendAdminEmail}