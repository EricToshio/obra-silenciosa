const router = require('express').Router();
const { findSensorPositions } = require('../db/metric/noiseRepository');
const { parsePositionsFromDatabaseToResponsePayload } = require('../services/sensorPositionsService');

router.get('/sensorPositions', async (req, res) => {
  const sensorPositions = await findSensorPositions(req.app.locals.db);
  res.json(parsePositionsFromDatabaseToResponsePayload(sensorPositions));
});

module.exports = router;
