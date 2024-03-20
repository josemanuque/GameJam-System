const RoleModel = require('../models/role.model');
const UserModel = require('../models/user.model');

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

exports.asignRole = async (req, res) => {
    try {
        const username = req.body.username;
        const roleName = req.body.role;

        const user = UserModel.findOne({ username });
        const role = RoleModel.findOne({ username });
        
        if (!user){
            return res.status(409).send( { message: "User not found"} );
        }
        if (!role){
            return res.status(409).send( { message: "Role not found"} );
        }

        user.roles = user.roles.push(role._id);
        user.save();
    } catch (err){
        return res.status(500).send({ message: "Server error"} );
    }
    
};

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

exports.getDefaultRoleID = async () => {
    const jammerRole = await RoleModel.findOne({ name: "Jammer" });
    if(!jammerRole){
        return null;
    }
    return jammerRole._id;
};