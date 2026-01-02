// src/controllers/support.controller.ts
import { Request, Response } from 'express'
import nodemailer from 'nodemailer'

interface SupportFormData {
  name: string
  email: string
  subject: string
  message: string
}

export const sendSupportEmail = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message }: SupportFormData = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Email to admin
    const adminEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #111827;
            color: #f3f4f6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(to bottom right, #1f2937, #111827);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .header {
            background: linear-gradient(to right, #3b82f6, #2563eb);
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 32px 24px;
          }
          .field {
            margin-bottom: 24px;
          }
          .field-label {
            font-weight: 600;
            color: #60a5fa;
            margin-bottom: 8px;
            display: block;
          }
          .field-value {
            background-color: rgba(31, 41, 55, 0.5);
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            color: #e5e7eb;
            word-break: break-word;
          }
          .footer {
            background-color: rgba(31, 41, 55, 0.3);
            padding: 20px 24px;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
            border-top: 1px solid rgba(107, 114, 128, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Support Message</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="field-label">From:</span>
              <div class="field-value">${name} (${email})</div>
            </div>
            <div class="field">
              <span class="field-label">Subject:</span>
              <div class="field-value">${subject}</div>
            </div>
            <div class="field">
              <span class="field-label">Message:</span>
              <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Received from: ${email} | Time: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Email to user (confirmation)
    const userEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #111827;
            color: #f3f4f6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(to bottom right, #1f2937, #111827);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .header {
            background: linear-gradient(to right, #10b981, #059669);
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 32px 24px;
          }
          .content p {
            color: #e5e7eb;
            line-height: 1.6;
            margin-bottom: 16px;
          }
          .footer {
            background-color: rgba(31, 41, 55, 0.3);
            padding: 20px 24px;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
            border-top: 1px solid rgba(107, 114, 128, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Message Received</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for contacting Oceanic Charts support! We have received your message and our team will get back to you as soon as possible.</p>
            <p><strong>Your message details:</strong></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p>Our typical response time is 2-4 hours during business hours.</p>
            <p>If you have any urgent matters, please don't hesitate to reach out via WhatsApp or phone.</p>
            <p>Best regards,<br><strong>Oceanic Charts Support Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2026 Oceanic Charts. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email to admin
    await transporter.sendMail({
      from: `"Oceanic Charts Support" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[NEW SUPPORT] ${subject}`,
      html: adminEmailContent,
      replyTo: email
    })

    // Send confirmation email to user after 5 minutes delay
    setTimeout(async () => {
      try {
        await transporter.sendMail({
          from: `"Oceanic Charts Support" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'We received your support message - Oceanic Charts',
          html: userEmailContent
        });
        console.log(`✅ Delayed confirmation email sent to user: ${email}`);
      } catch (error) {
        console.error('❌ Error sending delayed confirmation email:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    console.log(`✅ Support email sent from ${email} - Subject: ${subject}`)

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    })
  } catch (error) {
    console.error('❌ Error sending support email:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    })
  }
}
