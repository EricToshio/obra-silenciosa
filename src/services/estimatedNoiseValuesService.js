const { getSensorsMeasurements } = require('../db/metric/estimatedNoiseValueRepository');

const solveTriangulationRelation = async (sensorValues) => {
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

module.exports = { getEstimatedValuesForCoordinates };
