require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const dataSimulator = require('./services/simulator');

const app = express();

const APP_PORT = 3000;

app.use(require('./routes/estimatedNoiseValues'));
app.use(require('./routes/sensorPositions'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  // db = client.db('metric');
  app.locals.db = client;
  app.listen(APP_PORT, () => {
    console.log(`Server running in http://localhost:${APP_PORT}`);
  });

  // Start simulator
  dataSimulator.startSimulator(client);
});
