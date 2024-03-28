const TeamModel = require('../models/team.model');
const UserModel = require('../models/user.model');

exports.createTeam = async (req, res) => {
    try {
        const teamReq = {
            name: req.body.name
        };

        const team = new TeamModel(teamReq);
        await team.save();
        res.send({ message: "Team created" });

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: 'Team already exists' });
        } else {
            console.log(err)
            res.status(500).send({ message: 'Server error' });
        }
    }
};

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

exports.joinTeam = async (req, res) => {
    try {
        const name = req.body.name;
        const username = req.body.username;

        const team = await TeamModel.findOne({ name }).exec();
        const user = await UserModel.findOne({ username }).exec();

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

exports.addMember = async (req, res) => {
    const userID = req.body.userID;
    const team = TeamModel.findOne({ name: req.body.team} );

    if(!team){
        return res.status(409).send({ message: "Team not found"} );
    }
    team.members = team.members.push(userID);

    team.save();
}

exports.removeMember = async (req, res) => {
    const userID = req.body.userID;
    const team = TeamModel.findOne({ name: req.body.team} );

    if(!team){
        return res.status(409).send({ message: "Team not found"} );
    }
    team.members = team.members.filter(value => value !== userID);

    team.save();
}