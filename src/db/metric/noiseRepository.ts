import { InsertOneWriteOpResult, MongoClient } from 'mongodb';

export type SensorPosition = {
  _id: string;
  lat: number;
  lon: number;
}

const findSensorPositions = async (client: MongoClient): Promise<SensorPosition[]> => {
  const db = client.db('metric');
  const sensorPositionsCollection = db.collection('sensorPositions');
  return sensorPositionsCollection.find().toArray();
};

const insertSensorPosition = async (client: MongoClient, position: Omit<SensorPosition, '_id'>): Promise<InsertOneWriteOpResult<any>> => {
  const db = client.db('metric');
  const sensorPositionsCollection = db.collection('sensorPositions');
  return sensorPositionsCollection.insertOne(position);
};

export {
  findSensorPositions,
  insertSensorPosition,
};
