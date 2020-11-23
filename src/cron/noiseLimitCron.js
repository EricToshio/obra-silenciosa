const { CronJob } = require('cron');
const { isThereAnyNoiseValueAboveTheLimit } = require('../services/estimatedNoiseValuesService');
const { sendAlerts } = require('../services/alertTrigger');

const CRON_FREQUENCY_IN_MINUTES = 5;

// Every 2 minutes "send" a message
const frequency = `*/${CRON_FREQUENCY_IN_MINUTES} * * * *`;

const start = async (dbClient) => {
  console.log('Started alert job.');

  new CronJob(frequency, async () => {
    const limitHasBeenReached
      = await isThereAnyNoiseValueAboveTheLimit(dbClient, CRON_FREQUENCY_IN_MINUTES);
    if (limitHasBeenReached) {
      sendAlerts();
    }
  }, null, true, 'America/Los_Angeles').start();
};

module.exports = { start };
