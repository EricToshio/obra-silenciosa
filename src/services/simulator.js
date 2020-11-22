const CronJob = require('cron').CronJob;

// Just for refence
const messageTemplate = {
    // number: identifier of sensor
    id: null,
    // number: timestamp that the message arrived
    timestamp: null,
    // number: value obtained in dB
    value: null,
    // number: latitute of sensor position
    lat: null,
    // number: longitute of sensor position
    long: null
}

// All simulated sensors
const sensors = [
    {
        id: 1,
        lat: -23.204917,
        long: -45.875626
    },
    {
        id: 2,
        lat: -23.204123,
        long: -45.874701
    },
    {
        id: 3,
        lat: -23.203238,
        long: -45.876592
    },
]

// Every 2 minutes "send" a message
const messageCronFrequence = '*/2 * * * *';

const generateRandomDecibel = () => {
    return 70 + 50 * Math.random();
}

const startSimulator = (db) => {
    const messageCollection = db.db('metric').collection('message');
    console.log(`Started sensor simulator`);

    new CronJob(messageCronFrequence, () => {
        const messages = sensors.map(sensor => ({
            ...sensor,
            timestamp: new Date().getTime(),
            value: generateRandomDecibel()
        }));
        messageCollection.insertMany(messages);
    }, null, true, 'America/Los_Angeles').start();
}

module.exports = { startSimulator };