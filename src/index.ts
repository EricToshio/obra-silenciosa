require('dotenv').config();
import express from 'express';
import { MongoClient } from 'mongodb';
import estimatedNoiseRouter from './routes/estimatedNoiseValues';
import sensorPositionsRouter from './routes/sensorPositions';
import * as dataSimulator from './cron/simulatorCron';
import * as noiseLimitCron from './cron/noiseLimitCron';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

const APP_PORT = process.env.PORT;

app.use(estimatedNoiseRouter);
app.use(sensorPositionsRouter);

app.use(bodyParser.json({ limit: '50MB' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

MongoClient.connect(process.env.MONGO_URL!, { promiseLibrary: Promise }, (err, client: MongoClient) => {
  if (err) {
    console.log(`Failed to connect to the database. ${err.stack}`);
  }
  app.locals.db = client;
  app.listen(APP_PORT, () => {
    console.log(`Server running in http://localhost:${APP_PORT}`);
  });

  dataSimulator.start(client);
  noiseLimitCron.start(client);
});
