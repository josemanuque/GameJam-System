const express = require('express');
const authController = require('./auth/auth.controller');

const mainRouter = express.Router();

mainRouter.post("/auth", authController.register);
mainRouter.get("/auth", authController.login);

module.exports = mainRouter;