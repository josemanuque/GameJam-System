const express = require('express');
const authController = require('./auth/auth.controller');
const roleController = require('./controllers/role.controller');
const teamController = require('./controllers/team.controller');
const userController = require('./controllers/user.controller');

const mainRouter = express.Router();

// Auth routes
mainRouter.post("/auth/register", authController.register);
mainRouter.post("/auth/login", authController.login);
mainRouter.post("/forgotPassword", authController.forgotPassword);
mainRouter.post("/resetPassword", authController.resetPassword);
mainRouter.get('/verifyToken', authController.authenticateToken, (req, res) => res.send({valid: true}));

mainRouter.post("/createRole", roleController.createRole);
mainRouter.post("/findUser", userController.getUsersFromPrefix);


mainRouter.post("/createTeam", teamController.createTeam);
mainRouter.post("/joinTeam", teamController.joinTeam);

module.exports = mainRouter;