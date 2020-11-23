const router = require('express').Router();
import bodyParser from 'body-parser';
import express from 'express';
import { getEstimatedValuesForCoordinates } from '../services/estimatedNoiseValuesService';

router.use(bodyParser.json({ limit: '50MB' }));

router.post('/estimatedNoiseValues', async (req: express.Request, res: express.Response): Promise<void> => {
  const coordinatesMatrix = req.body;
  const noiseMatrix = await getEstimatedValuesForCoordinates(req.app.locals.db, coordinatesMatrix);
  res.json(noiseMatrix);
});

export default router;
