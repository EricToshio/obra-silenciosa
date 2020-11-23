import { getSensorsMeasurements } from '../db/metric/estimatedNoiseValueRepository';
import { getSensorsMeasurementsWithinRange } from '../db/metric/estimatedNoiseValueRepository';
import { calculateDecibel } from '../utils/triangulation';
import { MongoClient } from 'mongodb';
import { SensorPosition } from '../db/metric/noiseRepository';

const solveTriangulationRelation = async (sensorValues, dbClient: MongoClient) => {
  const noiseSourceId = sensorValues[0].noiseSource;
  const noiseSource = await dbClient.db('metric').collection('noiseSource').find({ _id: noiseSourceId }).toArray();
  const defineNoiseValue = (coordinates: SensorPosition) => calculateDecibel(noiseSource[0], coordinates);
  return defineNoiseValue;
};

const estimateNoiseValues = (coordinatesMatrix, noiseValueEstimation): number[][] => {
  const numberOfRows = coordinatesMatrix.latMatrix.length;
  const numberOfCols = coordinatesMatrix.latMatrix[0].length;
  const estimatedValues: number[][] = [];
  for (let i = 0; i < numberOfRows; i += 1) {
    estimatedValues.push([]);
    for (let j = 0; j < numberOfCols; j += 1) {
      const estimatedValue = noiseValueEstimation({
        lat: coordinatesMatrix.latMatrix[i][j],
        lon: coordinatesMatrix.lonMatrix[i][j],
      });
      estimatedValues[i].push(estimatedValue);
    }
  }
  return estimatedValues;
};

const getEstimatedValuesForCoordinates = async (dbClient: MongoClient, coordinatesMatrix = null) => {
  const sensorValues = await getSensorsMeasurements(dbClient);
  const noiseValueEstimation = await solveTriangulationRelation(sensorValues, dbClient);
  const valuesMatrix = estimateNoiseValues(coordinatesMatrix, noiseValueEstimation);
  return {
    noiseMatrix: valuesMatrix,
  };
};

const isThereAnyNoiseValueAboveTheLimit = async (dbClient: MongoClient, timeRange: number): Promise<boolean> => {
  const lastValuesWithinTheInterval = await getSensorsMeasurementsWithinRange(dbClient, timeRange);
  const limitValue = parseInt(process.env.NOISE_LIMIT!, 10);
  return lastValuesWithinTheInterval.some((item) => item.value > limitValue);
};

export { getEstimatedValuesForCoordinates, isThereAnyNoiseValueAboveTheLimit };
