const express = require('express');
const authController = require('./auth/auth.controller');
const roleController = require('./controllers/role.controller');
const teamController = require('./controllers/team.controller');
const userController = require('./controllers/user.controller');
const categoryController = require('./controllers/category.controller');
const gameController = require('./controllers/game.controller');
const siteController = require('./controllers/site.controller');
const jamController = require('./controllers/jam.controller');

const mainRouter = express.Router();

// Auth
mainRouter.post("/auth/register", authController.register);
mainRouter.post("/auth/login", authController.login);
mainRouter.post("/forgotPassword", authController.forgotPassword);
mainRouter.post("/resetPassword", authController.resetPassword);
mainRouter.get('/verifyToken', authController.authenticateToken, (req, res) => res.send({valid: true}));

// Role
mainRouter.post("/createRole", roleController.createRole);
mainRouter.post("/setRole", roleController.asignRole);
mainRouter.post("/revokeRole", roleController.unasignRole);

// User
mainRouter.post("/findUser", userController.getUsersFromPrefix);
mainRouter.get("/users/:username", userController.getUserByUsername);
mainRouter.get("/users/id/:id", userController.getUser);
mainRouter.put("/users/:username", userController.updateUser);

// Teams
mainRouter.post("/createTeam", teamController.createTeam);
mainRouter.post("/addMember", teamController.addMember);
mainRouter.post("/kickMember", teamController.kickMember);
mainRouter.put("/changeTeamName", teamController.changeTeamName);
mainRouter.get("/getUserTeam/:username", teamController.getUserTeam);

// Site
mainRouter.post("/createSite", siteController.createSite);
mainRouter.post("/removeSite", siteController.removeSite);
mainRouter.get("/sites/country/:country", siteController.getSitesFromCountry);
mainRouter.get("/sites/region/:region", siteController.getSitesFromRegion);
mainRouter.get("/sites", siteController.getSites);
mainRouter.get("/sites/:id", siteController.getSite);

// Jam
mainRouter.post("/createJam", jamController.createJam);
mainRouter.post("/removeJam", jamController.removeJam);


// Categories
mainRouter.post("/createCategory", categoryController.createCategory);
mainRouter.get("/getCategoriesName", categoryController.getCategoriesName);

// Game submission
mainRouter.post("/submitGame", gameController.submitGame);

module.exports = mainRouter;