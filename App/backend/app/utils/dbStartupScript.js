const roleController = require('../controllers/role.controller');
const authController = require('../auth/auth.controller');
const UserModel = require('../models/user.model');
const admin = process.env.INITIAL_ORGANIZER;

async function setup() {
    await roleController.createRolesIfNotExist();
    user = JSON.parse(admin);
    if (await UserModel.findOne({ username: user.username })) {
        console.log("Admin already exists");
        return;
    }
    console.log("Creating admin");
    roles = await roleController.getRoleIDs(["Global Organizer"]);
    user = JSON.parse(admin);
    user.roles = roles;

    await authController.registerNoHTTP(user);
}

module.exports = setup;