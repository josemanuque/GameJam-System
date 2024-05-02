const express = require('express');
const { v4: uuidv4 } = require('uuid');
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

const mainRouter = express.Router();
const multer = require('multer');

//File and image management
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueID = uuidv4();
        const originalExtension = file.originalname.split('.').pop();
        const newFilename = `${uniqueID}.${originalExtension}`;
        cb(null, newFilename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/png',
        'application/pdf'
    ];
    if (!allowedMimeTypes.includes(file.mimetype) || !file.originalname.endsWith('.png') && !file.originalname.endsWith('.pdf')){
        cb(new Error('Invalid file format. Only .png and .pdf files are allowed.'), false);
    } else {
        cb(null, true)
    }
}
const upload = multer({storage, fileFilter});

// Auth
mainRouter.post("/auth/register", upload.single('photo'), authController.register);
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
mainRouter.post("/user/updatePassword", userController.updatePassword);

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
mainRouter.post("/site", upload.single('file'), siteController.createSite);
mainRouter.delete("/site/:id", siteController.removeSite);
mainRouter.put("/site/:id", upload.single('file'), siteController.updateSite);
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
mainRouter.post("/category", categoryController.createCategory);
mainRouter.get("/category", categoryController.getCategoriesName);
mainRouter.get("/category/:id", categoryController.getCategory);
//mainRouter.put("/category/:id", categoryController.updateCategory);
mainRouter.delete("/category/:id", categoryController.removeCategory);

// Game submission
mainRouter.post("/game", gameController.submitGame);

// Theme
mainRouter.post("/theme", upload.fields([{name: 'manualEng'}, {name:'manualSpa'}, {name:'manualPort'}]), themeController.createTheme);
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

module.exports = mainRouter;