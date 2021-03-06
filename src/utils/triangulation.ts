import { SensorMeasures } from '../db/metric/estimatedNoiseValueRepository';
import { SensorPosition } from '../db/metric/noiseRepository';

const getDistance = (pontALat: number, pointALon: number, pointBLat: number, pointBLon: number): number => {
  const R = 6371000; // Radius of the Earth in miles
  const rlat1 = pontALat * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = pointBLat * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflon = (pointBLon - pointALon) * (Math.PI / 180); // Radian difference (longitudes)

  return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2)
    * Math.sin(difflat / 2) + Math.cos(rlat1)
    * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
};

const calculateDecibel = (soundSource: SensorMeasures, sensor: SensorPosition): number => {
  const dist = getDistance(soundSource.lat, soundSource.lon, sensor.lat, sensor.lon);
  return soundSource.value * (Math.exp(-dist / 50) / 120);
};

export { calculateDecibel };
