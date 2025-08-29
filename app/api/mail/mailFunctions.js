import ForgotPassword from '@/models/ForgotPassword'
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
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?code=${createForgotPassword.code}&email=${encodeURIComponent(email)}" style="color: #00C48C;">Reset Password</a>
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

const RegistrationSuccessful = () => `
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <tr>
      <td style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
        <h1>Registrace dokončena</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; color: #333333;">
        <p>Dobrý den,</p>
        <p>děkujeme za registraci na <strong><a href="https://quickpass.cz" style="display: inline-block; color: #4CAF50; text-decoration: none;">quickpass.cz</a>
        </p></strong>Vaše registrace byla úspěšně dokončena.</p>
        <p>Můžete se nyní přihlásit pomocí svého e-mailu a hesla:</p>
        <p style="text-align: center;">
          <a href="https://quickpass.cz/login" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Přihlásit se</a>
        </p>
        <p>Děkujeme,<br>Tým <strong>quickpass</strong></p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #777777;">
        Pokud jste se neregistrovali, ignorujte tento e-mail.
      </td>
    </tr>
  </table>
`

export const sendMail = async({ subject, to = "info@quickpass.cz", type, data }) => {
  const mailOptions = {
    from: 'QuickPass info@quickpass.cz',
    to: to,
    subject: subject,
    text: 'QuickPass '+ subject,
    html: type === "contact" ? htmlTemplate(data) : type === "forgot" ? htmlForgotEmailTemplate(to) : type === "order" ? htmlOrderEmailTemplate(data) : type === "registration" ? RegistrationSuccessful() : null
  }

  return (await transporter.sendMail(mailOptions))?.rejected.length === 0
}