const TeamModel = require('../models/team.model');
const UserModel = require('../models/user.model');

/**
 * Creates a new team of jammers in a site.
 * Needs team name and an array of the username of the members
 * @param {*} req 
 * @param {*} res 
 */
exports.createTeam = async (req, res) => {
    try {
        const teamReq = {
            name: req.body.name,
            members: req.body.members
        };
        
        if(teamReq.members.length > 6){
            return res.status(409).send({ message: "Maximum amount of members was exceeded" });
        }
        // Converts usernames to user ObjectIds
        teamReq.members = await Promise.all(teamReq.members.map(
            async username => {
                const user = await UserModel.findOne({ username });
                if(!user){
                    throw new Error(`User ${username} not found`);
                }
                return user._id;
            } 
        ));
        const team = new TeamModel(teamReq);
        await team.save();

        const teamPopulated = await TeamModel.findById(team._id).populate('members', '-password');
        teamPopulated.message = "Team created";
        res.send(teamPopulated);

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Team already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

/**
 * Validates that a team doesn't exceed the 6 member limit
 * @param {*} team 
 * @param {*} user 
 * @returns 
 */
async function validateTeamMembers(team, user) {
    try{
        if (team.members.length > 6){
            return {canJoin: false, message: "The team cannot have more than 6 members"};
        }

        const alreadyInTeam = team.members.includes(user._id);
        if (alreadyInTeam) {
            return { canJoin: false, message: "User already belongs to this team" };
        }

        return {canJoin: true, message: "User can join the team"};

    }catch (err){
        return {canJoin: false, message: "Error while checking if user can join the team"}
    }
};

/**
 * Adds an user to a team if it doesn't exceed 6 member limit.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addMember = async (req, res) => {
    try {
        const id = req.body.teamID;
        const username = req.body.username;

        const team = await TeamModel.findById(id);
        const user = await UserModel.findOne({ username });

        if (!team){
            return res.status(409).send( { message: "Team not found"} );
        }

        if (!user){
            return res.status(409).send( { message: "User not found"} );
        }

        const canJoin = await validateTeamMembers(team, user);
        if (!canJoin.canJoin) {
            return res.status(409).send({ message: canJoin.message });
        }
        
        team.members.push(user._id);
        await team.save();
        return res.status(200).send({ message: "User joined team successfully" });

    }catch (err){
        console.error(err);
        return res.status(500).send({message: "Server error"});
    }
};

/**
 * Removes member from a team
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.kickMember = async (req, res) => {
    try{
        const id = req.body.teamID;
        const username = req.body.username;
        const team = await TeamModel.findById(id);
        const user = await UserModel.findOne({ username });
    
        if(!team){
            return res.status(409).send({ message: "Team not found"} );
        }
        if(!user){
            return res.status(409).send( { message: "User not found"} );
        }

        team.members = team.members.filter(value => !value.equals(user._id));
        team.save();
        return res.status(200).send({ message: "User removed from team successfully" });
    }
    catch (err){
        console.error(err);
        return res.status(500).send({message: "Server error"});
    }
};

/**
 * Changes team name if not available already
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.changeTeamName = async (req, res) => {
    try {
        const teamID = req.params.id;
        const name = req.body.name;
        const team = await TeamModel.findByIdAndUpdate(teamID, {name}, {new: true});

        if(!team){
            return res.status(409).send({ message: "Team not found"} );
        }
        return res.status(200).send({ message: `Team name updated successfully to ${name}` });

    }catch (err){
        console.error(err);
        return res.status(500).send({message: "Server error"});
    }
};

exports.getUserTeam = async (req, res) => {
    try {
        const username = req.params.username;

        const user = await UserModel.findOne({ username });
        if (!user){
            return res.status(409).send({ message: "User not found" });
        }

        const team = await TeamModel.findOne({ members: { $in: [user._id]} }).populate('members', '-password');

        if(!team) {
            return res.status(409).send({ message: "User has no team assigned" });
        }

        return res.send(team);
    } catch{
        res.status(500).send({ message: "Error" });
    }
}

exports.getTeam = async (req, res) => {
    try {
        const id = req.params.id;

        const team = await TeamModel.findById(id).populate('members', '-password');
        
        if(!team) {
            return res.status(409).send({ message: "Team not found" });
        }

        return res.send(team);
    } catch{
        res.status(500).send({ message: "Error" });
    }
}