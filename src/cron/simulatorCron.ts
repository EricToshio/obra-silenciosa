const { CronJob } = require('cron');
import { findSensorPositions, SensorPosition } from '../db/metric/noiseRepository';
const { calculateDecibel } = require('../utils/triangulation');
import { MongoClient } from 'mongodb';

// Every 2 minutes "send" a message
const messageCronFrequence = '*/2 * * * *';

const generateRandomDecibel = (): number => 70 + 50 * Math.random();

const generateSoundSource = (sensorPositions: SensorPosition[]): { lat: number; lon: number; value: number } => {
  const lat = (sensorPositions.reduce((prev, actual) => prev + actual.lat, 0) / 3)
    + 0.001 * (Math.random() * 2 - 1);
  const lon = sensorPositions.reduce((prev, actual) => prev + actual.lon, 0) / 3
    + 0.001 * (Math.random() * 2 - 1);
  const intensity = generateRandomDecibel();

  return {
    lat,
    lon,
    value: intensity,
  };
};

const start = async (dbClient: MongoClient): Promise<void> => {
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

export { start };
