const router = require('express').Router();
const estimatedNoiseValuesFixture = require('./fixtures/estimatedNoiseValuesFixture.json');

router.get('/estimatedNoiseValues', (req, res) => {
  res.json(estimatedNoiseValuesFixture);
});

module.exports = router;
