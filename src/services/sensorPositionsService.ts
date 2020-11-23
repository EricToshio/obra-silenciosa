import { SensorPosition } from '../db/metric/noiseRepository';

type Response = {
  sensorsLatList: number[];
  sensorLonList: number[];
}

const parsePositionsFromDatabaseToResponsePayload = (positions: SensorPosition[]): Response => {
  const response: Response = {
    sensorsLatList: [],
    sensorLonList: [],
  };
  positions.forEach((position: SensorPosition) => {
    response.sensorsLatList.push(position.lat);
    response.sensorLonList.push(position.lon);
  });
  return response;
};

export { parsePositionsFromDatabaseToResponsePayload };
