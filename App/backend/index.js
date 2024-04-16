const mongoose = require('mongoose');

const express = require('express');
const properties = require('./config/properties');
const db = require('./config/db');
const router = require('./app/routes');
const roleController = require('./app/controllers/role.controller');
const FRONTEND_IP = process.env.FRONTEND_IP;

db();

const app = express();
app.use(express.json());

// Middleware to enable CORS
app.use(function(req, res, next) {
    //console.log("Frontend IP:", FRONTEND_IP);
    //res.header("Access-Control-Allow-Origin", FRONTEND_IP);
    res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
    next();
});
  
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/db-status', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.send(`Database status: ${dbStatus}`);
});

// Creates All Roles In Mongo if not stored
//roleController.createRolesIfNotExist();

app.use('/api/v1', router);
app.listen(properties.PORT, properties.IP, () => {
    console.log(`Server is running on port ${properties.PORT}`);
});