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

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            box-sizing: border-box;
          }
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
            font-size: 16px;
            font-weight: 600;
            color: #93c5fd;
          }
          .info-grid {
            width: 100%;
            border-collapse: collapse;
          }
          .info-grid tr {
            border-bottom: 1px solid rgba(55, 65, 81, 0.3);
          }
          .info-grid tr:last-child {
            border-bottom: none;
          }
          .info-grid td {
            padding: 12px 0;
            vertical-align: middle;
          }
          .info-label {
            color: #9ca3af;
            font-size: 14px;
            font-weight: 500;
            width: 45%;
            padding-right: 16px;
          }
          .info-value {
            color: #f3f4f6;
            font-size: 14px;
            font-weight: 600;
            text-align: right;
            width: 55%;
            word-wrap: break-word;
          }
          .highlight {
            background: linear-gradient(to right, #3b82f6, #2563eb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
            font-size: 18px;
          }
          .wallet-address {
            background: rgba(17, 24, 39, 0.5);
            padding: 12px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #93c5fd;
            word-break: break-all;
            margin-top: 8px;
            line-height: 1.5;
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
            line-height: 1.6;
          }
          .type-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            white-space: nowrap;
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
              <table class="info-grid">
                <tr>
                  <td class="info-label">Name</td>
                  <td class="info-value">${transactionData.userFullname}</td>
                </tr>
                <tr>
                  <td class="info-label">Email</td>
                  <td class="info-value">${transactionData.userEmail}</td>
                </tr>
                <tr>
                  <td class="info-label">Country</td>
                  <td class="info-value">📍 ${transactionData.country}</td>
                </tr>
              </table>
            </div>

            <!-- Transaction Details -->
            <div class="section">
              <h2>💰 Transaction Details</h2>
              <table class="info-grid">
                <tr>
                  <td class="info-label">Type</td>
                  <td class="info-value">
                    <span class="type-badge ${transactionData.type === 'buy' ? 'type-buy' : 'type-sell'}">
                      ${transactionData.type === 'buy' ? '🔼' : '🔽'} ${transactionData.type.toUpperCase()}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="info-label">Coin</td>
                  <td class="info-value highlight">${transactionData.coin.toUpperCase()}</td>
                </tr>
                <tr>
                  <td class="info-label">USD Amount</td>
                  <td class="info-value" style="color: #86efac;">$${transactionData.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td class="info-label">Coin Amount</td>
                  <td class="info-value">${transactionData.coinAmount} ${transactionData.coin.toUpperCase()}</td>
                </tr>
              </table>
              <div style="margin-top: 12px;">
                <div style="color: #9ca3af; font-size: 14px; margin-bottom: 4px;">Transaction ID:</div>
                <div class="wallet-address">${transactionData.txid}</div>
              </div>
            </div>

            ${transactionData.type === "buy" ? `
              <!-- Buy Transaction Details -->
              <div class="section">
                <h2>🔼 Buy Transaction Details</h2>
                <div style="margin-bottom: 12px;">
                  <div style="color: #9ca3af; font-size: 14px; margin-bottom: 4px;">User Wallet Address:</div>
                  <div class="wallet-address">${transactionData.walletAddressUsed}</div>
                </div>
                ${transactionData.walletAddressSentTo ? `
                  <div style="margin-top: 16px;">
                    <div style="color: #9ca3af; font-size: 14px; margin-bottom: 4px;">Admin Wallet (Sent To):</div>
                    <div class="wallet-address">${transactionData.walletAddressSentTo}</div>
                  </div>
                ` : ''}
              </div>
            ` : ""}

            ${transactionData.type === "sell" ? `
              <!-- Sell Transaction Details -->
              <div class="section">
                <h2>🔽 Sell Transaction - Bank Details</h2>
                <table class="info-grid">
                  <tr>
                    <td class="info-label">🏦 Bank Name</td>
                    <td class="info-value">${transactionData.bankName}</td>
                  </tr>
                  <tr>
                    <td class="info-label">👤 Account Name</td>
                    <td class="info-value">${transactionData.accountName}</td>
                  </tr>
                  <tr>
                    <td class="info-label">💳 Account Number</td>
                    <td class="info-value" style="font-family: monospace; color: #93c5fd;">${transactionData.accountNumber}</td>
                  </tr>
                </table>
                ${transactionData.walletAddressSentTo ? `
                  <div style="margin-top: 16px;">
                    <div style="color: #9ca3af; font-size: 14px; margin-bottom: 4px;">Admin Wallet (Received At):</div>
                    <div class="wallet-address">${transactionData.walletAddressSentTo}</div>
                  </div>
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
* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  background-color: #111827;
  color: #f3f4f6;
}
.container {
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(to bottom right, #1f2937, #111827);
  border-radius: 16px;
  overflow: hidden;
}
.header {
  background: linear-gradient(to right, #22c55e, #16a34a);
  padding: 32px 24px;
  text-align: center;
}
.header h1 {
  margin: 0;
  font-size: 24px;
  color: #ffffff;
}
.content {
  padding: 32px 24px;
}
.greeting {
  font-size: 18px;
  margin-bottom: 12px;
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
  padding: 20px;
  margin-bottom: 24px;
}
.section h2 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #86efac;
}
.info-grid {
  width: 100%;
  border-collapse: collapse;
}
.info-grid tr {
  border-bottom: 1px solid rgba(55, 65, 81, 0.3);
}
.info-grid tr:last-child {
  border-bottom: none;
}
.info-grid td {
  padding: 12px 0;
  vertical-align: middle;
}
.info-label {
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
  width: 45%;
}
.info-value {
  color: #f3f4f6;
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  width: 55%;
}
.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.3);
}
.txid-box {
  background: rgba(17, 24, 39, 0.5);
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 11px;
  color: #93c5fd;
  word-break: break-all;
  margin-top: 8px;
}
.bank-box {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
}
.bank-box h3 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #93c5fd;
}
.footer {
  padding: 24px;
  text-align: center;
  border-top: 1px solid rgba(34, 197, 94, 0.2);
}
.footer p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}
.highlight {
  color: #86efac;
  font-weight: 600;
}
</style>
</head>

