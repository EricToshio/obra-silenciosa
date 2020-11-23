const { getSensorsMeasurements } = require('../db/metric/estimatedNoiseValueRepository');
const { getSensorsMeasurementsWithinRange } = require('../db/metric/estimatedNoiseValueRepository');
const { calculateDecibel } = require('../utils/triangulation');

const solveTriangulationRelation = async (sensorValues, dbClient) => {
  const noiseSourceId = sensorValues[0].noiseSource;
  const noiseSource = await dbClient.db('metric').collection('noiseSource').find({ _id: noiseSourceId }).toArray();
  const defineNoiseValue = (coordinates) => calculateDecibel(noiseSource[0], coordinates);
  return defineNoiseValue;
};

const estimateNoiseValues = (coordinatesMatrix, noiseValueEstimation) => {
  const estimatedValues = [];
  for (let i = 0; i < 2; i += 1) {
    estimatedValues.push([]);
    for (let j = 0; j < 2; j += 1) {
      const estimatedValue = noiseValueEstimation({
        lat: coordinatesMatrix.latMatrix[i][j],
        lon: coordinatesMatrix.latMatrix[i][j],
      });
      estimatedValues[i].push(estimatedValue);
    }
  }
  return estimatedValues;
};

const getEstimatedValuesForCoordinates = async (dbClient, coordinatesMatrix = null) => {
  const sensorValues = await getSensorsMeasurements(dbClient);
  const noiseValueEstimation = await solveTriangulationRelation(sensorValues, dbClient);
  const valuesMatrix = estimateNoiseValues(coordinatesMatrix, noiseValueEstimation);
  return {
    noiseMatrix: valuesMatrix,
  };
};

const isThereAnyNoiseValueAboveTheLimit = async (dbClient, timeRange) => {
  const lastValuesWithinTheInterval = await getSensorsMeasurementsWithinRange(dbClient, timeRange);
  const limitValue = parseInt(process.env.NOISE_LIMIT, 10);
  return lastValuesWithinTheInterval.some((item) => item.value > limitValue);
};

module.exports = { getEstimatedValuesForCoordinates, isThereAnyNoiseValueAboveTheLimit };
