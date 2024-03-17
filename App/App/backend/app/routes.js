const express = require('express');
const authController = require('./auth/auth.controller');
const roleController = require('./controllers/role.controller');

const mainRouter = express.Router();

mainRouter.post("/auth", authController.register);
mainRouter.get("/auth/:email/:password", authController.login);
mainRouter.post("/forgotPassword", authController.forgotPassword);
mainRouter.post("/resetPassword", authController.resetPassword);
mainRouter.post("/createRole", roleController.createRole);

module.exports = mainRouter;