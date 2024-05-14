const express = require('express');

const authController = require('./auth/auth.controller');
const roleController = require('./controllers/role.controller');
const teamController = require('./controllers/team.controller');
const userController = require('./controllers/user.controller');
const categoryController = require('./controllers/category.controller');
const gameController = require('./controllers/game.controller');
const siteController = require('./controllers/site.controller');
const jamController = require('./controllers/jam.controller');
const themeController = require('./controllers/theme.controller');
const stageController = require('./controllers/stage.controller');
const notificationController = require('./controllers/notification.controller');
const multerFacade = require('./utils/multer.facade');

const mainRouter = express.Router();

// Auth
mainRouter.post("/auth/register", multerFacade.handleImageUpload, authController.register);
mainRouter.post("/auth/login", authController.login);
mainRouter.post("/auth/forgotPassword", authController.forgotPassword);
mainRouter.post("/auth/resetPassword", authController.resetPassword);
mainRouter.get('/auth/verifyToken', authController.authenticateToken, (req, res) => res.send({valid: true}));

// Role
mainRouter.post("/role", roleController.createRole);
mainRouter.get("/role/:role", roleController.getRole);
mainRouter.get("/role", roleController.getRoles);

// Role assignment
mainRouter.patch("/role/set", roleController.setRoles);

// User
mainRouter.get("/user/query/:query", userController.getUsersFromPrefix);
mainRouter.get("/me", authController.authenticateToken, userController.getMe);
mainRouter.get("/user/:username", userController.getUserByUsername);
mainRouter.get("/user/id/:id", userController.getUser);
mainRouter.get("/user", userController.getUsers);
mainRouter.put("/user/:username", userController.updateUser);
mainRouter.post("/user/password/update", userController.updatePassword);

// Teams
mainRouter.post("/team", teamController.createTeam);
mainRouter.patch("/team/add", teamController.addMember);
mainRouter.patch("/team/kick", teamController.kickMember);
mainRouter.put("/team/:id", teamController.changeTeamName);
mainRouter.get("/team/user/:username", teamController.getUserTeam);
mainRouter.get("/team/:id", teamController.getTeam);

// Notifications
mainRouter.post("/notification", notificationController.createNotification);
mainRouter.get("/notification/:username", notificationController.getNotifications);
mainRouter.delete("/notification", notificationController.clearNotifications);
mainRouter.delete("/notification/:id", notificationController.deleteNotification);

// Site
mainRouter.post("/site", multerFacade.handleImageUpload, siteController.createSite);
mainRouter.delete("/site/:id", siteController.removeSite);
mainRouter.put("/site/:id", multerFacade.handleImageUpload, siteController.updateSite);
mainRouter.get("/site/country/:country", siteController.getSitesFromCountry);
mainRouter.get("/site/region/:region", siteController.getSitesFromRegion);
mainRouter.get("/site", siteController.getSites);
mainRouter.get("/site/:id", siteController.getSite);

// Jam
mainRouter.post("/jam", jamController.createJam);
mainRouter.put("/jam/:id", jamController.updateJam);
mainRouter.delete("/jam/:id", jamController.removeJam);
mainRouter.get("/jam", jamController.getJams);
mainRouter.get("/jam/:id", jamController.getJam);
mainRouter.patch("/jam/site", jamController.addSiteToJam);
mainRouter.delete("/jam/site", jamController.removeSiteFromJam);
mainRouter.patch("/jam/stage", jamController.addStageToJam);

// Categories
mainRouter.post("/category", multerFacade.handleMultiplePDFUploads, categoryController.createCategory);
mainRouter.get("/category", categoryController.getCategoriesName);
mainRouter.get("/category/:id", categoryController.getCategory);
//mainRouter.put("/category/:id", categoryController.updateCategory);
mainRouter.delete("/category/:id", categoryController.removeCategory);

// Game submission
mainRouter.post("/game", multerFacade.handleImageUpload, gameController.submitGame);
mainRouter.get("/game/:teamID", gameController.getGame);

// Theme
mainRouter.post("/theme", multerFacade.handleMultiplePDFUploads, themeController.createTheme);
//mainRouter.put("/theme/:id", themeController.updateTheme);
mainRouter.delete("/theme/:id", themeController.removeTheme);
mainRouter.get("/theme", themeController.getThemesName);
mainRouter.get("/theme/:id", themeController.getTheme);

// Stage
mainRouter.post("/stage", stageController.createStage);
mainRouter.put("/stage/:id", stageController.updateStage);
mainRouter.delete("/stage/:id", stageController.removeStage);
mainRouter.get("/stage", stageController.getStages);
mainRouter.get("/stage/:id", stageController.getStage);

// Photo
mainRouter.post("/photo", multerFacade.handleImageUpload);
mainRouter.put("/photo/:id", multerFacade.handleImageUpload);

// File
mainRouter.post("/file", multerFacade.handlePDFUpload);

mainRouter.post("/files", multerFacade.handleMultiplePDFUploads);

module.exports = mainRouter;