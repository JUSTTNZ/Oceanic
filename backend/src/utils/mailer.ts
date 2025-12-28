// import nodemailer from 'nodemailer';

// interface SendMailProps {
//   subject: string;
//   text?: string;
//   to?: string;
//   html?: string;
// }

// const sendAdminEmail = async ({ subject, text, html, to }: SendMailProps): Promise<void> => {
//   const recipient = to || process.env.ADMIN_EMAIL!; // default to admin email
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.ADMIN_EMAIL, 
//         pass: process.env.ADMIN_EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//       connectionTimeout: 20000,
//     });

//     const info = await transporter.sendMail({
//       from: `"Oceanic Charts 🚀" <${process.env.ADMIN_EMAIL}>`,
//       to: recipient,
//       subject,
//       text,
//       html,
//     });

//     console.log('✅ Email sent:', info.messageId);
//   } catch (error) {
//     console.error('❌ Failed to send email:', error);
//   }
// };
// export { sendAdminEmail };

// utils/mailer.ts
import nodemailer from "nodemailer";

interface TransactionEmailData {
  type: "buy" | "sell";
  userFullname: string;
  userEmail: string;
  coin: string;
  amount: number;
  coinAmount: number;
  txid: string;
  country: string;
  walletAddressUsed?: string;
  walletAddressSentTo?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
}

