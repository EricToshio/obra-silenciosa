const router = require('express').Router();
import { findSensorPositions } from '../db/metric/noiseRepository';
import { parsePositionsFromDatabaseToResponsePayload } from '../services/sensorPositionsService';
import express from 'express';

router.get('/sensorPositions', async (req: express.Request, res: express.Response): Promise<void> => {
  const sensorPositions = await findSensorPositions(req.app.locals.db);
  res.json(parsePositionsFromDatabaseToResponsePayload(sensorPositions));
});

export default router;
