import sgMail from '@sendgrid/mail';

// 🎯 将底层发送逻辑封装好，在执行的瞬间读取环境变量
const safeSend = async (message) => {
  // 【关键修复】：在函数内部读取！此时系统肯定已经加载完 .env 了
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;
  const isConfigured = Boolean(sendGridApiKey && fromEmail);

  if (!isConfigured) {
    console.warn('📧 Email skipped: SENDGRID_API_KEY or EMAIL_FROM not configured');
    return { skipped: true };
  }

  // 每次发送前确保 Key 是最新的
  sgMail.setApiKey(sendGridApiKey);

  // 确保邮件包含发件人
  const finalMessage = {
    ...message,
    from: message.from || fromEmail
  };

  try {
    const [providerResponse] = await sgMail.send(finalMessage);
    const messageId = providerResponse?.headers?.['x-message-id'] || providerResponse?.headers?.['X-Message-Id'];
    return {
      sent: true,
      statusCode: providerResponse?.statusCode,
      messageId
    };
  } catch (error) {
    const providerMessage = error?.response?.body?.errors?.[0]?.message;
    const providerCode = error?.code || error?.response?.statusCode;
    console.error('📧 Email send error:', providerCode || '', providerMessage || error.message);
    return {
      sent: false,
      code: providerCode,
      error: providerMessage || error.message
    };
  }
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) return { skipped: true };

  return safeSend({
    to,
    subject,
    text,
    html
  });
};

export const sendQuotationStatusEmail = async ({
  customerEmail,
  customerName,
  providerName,
  quotationId,
  status,
  quotedAmount
}) => {
  const statusText = String(status || '').toUpperCase();
  const amountText = Number.isFinite(Number(quotedAmount))
    ? `RM ${Number(quotedAmount).toFixed(2)}`
    : 'N/A';

  return sendEmail({
    to: customerEmail,
    subject: `Quotation Update - ${statusText}`,
    text: `Hi ${customerName || 'Customer'},\n\nYour quotation ${quotationId || ''} has been updated to ${statusText}.\nProvider: ${providerName || '-'}\nQuoted Amount: ${amountText}\n\nPlease log in to review details.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Quotation Update</h2>
        <p>Hi ${customerName || 'Customer'},</p>
        <p>Your quotation <strong>${quotationId || '-'}</strong> has been updated.</p>
        <ul>
          <li><strong>Status:</strong> ${statusText}</li>
          <li><strong>Provider:</strong> ${providerName || '-'}</li>
          <li><strong>Quoted Amount:</strong> ${amountText}</li>
        </ul>
        <p>Please log in to your account to review full details.</p>
      </div>
    `
  });
};

export const sendOrderCreatedEmails = async ({
  customerEmail,
  customerName,
  providerEmail,
  providerName,
  orderNumber,
  totalAmount,
  eventDate
}) => {
  const amountText = Number(totalAmount || 0).toFixed(2);
  const eventDateText = eventDate ? new Date(eventDate).toLocaleDateString('en-MY') : '-';

  await Promise.all([
    sendEmail({
      to: customerEmail,
      subject: `Order Confirmation - ${orderNumber || 'Order'}`,
      text: `Hi ${customerName || 'Customer'},\n\nYour order ${orderNumber || ''} has been placed successfully.\nEvent Date: ${eventDateText}\nTotal Amount: RM ${amountText}\n\nThank you for your order!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 8px;">Order Confirmation</h2>
          <p>Hi ${customerName || 'Customer'},</p>
          <p>Your order <strong>${orderNumber || '-'}</strong> has been placed successfully.</p>
          <ul>
            <li><strong>Event Date:</strong> ${eventDateText}</li>
            <li><strong>Total Amount:</strong> RM ${amountText}</li>
          </ul>
          <p>Thank you for your order.</p>
        </div>
      `
    }),
    sendEmail({
      to: providerEmail,
      subject: `New Order Received - ${orderNumber || 'Order'}`,
      text: `Hi ${providerName || 'Provider'},\n\nA new order ${orderNumber || ''} has been placed.\nEvent Date: ${eventDateText}\nTotal Amount: RM ${amountText}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 8px;">New Order Received</h2>
          <p>Hi ${providerName || 'Provider'},</p>
          <p>A new order <strong>${orderNumber || '-'}</strong> has been placed.</p>
          <ul>
            <li><strong>Event Date:</strong> ${eventDateText}</li>
            <li><strong>Total Amount:</strong> RM ${amountText}</li>
          </ul>
          <p>Please log in to review and process the order.</p>
        </div>
      `
    })
  ]);
};

export const sendOrderStatusEmail = async ({
  customerEmail,
  customerName,
  orderNumber,
  status,
  paymentStatus,
  deliveryStatus
}) => {
  const details = [
    status ? `Order Status: ${status}` : null,
    paymentStatus ? `Payment Status: ${paymentStatus}` : null,
    deliveryStatus ? `Delivery Status: ${deliveryStatus}` : null
  ]
    .filter(Boolean)
    .join('\n');

  return sendEmail({
    to: customerEmail,
    subject: `Order Update - ${orderNumber || 'Order'}`,
    text: `Hi ${customerName || 'Customer'},\n\nYour order ${orderNumber || ''} has an update:\n${details}\n\nPlease log in for full details.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Order Update</h2>
        <p>Hi ${customerName || 'Customer'},</p>
        <p>Your order <strong>${orderNumber || '-'}</strong> has an update:</p>
        <ul>
          ${status ? `<li><strong>Order Status:</strong> ${status}</li>` : ''}
          ${paymentStatus ? `<li><strong>Payment Status:</strong> ${paymentStatus}</li>` : ''}
          ${deliveryStatus ? `<li><strong>Delivery Status:</strong> ${deliveryStatus}</li>` : ''}
        </ul>
      </div>
    `
  });
};

export const sendPasswordResetEmail = async ({ to, fullName, resetToken }) => {
  // 【关键修复】：也是在函数被调用时读取
  const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
  const resetLink = `${appBaseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  return sendEmail({
    to,
    subject: 'Reset Your Password',
    text: `Hi ${fullName || 'User'},\n\nWe received a request to reset your password.\nUse this link within 30 minutes:\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Password Reset Request</h2>
        <p>Hi ${fullName || 'User'},</p>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 14px; background: #2563eb; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p style="word-break: break-all;"><strong>Reset Link:</strong> ${resetLink}</p>
        <p style="color: #64748b;">This link expires in 30 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `
  });
};

export const emailConfigStatus = () => ({
  // 【关键修复】：实时读取状态，而不是读取加载时的死状态
  configured: Boolean(process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM),
  hasApiKey: Boolean(process.env.SENDGRID_API_KEY),
  hasFromEmail: Boolean(process.env.EMAIL_FROM)
});