export const sendAdminEmail = async (transactionData: TransactionEmailData) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Build email content with styled HTML
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
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
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
          }
          .badge {
            display: inline-block;
            margin-top: 12px;
            padding: 6px 16px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: #ffffff;
            text-transform: uppercase;
          }
          .content {
            padding: 32px 24px;
          }
          .section {
            background: rgba(31, 41, 55, 0.3);
            border: 1px solid rgba(55, 65, 81, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .section h2 {
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: #93c5fd;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(55, 65, 81, 0.3);
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            color: #9ca3af;
            font-size: 14px;
            font-weight: 500;
          }
          .info-value {
            color: #f3f4f6;
            font-size: 14px;
            font-weight: 600;
            text-align: right;
          }
          .highlight {
            background: linear-gradient(to right, #3b82f6, #2563eb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
            font-size: 20px;
          }
          .wallet-address {
            background: rgba(17, 24, 39, 0.5);
            padding: 12px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #93c5fd;
            word-break: break-all;
            margin-top: 8px;
          }
          .footer {
            padding: 24px;
            text-align: center;
            background: rgba(17, 24, 39, 0.5);
            border-top: 1px solid rgba(55, 65, 81, 0.2);
          }
          .footer p {
            margin: 0;
            color: #6b7280;
            font-size: 12px;
          }
          .type-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .type-buy {
            background: rgba(34, 197, 94, 0.2);
            color: #86efac;
            border: 1px solid rgba(34, 197, 94, 0.3);
          }
          .type-sell {
            background: rgba(251, 146, 60, 0.2);
            color: #fdba74;
            border: 1px solid rgba(251, 146, 60, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🔔 New Transaction Alert</h1>
            <div class="badge">${transactionData.type.toUpperCase()} Transaction</div>
          </div>

          <!-- Content -->
          <div class="content">
            <!-- User Information -->
            <div class="section">
              <h2>👤 User Information</h2>
              <div class="info-row">
                <span class="info-label">Name</span>
                <span class="info-value">${transactionData.userFullname}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">${transactionData.userEmail}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Country</span>
                <span class="info-value">📍 ${transactionData.country}</span>
              </div>
            </div>

            <!-- Transaction Details -->
            <div class="section">
              <h2>💰 Transaction Details</h2>
              <div class="info-row">
                <span class="info-label">Type</span>
                <span class="info-value">
                  <span class="type-badge ${transactionData.type === 'buy' ? 'type-buy' : 'type-sell'}">
                    ${transactionData.type === 'buy' ? '🔼' : '🔽'} ${transactionData.type.toUpperCase()}
                  </span>
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Coin</span>
                <span class="info-value highlight">${transactionData.coin.toUpperCase()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">USD Amount</span>
                <span class="info-value" style="color: #86efac;">$${transactionData.amount.toFixed(2)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Coin Amount</span>
                <span class="info-value">${transactionData.coinAmount} ${transactionData.coin.toUpperCase()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Transaction ID</span>
                <span class="info-value" style="font-size: 11px; font-family: monospace;">${transactionData.txid.slice(0, 16)}...</span>
              </div>
            </div>

            ${transactionData.type === "buy" ? `
              <!-- Buy Transaction Details -->
              <div class="section">
                <h2>🔼 Buy Transaction Details</h2>
                <div class="info-row">
                  <span class="info-label">User Wallet Address</span>
                </div>
                <div class="wallet-address">${transactionData.walletAddressUsed}</div>
                ${transactionData.walletAddressSentTo ? `
                  <div class="info-row" style="margin-top: 16px;">
                    <span class="info-label">Admin Wallet (Sent To)</span>
                  </div>
                  <div class="wallet-address">${transactionData.walletAddressSentTo}</div>
                ` : ''}
              </div>
            ` : ""}

            ${transactionData.type === "sell" ? `
              <!-- Sell Transaction Details -->
              <div class="section">
                <h2>🔽 Sell Transaction - Bank Details</h2>
                <div class="info-row">
                  <span class="info-label">🏦 Bank Name</span>
                  <span class="info-value">${transactionData.bankName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">👤 Account Name</span>
                  <span class="info-value">${transactionData.accountName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">💳 Account Number</span>
                  <span class="info-value" style="font-family: monospace; color: #93c5fd;">${transactionData.accountNumber}</span>
                </div>
                ${transactionData.walletAddressSentTo ? `
                  <div class="info-row" style="margin-top: 16px;">
                    <span class="info-label">Admin Wallet (Received At)</span>
                  </div>
                  <div class="wallet-address">${transactionData.walletAddressSentTo}</div>
                ` : ''}
              </div>
            ` : ""}
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>⏰ Transaction created at: ${new Date().toLocaleString()}</p>
            <p style="margin-top: 8px; color: #4b5563;">This is an automated notification from your admin panel.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Oceanic Charts" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 New ${transactionData.type.toUpperCase()} Transaction - ${transactionData.coin.toUpperCase()} - ${transactionData.userFullname}`,
      html: emailContent,
    });

    console.log("✅ Admin email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending admin email:", error);
    return { success: false, error };
  }
};

export const sendUserTransactionStatusEmail = async (
  userEmail: string,
  status: string,
  transactionData: any
) => {
  try {
    console.log("Sending email to:", userEmail);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let emailSubject = "";
    let emailBody = "";

    if (status === "confirmed") {
      emailSubject = `✅ Transaction Confirmed - ${transactionData.coin.toUpperCase()}`;
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
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
              background: linear-gradient(to right, #22c55e, #16a34a);
              padding: 40px 24px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              color: #ffffff;
              font-size: 28px;
              font-weight: bold;
            }
            .icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            .content {
              padding: 32px 24px;
            }
            .greeting {
              font-size: 18px;
              color: #f3f4f6;
              margin-bottom: 16px;
            }
            .message {
              font-size: 16px;
              color: #d1d5db;
              line-height: 1.6;
              margin-bottom: 24px;
            }
            .section {
              background: rgba(31, 41, 55, 0.3);
              border: 1px solid rgba(34, 197, 94, 0.3);
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 24px;
            }
            .section h2 {
              margin: 0 0 20px 0;
              font-size: 18px;
              font-weight: 600;
              color: #86efac;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid rgba(55, 65, 81, 0.3);
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              color: #9ca3af;
              font-size: 14px;
              font-weight: 500;
            }
            .info-value {
              color: #f3f4f6;
              font-size: 14px;
              font-weight: 600;
              text-align: right;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              background: rgba(34, 197, 94, 0.2);
              color: #86efac;
              border: 1px solid rgba(34, 197, 94, 0.3);
            }
            .type-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .type-buy {
              background: rgba(34, 197, 94, 0.2);
              color: #86efac;
              border: 1px solid rgba(34, 197, 94, 0.3);
            }
            .type-sell {
              background: rgba(251, 146, 60, 0.2);
              color: #fdba74;
              border: 1px solid rgba(251, 146, 60, 0.3);
            }
            .bank-details {
              background: rgba(59, 130, 246, 0.1);
              border: 1px solid rgba(59, 130, 246, 0.3);
              border-radius: 8px;
              padding: 16px;
              margin-top: 16px;
            }
            .bank-details h3 {
              margin: 0 0 12px 0;
              font-size: 16px;
              color: #93c5fd;
            }
            .bank-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }
            .footer {
              padding: 24px;
              text-align: center;
              background: rgba(17, 24, 39, 0.5);
              border-top: 1px solid rgba(34, 197, 94, 0.2);
            }
            .footer p {
              margin: 0;
              color: #6b7280;
              font-size: 14px;
              line-height: 1.6;
            }
            .highlight {
              color: #86efac;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="icon">✅</div>
              <h1>Transaction Confirmed!</h1>
            </div>

            <!-- Content -->
            <div class="content">
              <p class="greeting">Dear <strong>${transactionData.userFullname}</strong>,</p>
              <p class="message">
                Great news! Your ${transactionData.type} transaction has been <span class="highlight">confirmed and processed successfully</span>. 
                ${transactionData.type === 'sell' ? 'Your payment will be processed and sent to your bank account shortly.' : 'Your crypto has been credited to your wallet.'}
              </p>

              <!-- Transaction Details -->
              <div class="section">
                <h2>💰 Transaction Summary</h2>
                <div class="info-row">
                  <span class="info-label">Transaction Type</span>
                  <span class="info-value">
                    <span class="type-badge ${transactionData.type === 'buy' ? 'type-buy' : 'type-sell'}">
                      ${transactionData.type === 'buy' ? '🔼' : '🔽'} ${transactionData.type.toUpperCase()}
                    </span>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Cryptocurrency</span>
                  <span class="info-value" style="color: #93c5fd; font-weight: bold;">${transactionData.coin.toUpperCase()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">USD Amount</span>
                  <span class="info-value" style="color: #86efac; font-size: 16px;">$${transactionData.amount.toFixed(2)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Coin Amount</span>
                  <span class="info-value">${transactionData.coinAmount} ${transactionData.coin.toUpperCase()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Transaction ID</span>
                  <span class="info-value" style="font-size: 11px; font-family: monospace; word-break: break-all;">${transactionData.txid.slice(0, 20)}...</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status</span>
                  <span class="info-value"><span class="status-badge">✓ CONFIRMED</span></span>
                </div>
              </div>

              ${transactionData.type === "sell" ? `
                <!-- Bank Details -->
                <div class="bank-details">
                  <h3>🏦 Payment Destination</h3>
                  <div class="bank-row">
                    <span class="info-label">Bank Name</span>
                    <span class="info-value">${transactionData.bankName}</span>
                  </div>
                  <div class="bank-row">
                    <span class="info-label">Account Name</span>
                    <span class="info-value">${transactionData.accountName}</span>
                  </div>
                  <div class="bank-row">
                    <span class="info-label">Account Number</span>
                    <span class="info-value" style="font-family: monospace; color: #93c5fd; font-weight: bold;">${transactionData.accountNumber}</span>
                  </div>
                </div>
              ` : ""}

              <p class="message" style="margin-top: 24px;">
                ${transactionData.type === 'sell' 
                  ? '💸 Your funds will be transferred to the bank account above within the next few hours.' 
                  : '🎉 Your cryptocurrency is now available in your wallet!'}
              </p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p><strong>Thank you for using Oceanic Charts!</strong></p>
              <p style="margin-top: 8px;">If you have any questions, please don't hesitate to contact our support team.</p>
              <p style="margin-top: 16px; color: #4b5563; font-size: 12px;">
                This email was sent on ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (status === "rejected") {
      emailSubject = `❌ Transaction Rejected - ${transactionData.coin.toUpperCase()}`;
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
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
              background: linear-gradient(to right, #ef4444, #dc2626);
              padding: 40px 24px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              color: #ffffff;
              font-size: 28px;
              font-weight: bold;
            }
            .icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            .content {
              padding: 32px 24px;
            }
            .greeting {
              font-size: 18px;
              color: #f3f4f6;
              margin-bottom: 16px;
            }
            .message {
              font-size: 16px;
              color: #d1d5db;
              line-height: 1.6;
              margin-bottom: 24px;
            }
            .section {
              background: rgba(31, 41, 55, 0.3);
              border: 1px solid rgba(239, 68, 68, 0.3);
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 24px;
            }
            .section h2 {
              margin: 0 0 20px 0;
              font-size: 18px;
              font-weight: 600;
              color: #fca5a5;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid rgba(55, 65, 81, 0.3);
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              color: #9ca3af;
              font-size: 14px;
              font-weight: 500;
            }
            .info-value {
              color: #f3f4f6;
              font-size: 14px;
              font-weight: 600;
              text-align: right;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              background: rgba(239, 68, 68, 0.2);
              color: #fca5a5;
              border: 1px solid rgba(239, 68, 68, 0.3);
            }
            .type-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .type-buy {
              background: rgba(34, 197, 94, 0.2);
              color: #86efac;
              border: 1px solid rgba(34, 197, 94, 0.3);
            }
            .type-sell {
              background: rgba(251, 146, 60, 0.2);
              color: #fdba74;
              border: 1px solid rgba(251, 146, 60, 0.3);
            }
            .support-box {
              background: rgba(59, 130, 246, 0.1);
              border: 1px solid rgba(59, 130, 246, 0.3);
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin-top: 24px;
            }
            .support-box h3 {
              margin: 0 0 12px 0;
              font-size: 16px;
              color: #93c5fd;
            }
            .support-box p {
              margin: 0;
              color: #d1d5db;
              font-size: 14px;
            }
            .footer {
              padding: 24px;
              text-align: center;
              background: rgba(17, 24, 39, 0.5);
              border-top: 1px solid rgba(239, 68, 68, 0.2);
            }
            .footer p {
              margin: 0;
              color: #6b7280;
              font-size: 14px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="icon">❌</div>
              <h1>Transaction Rejected</h1>
            </div>

            <!-- Content -->
            <div class="content">
              <p class="greeting">Dear <strong>${transactionData.userFullname}</strong>,</p>
              <p class="message">
                We regret to inform you that your ${transactionData.type} transaction has been rejected and could not be processed.
              </p>

              <!-- Transaction Details -->
              <div class="section">
                <h2>📋 Transaction Details</h2>
                <div class="info-row">
                  <span class="info-label">Transaction Type</span>
                  <span class="info-value">
                    <span class="type-badge ${transactionData.type === 'buy' ? 'type-buy' : 'type-sell'}">
                      ${transactionData.type === 'buy' ? '🔼' : '🔽'} ${transactionData.type.toUpperCase()}
                    </span>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Cryptocurrency</span>
                  <span class="info-value" style="color: #93c5fd; font-weight: bold;">${transactionData.coin.toUpperCase()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">USD Amount</span>
                  <span class="info-value" style="font-size: 16px;">$${transactionData.amount.toFixed(2)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Transaction ID</span>
                  <span class="info-value" style="font-size: 11px; font-family: monospace; word-break: break-all;">${transactionData.txid.slice(0, 20)}...</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status</span>
                  <span class="info-value"><span class="status-badge">✗ REJECTED</span></span>
                </div>
              </div>

              <!-- Support Box -->
              <div class="support-box">
                <h3>💬 Need Help?</h3>
                <p>If you believe this is an error or need clarification, please contact our support team. We're here to help!</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p><strong>Oceanic Charts Support Team</strong></p>
              <p style="margin-top: 8px;">We apologize for any inconvenience this may have caused.</p>
              <p style="margin-top: 16px; color: #4b5563; font-size: 12px;">
                This email was sent on ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      return; // Don't send email for other statuses
    }

    await transporter.sendMail({
      from: `"Oceanic Charts" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: emailSubject,
      html: emailBody,
    });

    console.log(`✅ Status email sent successfully to user: ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending user status email:", error);
    return { success: false, error };
  }
};