require('dotenv').config()
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()

const APP_PORT = 3000


app.get('/', (req, res) => {
    // EXEMPLO para obter variavel db
    const db = req.app.locals.db;
    res.send('Hello World!')
})

// Create a MongoDB connection pool and start the application
// after the database connection is ready
MongoClient.connect(process.env.MONGO_URL, { promiseLibrary: Promise }, (err, db) => {
    if (err) {
        console.log(`Failed to connect to the database. ${err.stack}`);
    }
    app.locals.db = db;
    app.listen(APP_PORT, () => {
        console.log(`Server running in http://localhost:${APP_PORT}`);
    });
});