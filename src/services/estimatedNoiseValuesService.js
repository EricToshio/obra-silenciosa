const { getSensorsMeasurements } = require('../db/metric/estimatedNoiseValueRepository');
const { getSolution } = require('./wolfram');
const { getSensorsMeasurementsWithinRange } = require('../db/metric/estimatedNoiseValueRepository');

const solveTriangulationRelation = async (sensorValues) => {
  console.log(sensorValues);
  getSolution(sensorValues).then((res) => console.log(res)).catch((err) => console.error(err));
  const mockedResponse = ({ lat, lon }) => 2;
  return Promise.resolve(mockedResponse);
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
  const noiseValueEstimation = await solveTriangulationRelation(sensorValues);
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
