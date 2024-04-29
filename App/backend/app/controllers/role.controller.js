const RoleModel = require('../models/role.model');
const UserModel = require('../models/user.model');

/**
 * Creates a new Role in DB. 
 * Shouldn't be used once basic roles are created in index.js 
 * @param {*} req 
 * @param {*} res 
 */
exports.createRole = async (req, res) => {
    try {
        const roleReq = {
            name: req.body.name,
            description: req.body.description
        };
        const role = new RoleModel(roleReq);
        await role.save();
        res.send({ message: "Role created" });
    } catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Role already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

/**
 * Assigns role to an existing user
 * @param {*} req -> Must receive username and roleName 
 * (Local Organizer, Global Organizer, Jammer, Mentor, Judge)
 * @param {*} res 
 * @returns Confirmation message if successful
 */
exports.setRoles = async (req, res) => {
    try {
        const username = req.body.username;
        const roleIDs = req.body.roles;

        const user = await UserModel.findOne({ username });

        if (!user){
            return res.status(409).send( { message: "User not found"} );
        }
        
        const rolePromises = roleIDs.map(async (roleID) => {
            const foundRole = await RoleModel.findById(roleID);
            if (!foundRole){
                return res.status(409).send( { message: "Role not found"} );
            }
            return foundRole;
        });
        
        const roles = await Promise.all(rolePromises);

        user.roles = roleIDs;
        await user.save();

        res.send({ message: `Roles ${roleIDs} successfully assigned to ${username}`});
    } catch (err){
        console.log(err);
        return res.status(500).send({ message: "Server error"} );
    }
    
};



/**
 * Assigns role to an existing user
 * @param {*} req -> Must receive username and roleName 
 * (localOrganizer, globalOrganizer, jammer, mentor, judge)
 * @param {*} res 
 * @returns Confirmation message if successful
 */
exports.unasignRole = async (req, res) => {
    try {
        const username = req.body.username;
        const roleName = req.body.role;

        const user = await UserModel.findOne({ username });
        const role = await RoleModel.findOne({ name: roleName });
        
        if (!user){
            return res.status(409).send( { message: "User not found"} );
        }
        if (!role){
            return res.status(409).send( { message: "Role not found"} );
        }

        user.roles = user.roles.filter(roleID => {
            if (!roleID.equals(role._id)){
                return roleID;
            }
        });
        console.log(user.roles);
        user.save();

        return res.send({ message: `Role ${roleName} successfully revoked from user ${username}`});
    } catch (err){
        return res.status(500).send({ message: "Server error"} );
    }
    
};


/**
 * Creates basic 5 roles if they didn't exist previously. Gets called from index.js initially.
 * DEVELOPMENT_ONLY: Not really needed in prod.
 * @param {*} req 
 * @param {*} res 
 */
exports.createRolesIfNotExist = async (req, res) => {
    const roles = ['Jammer', 'Local Organizer', 'Global Organizer', 'Judge', 'Mentor'];
    for (const roleName of roles) {
        const existingRole = await RoleModel.findOne({ name: roleName });
        if (!existingRole) {
            await RoleModel.create({ name: roleName });
            console.log(`Role "${roleName}" created`);
        }
    }
};

/**
 * Gets role ObjectIds of an array of roleNames provided
 * @param {*} roleNames 
 * @returns Role ObjectId
 */
exports.getRoleIDs = async (roleNames) => {
    const roleIDs = await Promise.all(roleNames.map(
        async roleName => {
            const role = await RoleModel.findOne({ name: roleName });
            if(!role){
                return null;
            }
            return role._id;
        } 
    ));
    return roleIDs.filter(roleID => roleID !== null);
};

/**
 * Gets Role Names of an array of Role Object Ids provided
 * @param {*} roleIDs 
 * @returns roleName
 */
exports.getRoleNamesFromIDs = async (roleIDs) => {
    const roleNames = await Promise.all(roleIDs.map(
        async roleID => {
            const role = await RoleModel.findById(roleID);
            if(!role){
                return null;
            }
            return role.name;
        } 
    ));
    return roleNames.filter(roleName => roleName !== null);
}

/**
 * Gets the ObjectId of the established default role (Jammer)
 * @returns defaultRole ObjectId
 */
exports.getDefaultRoleID = async () => {
    const jammerRole = await RoleModel.findOne({ name: "Jammer" });
    if(!jammerRole){
        return null;
    }
    return jammerRole._id;
};

exports.getRoles = async (req, res) => {
    try{
        const roles = await RoleModel.find();
        if(!roles){
            return res.status(404).send({ message: "Roles not found" });
        }
        return res.send({roles: roles});
    }
    catch(err){
        return res.status(500).send({ message: "Server error" });
    }
}

exports.getRole = async (req, res) => {
    try{
        const roleName = req.params.role;
        const role = await RoleModel.findOne({ name: roleName });
        if(!role){
            return res.status(404).send({ message: "Role not found" });
        }
        return res.send({role: role});
    }
    catch(err){
        return res.status(500).send({ message: "Server error" });
    }
}