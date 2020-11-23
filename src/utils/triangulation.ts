import { SensorMeasures } from '../db/metric/estimatedNoiseValueRepository';
import { SensorPosition } from '../db/metric/noiseRepository';

const calculateDecibel = (soundSource: SensorMeasures, sensor: SensorPosition): number => {
  const dx = (soundSource.lat - sensor.lat) ** 2;
  const dy = (soundSource.lon - sensor.lon) ** 2;
  return soundSource.value / (dx + dy);
};

export = { calculateDecibel };
