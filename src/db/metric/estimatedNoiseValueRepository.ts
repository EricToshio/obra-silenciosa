export type SensorMeasures = {
  _id: string;
  lat: number;
  lon: number;
  value: number;
  noiseSource: string;
  sensorId: string;
  timestamp: number;
}

const getSensorsMeasurements = async (client): Promise<SensorMeasures[]> => {
  const sensorMeasures = client.db('metric').collection('message');
  const lastMeasure = await sensorMeasures
    .find().sort({ timestamp: -1 })
    .limit(1)
    .toArray();
  return sensorMeasures.find({ timestamp: lastMeasure[0].timestamp }).toArray();
};

const getSensorsMeasurementsWithinRange = async (client, rangeInMinutes: number): Promise<SensorMeasures[]> => {
  const currentTimestamp = new Date().getTime();
  const rangeInMiliseconds = rangeInMinutes * 60 * 1000;
  const sensorMeasures = client.db('metric').collection('message');
  return sensorMeasures
    .find({ timestamp: { $gt: currentTimestamp - rangeInMiliseconds } }).toArray();
};

export {
  getSensorsMeasurements,
  getSensorsMeasurementsWithinRange,
};
