const { CronJob } = require('cron');
const { isThereAnyNoiseValueAboveTheLimit } = require('../services/estimatedNoiseValuesService');
const { sendAlerts } = require('../services/alertTrigger');
import { MongoClient } from 'mongodb';

// Every 5 minutes "send" a message
const CRON_FREQUENCY_IN_MINUTES = 5;

const frequency = `*/${CRON_FREQUENCY_IN_MINUTES} * * * *`;

const start = async (dbClient: MongoClient): Promise<void> => {
  console.log('Started alert job.');

  new CronJob(frequency, async () => {
    const limitHasBeenReached
      = await isThereAnyNoiseValueAboveTheLimit(dbClient, CRON_FREQUENCY_IN_MINUTES);
    if (limitHasBeenReached) {
      sendAlerts();
    }
  }, null, true, 'America/Los_Angeles').start();
};

export { start };
