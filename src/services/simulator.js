const { CronJob } = require('cron');
const { findSensorPositions } = require('../db/metric/noiseRepository');

// Just for refence
// eslint-disable-next-line no-unused-vars
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

const calculateDecibel = (soundSource, sensor) => {
  const dx = (soundSource.lat - sensor.lat) ** 2;
  const dy = (soundSource.long - sensor.long) ** 2;
  return soundSource.value / (dx + dy);
};

const generateSoundSource = (sensorPositions) => {
  const lat = (sensorPositions.reduce((prev, actual) => prev + actual.lat, 0) / 3)
    + 0.001 * (Math.random() * 2 - 1);
  const long = sensorPositions.reduce((prev, actual) => prev + actual.long, 0) / 3
    + 0.001 * (Math.random() * 2 - 1);
  const intensity = generateRandomDecibel();

  return {
    lat,
    long,
    value: intensity,
  };
};

const startSimulator = async (dbClient) => {
  const messageCollection = dbClient.db('metric').collection('message');
  const noiseSourceCollection = dbClient.db('metric').collection('noiseSource');
  console.log('Started sensor simulator');
  const sensorPositions = await findSensorPositions(dbClient);

  new CronJob(messageCronFrequence, async () => {
    const currentTimestamp = new Date().getTime();
    const soundSource = generateSoundSource(sensorPositions);
    const { insertedId } = await noiseSourceCollection.insertOne({
      ...soundSource,
      timestamp: currentTimestamp,
    });
    const messages = sensorPositions.map(({ _id: sensorId, ...rest }) => ({
      sensorId,
      ...rest,
      noiseSource: insertedId,
      timestamp: currentTimestamp,
      value: calculateDecibel(soundSource, rest),
    }));
    messageCollection.insertMany(messages);
  }, null, true, 'America/Los_Angeles').start();
};

module.exports = { startSimulator };
