import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 30000, 
    greetingTimeout: 30000, 
    socketTimeout: 30000 
  });

  const mailOption = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  await transporter.sendMail(mailOption);
};

export default sendEmail;