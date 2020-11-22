const router = require('express').Router();
const sensorPositionsFixture = require('./fixtures/sensorPositionsFixture.json');
const { insertSensorPosition, findSensorPositions } = require('../db/metric/noiseRepository');
const { parsePositionsFromDatabaseToResponsePayload } = require('../services/sensorPositionsService');

router.get('/sensorPositions', async (req, res) => {
  const sensorPositions = await findSensorPositions(req.app.locals.db);
  res.json(parsePositionsFromDatabaseToResponsePayload(sensorPositions));
});

router.get('/sensorPositions/value', async (req, res) => {
  // const client = req.app.locals.db;
  // await insertSensorPosition(client, { lat: -23.203238, lon: -45.876592 });
  res.json(sensorPositionsFixture);
});

module.exports = router;
