import ForgotPassword from '@/models/ForgotPassword'
import { getApplicationUrl } from '@/utils'
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'info@quickpass.cz',
      pass: process.env.NODEMAILER_PW,
    },
})

const htmlTemplate = (data) => `
  <div>
    <h1>Kontaktní formulář z <a style='text-decoration: underline' href='https://www.quickpass.cz' target='_blank'>našeho webu<a/></h1>
    <br />
    <table style='border-collapse: collapse; font-size: clamp(18px, 2.8vw, 26px);'>
      <tr style='background-color: #dddddd'>
        <td style='padding: 1rem; border: 1px solid black'><strong>Jméno</strong></td>
        <td style='padding: 1rem; border: 1px solid black'>${data.firstName}</td>
        </tr>
      <tr>
        <td style='padding: 1rem; border: 1px solid black'><strong>Příjmení</strong></td>
        <td style='padding: 1rem; border: 1px solid black'>${data.lastName}</td>
      </tr>
      <tr />
      <tr style='background-color: #dddddd'>
        <td style='padding: 1rem; border: 1px solid black'><strong>Email</strong></td>
        <td style='padding: 1rem; border: 1px solid black'>${data.email}</td>
        </tr>
      <tr>
        <td style='padding: 1rem; border: 1px solid black'><strong>Telefon</strong></td>
        <td style='padding: 1rem; border: 1px solid black'>${data.phone}</td>
      </tr>
      <tr style='background-color: #dddddd'>
        <td style='padding: 1rem; border: 1px solid black'><strong>Téma</strong></td>
        <td style='padding: 1rem; border: 1px solid black'>${data.topic}</td>
      </td>
      <tr>
        <td style='padding: 1rem; border: 1px solid black'><strong>Zpráva</strong></td>
        <td style='padding: 1rem; border: 1px solid black'>${data.message}</td>
      </tr>
    </table>
  </div>
`

const htmlForgotEmailTemplate = (email) => {
  const createForgotPassword = ForgotPassword({ email })
  createForgotPassword.save()

  return `
    <div>
      <h1>Password reset request</h1>
      <p>We received a request to reset your password for your QuickPass account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${getApplicationUrl()}/reset-password?code=${createForgotPassword.code}&email=${encodeURIComponent(email)}" style="color: #00C48C;">Reset Password</a>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `
}

const htmlOrderEmailTemplate = (order) => `
  <div>
    <h1>New Order Received</h1>
    <p><strong>Name:</strong> ${order.delivery?.name || ''} ${order.delivery?.surname || ''}</p>
    <p><strong>Phone:</strong> ${order.delivery?.phone || ''}</p>
    <p><strong>Address:</strong> ${order.delivery?.address || ''}, ${order.delivery?.postalCode || ''}, ${order.delivery?.country || ''}</p>
    <h2>Order Details</h2>
    <ul>
      ${(order.products || []).map(product => `
        <li>
          <strong>${product.variant || 'Product'}</strong>
          ${product.amount ? ` - Quantity: ${product.amount}` : ''}
          ${product.price ? ` - Price: ${product.price} Kč` : ''}
        </li>
      `).join('')}
    </ul>
    <p><strong>Status:</strong> ${order.status || ''}</p>
    <p>Order ID: ${order._id || ''}</p>
    <p>Date: ${order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</p>
  </div>
`

export const sendMail = async({ subject, to = "info@quickpass.cz", type, data }) => {
  const mailOptions = {
    from: 'QuickPass info@quickpass.cz',
    to: to,
    subject: subject,
    text: 'QuickPass '+ subject,
    html: type === "contact" ? htmlTemplate(data) : type === "forgot" ? htmlForgotEmailTemplate(to) : type === "order" ? htmlOrderEmailTemplate(data) : null,
  }

  return (await transporter.sendMail(mailOptions))?.rejected.length === 0
}