<body>
<div class="container">
  <div class="header">
    <h1>Transaction Confirmed ✅</h1>
  </div>

  <div class="content">
    <p class="greeting">Dear <strong>${transactionData.userFullname}</strong>,</p>
    <p class="message">
      Your ${transactionData.type} transaction has been
      <span class="highlight">successfully confirmed</span>.
    </p>

    <div class="section">
      <h2>Transaction Summary</h2>
      <table class="info-grid">
        <tr>
          <td class="info-label">Transaction Type</td>
          <td class="info-value">${transactionData.type.toUpperCase()}</td>
        </tr>
        <tr>
          <td class="info-label">Cryptocurrency</td>
          <td class="info-value">${transactionData.coin.toUpperCase()}</td>
        </tr>
        <tr>
          <td class="info-label">USD Amount</td>
          <td class="info-value">$${transactionData.amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td class="info-label">Coin Amount</td>
          <td class="info-value">${transactionData.coinAmount}</td>
        </tr>
        <tr>
          <td class="info-label">Status</td>
          <td class="info-value"><span class="status-badge">CONFIRMED</span></td>
        </tr>
      </table>

      <div style="margin-top:16px;">
        <div class="info-label">Transaction ID</div>
        <div class="txid-box">${transactionData.txid}</div>
      </div>
    </div>

    ${
      transactionData.type === "sell"
        ? `
      <div class="bank-box">
        <h3>Payment Destination</h3>
        <table class="info-grid">
          <tr>
            <td class="info-label">Bank Name</td>
            <td class="info-value">${transactionData.bankName}</td>
          </tr>
          <tr>
            <td class="info-label">Account Name</td>
            <td class="info-value">${transactionData.accountName}</td>
          </tr>
          <tr>
            <td class="info-label">Account Number</td>
            <td class="info-value" style="font-family: monospace;">${transactionData.accountNumber}</td>
          </tr>
        </table>
      </div>
    `
        : ""
    }

    <p class="message" style="margin-top:24px;">
      ${
        transactionData.type === "sell"
          ? "Your funds will be sent to your bank shortly."
          : "Your crypto is now available in your wallet."
      }
    </p>
  </div>

  <div class="footer">
    <p><strong>Oceanic Charts</strong></p>
    <p>${new Date().toLocaleString()}</p>
  </div>
</div>
</body>
</html>
`;
}
 else {
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