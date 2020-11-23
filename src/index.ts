require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const dataSimulator = require('./services/simulator');
const noiseLimitCron = require('./cron/noiseLimitCron');

const app = express();

const APP_PORT = process.env.PORT;

app.use(require('./routes/estimatedNoiseValues'));
app.use(require('./routes/sensorPositions'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

MongoClient.connect(process.env.MONGO_URL, { promiseLibrary: Promise }, (err, client) => {
  if (err) {
    console.log(`Failed to connect to the database. ${err.stack}`);
  }
  app.locals.db = client;
  app.listen(APP_PORT, () => {
    console.log(`Server running in http://localhost:${APP_PORT}`);
  });

  dataSimulator.startSimulator(client);
  noiseLimitCron.start(client);
});
