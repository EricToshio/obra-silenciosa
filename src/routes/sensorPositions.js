const router = require('express').Router();
const sensorPositionsFixture = require('./sensorPositionsFixture.json');

router.get('/sensorPositions', async (req, res) => {
  res.json(sensorPositionsFixture);
});

module.exports = router;
