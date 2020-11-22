const parsePositionsFromDatabaseToResponsePayload = (positions) => {
  const response = {
    sensorsLatList: [],
    sensorLonList: [],
  };
  positions.forEach((position) => {
    response.sensorsLatList.push(position.lat);
    response.sensorLonList.push(position.lon);
  });
  return response;
};

module.exports = { parsePositionsFromDatabaseToResponsePayload };
