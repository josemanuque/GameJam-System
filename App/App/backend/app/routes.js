const express = require('express');
const authController = require('./auth/auth.controller');

const mainRouter = express.Router();

mainRouter.post("/auth", authController.register);
mainRouter.get("/auth/:email/:password", authController.login);

module.exports = mainRouter;