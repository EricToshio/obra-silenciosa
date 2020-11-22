const { CronJob } = require('cron');
const { findSensorPositions } = require('../db/metric/noiseRepository');

// Just for refence
const messageTemplate = {
  // number: identifier of sensor
  id: null,
  // number: timestamp that the message arrived
  timestamp: null,
  // number: value obtained in dB
  value: null,
  // number: latitute of sensor position
  lat: null,
  // number: longitute of sensor position
  long: null,
};

// All simulated sensors
// const sensors = [
//   {
//     id: 1,
//     lat: -23.204917,
//     long: -45.875626,
//   },
//   {
//     id: 2,
//     lat: -23.204123,
//     long: -45.874701,
//   },
//   {
//     id: 3,
//     lat: -23.203238,
//     long: -45.876592,
//   },
// ];

// Every 2 minutes "send" a message
const messageCronFrequence = '*/2 * * * *';

const generateRandomDecibel = () => 70 + 50 * Math.random();

const startSimulator = async (dbClient) => {
  const messageCollection = dbClient.db('metric').collection('message');
  console.log('Started sensor simulator');
  const sensorPositions = await findSensorPositions(dbClient);

  new CronJob(messageCronFrequence, () => {
    const currentTimestamp = new Date().getTime();
    const messages = sensorPositions.map(({ _id: sensorId, ...rest }) => ({
      sensorId,
      ...rest,
      timestamp: currentTimestamp,
      value: generateRandomDecibel(),
    }));
    messageCollection.insertMany(messages);
  }, null, true, 'America/Los_Angeles').start();
};

module.exports = { startSimulator };
