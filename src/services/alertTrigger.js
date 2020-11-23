const { sendAlertEmail } = require('./email');

const AlertsType = {
  EMAIL: 'EMAIL',
};

const alertDestinatary = [
  {
    name: 'Usuario Teste',
    alertsMedium: [
      {
        alertType: AlertsType.EMAIL,
        info: process.env.USER_EMAIL,
      },
    ],
  },
];

const alertsSendersAvailable = {
  [AlertsType.EMAIL]: sendAlertEmail,
};

const sendAlerts = (users = alertDestinatary) => {
  users.forEach((user) => {
    user.alertsMedium.forEach((medium) => {
      const alertSender = alertsSendersAvailable[medium.alertType];
      if (alertSender) {
        alertSender(medium.info);
      }
    });
  });
};

module.exports = { sendAlerts };
