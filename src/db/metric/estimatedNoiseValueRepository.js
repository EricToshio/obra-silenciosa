const getSensorsMeasurements = async (client) => {
  const sensorMeasures = client.db('metric').collection('message');
  const lastMeasure = await sensorMeasures
    .find().sort({ timestamp: -1 })
    .limit(1)
    .toArray();
  return sensorMeasures.find({ timestamp: lastMeasure[0].timestamp }).toArray();
};

const getSensorsMeasurementsWithinRange = async (client, rangeInMinutes) => {
  const currentTimestamp = new Date().getTime();
  const rangeInMiliseconds = rangeInMinutes * 60 * 1000;
  const sensorMeasures = client.db('metric').collection('message');
  return sensorMeasures
    .find({ timestamp: { $gt: currentTimestamp - rangeInMiliseconds } }).toArray();
};

module.exports = {
  getSensorsMeasurements,
  getSensorsMeasurementsWithinRange,
};
