const router = require('express').Router();
const bodyParser = require('body-parser');
const { getEstimatedValuesForCoordinates } = require('../services/estimatedNoiseValuesService');

router.use(bodyParser.json());

router.get('/estimatedNoiseValues', async (req, res) => {
  const coordinatesMatrix = req.body;
  const noiseMatrix = await getEstimatedValuesForCoordinates(req.app.locals.db, coordinatesMatrix);
  res.json(noiseMatrix);
});

module.exports = router;
