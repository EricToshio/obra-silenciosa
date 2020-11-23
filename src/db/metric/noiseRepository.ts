export type SensorPosition = {
  _id: string;
  lat: number;
  lon: number;
}

const findSensorPositions = async (client): Promise<SensorPosition[]> => {
  const db = client.db('metric');
  const sensorPositionsCollection = db.collection('sensorPositions');
  return sensorPositionsCollection.find().toArray();
};

const insertSensorPosition = async (client, position: Omit<SensorPosition, '_id'>) => {
  const db = client.db('metric');
  const sensorPositionsCollection = db.collection('sensorPositions');
  return sensorPositionsCollection.insertOne(position);
};

export {
  findSensorPositions,
  insertSensorPosition,
};
