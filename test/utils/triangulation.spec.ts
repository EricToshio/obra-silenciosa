const { calculateDecibel } = require('../../src/utils/triangulation');

describe('triangulation', () => {
  describe('calculateDecibel', () => {
    it('returns the value expected', () => {
      const sourceValue = { lat: 2, lon: 3, value: 4 };
      const sensorPosition = { lat: 5, lon: 3 };
      const result = calculateDecibel(sourceValue, sensorPosition);
      expect(result).toBe(0.4444444444444444);
    });
  });
});