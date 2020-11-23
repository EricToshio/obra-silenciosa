const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendAlertEmail = (email) => {
  sgMail
    .send({
      to: email,
      from: 'contato.obra.silenciosa@gmail.com',
      templateId: 'd-f53798c1d69547d8afd061479e430fae',
    })
    .then(() => {
      console.log('Email sent.');
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { sendAlertEmail };
