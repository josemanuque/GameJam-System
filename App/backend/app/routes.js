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
mainRouter.post("/auth/forgotPassword", authController.forgotPassword);
mainRouter.post("/auth/resetPassword", authController.resetPassword);
mainRouter.get('/auth/verifyToken', authController.authenticateToken, (req, res) => res.send({valid: true}));

// Role
mainRouter.post("/role", roleController.createRole);
mainRouter.get("/role/:role", roleController.getRole);
mainRouter.get("/role", roleController.getRoles);

// Role assignment
mainRouter.patch("/role/set", roleController.assignRole);
mainRouter.patch("/role/revoke", roleController.unasignRole);

// User
mainRouter.get("/user/query/:query", userController.getUsersFromPrefix);
mainRouter.get("/user/:username", userController.getUserByUsername);
mainRouter.get("/user/id/:id", userController.getUser);
mainRouter.put("/user/:username", userController.updateUser);

// Teams
mainRouter.post("/team", teamController.createTeam);
mainRouter.patch("/team/add", teamController.addMember);
mainRouter.patch("/team/kick", teamController.kickMember);
mainRouter.put("/team/:id", teamController.changeTeamName);
mainRouter.get("/team/user/:username", teamController.getUserTeam);
mainRouter.get("/team/:id", teamController.getTeam);

// Site
mainRouter.post("/site", siteController.createSite);
mainRouter.delete("/site/:id", siteController.removeSite);
mainRouter.get("/site/country/:country", siteController.getSitesFromCountry);
mainRouter.get("/site/region/:region", siteController.getSitesFromRegion);
mainRouter.get("/site", siteController.getSites);
mainRouter.get("/site/:id", siteController.getSite);

// Jam
mainRouter.post("/jam", jamController.createJam);
mainRouter.delete("/jam/:id", jamController.removeJam);
mainRouter.get("/jam", jamController.getJams);
mainRouter.get("/jam/:id", jamController.getJam);
mainRouter.patch("/jam/site", jamController.addSiteToJam);
mainRouter.delete("/jam/site", jamController.removeSiteFromJam);

// Categories
mainRouter.post("/category", categoryController.createCategory);
mainRouter.get("/category", categoryController.getCategoriesName);
mainRouter.get("/category/:id", categoryController.getCategory);
mainRouter.put("/category/:id", categoryController.updateCategory);

// Game submission
mainRouter.post("/game", gameController.submitGame);

module.exports = mainRouter;