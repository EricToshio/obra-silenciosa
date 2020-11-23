const getDistance = (pontALat, pointALon, pointBLat, pointBLon) => {
  const R = 6371000; // Radius of the Earth in miles
  const rlat1 = pontALat * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = pointBLat * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflon = (pointBLon - pointALon) * (Math.PI / 180); // Radian difference (longitudes)

  return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2)
    * Math.sin(difflat / 2) + Math.cos(rlat1)
    * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
};

const calculateDecibel = (soundSource, sensor) => {
  const dist = getDistance(soundSource.lat, soundSource.lon, sensor.lat, sensor.lon);
  return soundSource.value / dist;
};

module.exports = { calculateDecibel };
