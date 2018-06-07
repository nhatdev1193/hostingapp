const nodemailer = require('nodemailer');
const listReceiver = require('../DB/user.json');

exports.sendMail = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });
  const mailOptions = {
    from: process.env.MAIL_USER, // sender address
    to: listReceiver.toString(), // list of receivers
    subject: 'Link app', // Subject line
    html: req.body.html // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err) {
      console.log(err);
      res.status(500)
    }
    else
      res.status(200)
  });
}
