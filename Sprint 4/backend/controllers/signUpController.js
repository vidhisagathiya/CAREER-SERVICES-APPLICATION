const User = require('../models/users');
const bcrypt = require('bcrypt');

// TODO: Need to add password hashing
const createUser = async (req, res) => {
    try {
        const { email, company } = req.body;
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "E-mail already exists",
                value: userExist,
                Received: req.body
            });
        }

        if (req.body.company) {
            const { company } = req.body;
            const companyExist = await User.findOne({ company })
            if (companyExist) {
                return res.status(400).json({
                    success: false,
                    message: "company already exists",
                    value: { company },
                    Received: req.body
                })
            }
        }

        // Hashing password for security
        const userDetails = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        userDetails.password = password;

        const collectionSize = (await User.collection.stats()).size.toString()

        if (userDetails.User_type == "Company") {
            userDetails._id = userDetails.company + collectionSize;
        }
        else {
            userDetails._id = userDetails.name + "-" + userDetails.lastname + collectionSize
        }

        const newUser = await User.create(userDetails)
        
        await newUser.save();

        res.status(200).json({
            success: true,
            status:'success',
            value:newUser,
        })

    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', status: 'fail' });
    }

};

module.exports = { createUser };