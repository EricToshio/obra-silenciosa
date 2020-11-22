const router = require('express').Router();
const bodyParser = require('body-parser');
const estimatedNoiseValuesFixture = require('./fixtures/estimatedNoiseValuesFixture.json');

router.use(bodyParser.json());

router.get('/estimatedNoiseValues', (req, res) => {
  console.log(req.body);
  res.json(estimatedNoiseValuesFixture);
});

module.exports = router;
