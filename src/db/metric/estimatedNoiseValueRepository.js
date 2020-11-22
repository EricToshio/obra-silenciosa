const getSensorsMeasurements = async (client) => {
  const db = client.db('metric');
  const sensorPositionsCollection = db.collection('message');
  const lastMeasure = await sensorPositionsCollection
    .find().sort({ timestamp: -1 })
    .limit(1)
    .toArray();
  return sensorPositionsCollection.find({ timestamp: lastMeasure[0].timestamp }).toArray();
};

module.exports = {
  getSensorsMeasurements,
};
