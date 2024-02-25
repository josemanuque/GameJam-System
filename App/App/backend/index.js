const mongoose = require('mongoose');

const express = require('express');
const properties = require('./config/properties');
const db = require('./config/db');
const router = require('./app/routes');

db();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/db-status', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.send(`Database status: ${dbStatus}`);
});

app.use(router);
app.listen(properties.PORT, properties.IP, () => {
    console.log(`Server is running on port ${properties.PORT}`);
});