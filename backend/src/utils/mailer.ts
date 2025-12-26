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
      service: "gmail", // or your email service
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASSWORD, // your app password
      },
    });

    // Build email content based on transaction type
    const emailContent = `
      <h2>New ${transactionData.type.toUpperCase()} Transaction Created</h2>
      
      <h3>User Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${transactionData.userFullname}</li>
        <li><strong>Email:</strong> ${transactionData.userEmail}</li>
        <li><strong>Country:</strong> ${transactionData.country}</li>
      </ul>

      <h3>Transaction Details:</h3>
      <ul>
        <li><strong>Type:</strong> ${transactionData.type.toUpperCase()}</li>
        <li><strong>Coin:</strong> ${transactionData.coin}</li>
        <li><strong>Amount (USD):</strong> $${transactionData.amount}</li>
        <li><strong>Coin Amount:</strong> ${transactionData.coinAmount} ${transactionData.coin}</li>
        <li><strong>TXID:</strong> ${transactionData.txid}</li>
        ${transactionData.walletAddressSentTo ? `<li><strong>Wallet Address (Sent To):</strong> ${transactionData.walletAddressSentTo}</li>` : ""}
      </ul>

      ${transactionData.type === "buy" ? `
        <h3>Buy Transaction Details:</h3>
        <ul>
          <li><strong>User Wallet Address:</strong> ${transactionData.walletAddressUsed}</li>
        </ul>
      ` : ""}

      ${transactionData.type === "sell" ? `
        <h3>Sell Transaction - Bank Details:</h3>
        <ul>
          <li><strong>Bank Name:</strong> ${transactionData.bankName}</li>
          <li><strong>Account Name:</strong> ${transactionData.accountName}</li>
          <li><strong>Account Number:</strong> ${transactionData.accountNumber}</li>
        </ul>
      ` : ""}

      <p><em>Transaction created at: ${new Date().toLocaleString()}</em></p>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // your admin email
      subject: `New ${transactionData.type.toUpperCase()} Transaction - ${transactionData.coin} - ${transactionData.userFullname}`,
      html: emailContent,
    });

    console.log("Admin email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending admin email:", error);
    // Don't throw error - we don't want email failure to break transaction creation
    return { success: false, error };
  }
};

export const sendUserTransactionStatusEmail = async (
  userEmail: string,
  status: string,
  transactionData: any
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let emailSubject = "";
    let emailBody = "";

    if (status === "confirmed") {
      emailSubject = `Transaction Confirmed - ${transactionData.coin}`;
      emailBody = `
        <h2>Your Transaction Has Been Confirmed! ✅</h2>
        
        <p>Dear ${transactionData.userFullname},</p>
        
        <p>Your ${transactionData.type} transaction has been confirmed and processed successfully.</p>
        
        <h3>Transaction Details:</h3>
        <ul>
          <li><strong>Type:</strong> ${transactionData.type.toUpperCase()}</li>
          <li><strong>Coin:</strong> ${transactionData.coin}</li>
          <li><strong>Amount:</strong> $${transactionData.amount}</li>
          <li><strong>Coin Amount:</strong> ${transactionData.coinAmount} ${transactionData.coin}</li>
          <li><strong>TXID:</strong> ${transactionData.txid}</li>
          <li><strong>Status:</strong> <span style="color: green;">CONFIRMED</span></li>
        </ul>
        
        ${transactionData.type === "sell" ? `
          <p><strong>Payment will be sent to:</strong></p>
          <ul>
            <li>Bank: ${transactionData.bankName}</li>
            <li>Account Name: ${transactionData.accountName}</li>
            <li>Account Number: ${transactionData.accountNumber}</li>
          </ul>
        ` : ""}
        
        <p>Thank you for using our service!</p>
      `;
    } else if (status === "rejected") {
      emailSubject = `Transaction Rejected - ${transactionData.coin}`;
      emailBody = `
        <h2>Transaction Update ❌</h2>
        
        <p>Dear ${transactionData.userFullname},</p>
        
        <p>Unfortunately, your ${transactionData.type} transaction has been rejected.</p>
        
        <h3>Transaction Details:</h3>
        <ul>
          <li><strong>Type:</strong> ${transactionData.type.toUpperCase()}</li>
          <li><strong>Coin:</strong> ${transactionData.coin}</li>
          <li><strong>Amount:</strong> $${transactionData.amount}</li>
          <li><strong>TXID:</strong> ${transactionData.txid}</li>
          <li><strong>Status:</strong> <span style="color: red;">REJECTED</span></li>
        </ul>
        
        <p>If you believe this is an error, please contact our support team.</p>
      `;
    } else {
      return; // Don't send email for other statuses
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: emailSubject,
      html: emailBody,
    });

    console.log(`Status email sent to user: ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending user status email:", error);
    return { success: false, error };
  }
};