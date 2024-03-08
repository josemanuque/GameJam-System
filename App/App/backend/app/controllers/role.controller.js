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

        user.roles = user.roles.append(role._id);
    } catch (err){
        return res.status(500).send({ message: "Server error"} );
    }
    
}