const findSensorPositions = async (client) => {
  const db = client.db('metric');
  const sensorPositionsCollection = db.collection('sensorPositions');
  return sensorPositionsCollection.find().toArray();
};

const insertSensorPosition = async (client, position) => {
  const db = client.db('metric');
  const sensorPositionsCollection = db.collection('sensorPositions');
  return sensorPositionsCollection.insertOne(position);
};

module.exports = {
  findSensorPositions,
  insertSensorPosition,
};
