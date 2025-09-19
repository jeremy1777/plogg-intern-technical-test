const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendActivationEmail = async (to, token) => {
  const activationLink = `http://localhost:5173/activate/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Confirm Your Email Address for Synode',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
          .header { font-size: 12px; color: #888888; padding-bottom: 20px; text-align: center; }
          .logo { margin-bottom: 30px; }
          .heading { font-size: 28px; font-weight: bold; color: #333333; margin-bottom: 20px; }
          .subtext { font-size: 16px; color: #555555; margin-bottom: 30px; line-height: 1.5; }
          .button { display: inline-block; background-color: #34c6ba; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; }
          .closing { margin-top: 30px; font-size: 16px; color: #555555; text-align: left; }
          .footer { margin-top: 40px; border-top: 1px solid #dddddd; padding-top: 20px; }
          .social-icons a { margin: 0 10px; }
          .social-icons img { width: 24px; height: 24px; }
          .footer-links { margin-top: 15px; font-size: 12px; color: #888888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            Email not displaying correctly? <a href="${activationLink}" style="color: #3498db;">View it in your browser</a>.
          </div>
          <div class="logo">
            <img src="https://i.imgur.com/your-logo-image-url.png" alt="Synode Logo" style="width: 150px;">
          </div>
          <h1 class="heading">You're almost there! Just confirm your email</h1>
          <p class="subtext">
            You've successfully created a Synode account. To activate it, please click below to verify your email address.
          </p>
          <a href="${activationLink}" class="button">Activate Your Account</a>
          <div class="closing">
            Cheers,<br>The Synode team
          </div>
          <div class="footer">
            <div class="social-icons">
              <a href="#"><img src="https://i.imgur.com/facebook-icon-url.png" alt="Facebook"></a>
              <a href="#"><img src="https://i.imgur.com/twitter-icon-url.png" alt="X"></a>
              <a href="#"><img src="https://i.imgur.com/instagram-icon-url.png" alt="Instagram"></a>
              <a href="#"><img src="https://i.imgur.com/pinterest-icon-url.png" alt="Pinterest"></a>
              <a href="#"><img src="https://i.imgur.com/linkedin-icon-url.png" alt="LinkedIn"></a>
            </div>
            <div class="footer-links">
              <a href="#" style="color: #888888;">Unsubscribe</a> - <a href="#" style="color: #888888;">Unsubscribe Preferences</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Activation email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error('Could not send activation email.');
  }
};

module.exports = {
  sendActivationEmail,
};