const nodemailer = require('nodemailer');

const sendEmail = async (user, res) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: 'warzoneosman@gmail.com',
      pass: 'bwijitmwxbjzudwx'
    }
  });

  // 2) Define the email options - Actually send the email
  return await transporter.sendMail({
    from: 'warzoneosman@gmail.com',
    to: user.email,
    subject: user.subject,
    html: user.html
  });
};

module.exports = sendEmail;
