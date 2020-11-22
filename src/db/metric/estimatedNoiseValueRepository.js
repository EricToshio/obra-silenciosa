const getSensorsMeasurements = async (client, timestamp = null) => {
  const db = client.db('metric');
  const sensorPositionsCollection = db.collection('message');
  const filter = timestamp ? { timestamp } : {};
  return sensorPositionsCollection.find().toArray();
};

module.exports = {
  getSensorsMeasurements,
};
