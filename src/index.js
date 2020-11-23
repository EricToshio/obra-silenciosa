require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const dataSimulator = require('./services/simulator');
const noiseLimitCron = require('./cron/noiseLimitCron');

const app = express();

const APP_PORT = process.env.PORT;

app.use(require('./routes/estimatedNoiseValues'));
app.use(require('./routes/sensorPositions'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// app.get('/teste', (req, res) => {
//   // EXEMPLO para obter variavel db
//   const { db } = req.app.locals;
//   res.send('Hello World!');
// });

// Create a MongoDB connection pool and start the application
// after the database connection is ready
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
