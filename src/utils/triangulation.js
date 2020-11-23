const calculateDecibel = (soundSource, sensor) => {
  const dx = (soundSource.lat - sensor.lat) ** 2;
  const dy = (soundSource.lon - sensor.lon) ** 2;
  return soundSource.value / (dx + dy);
};

module.exports = { calculateDecibel };
