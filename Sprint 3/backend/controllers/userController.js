const User = require('../models/users');

const getUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                results: "User not found",
                status: 'Failed',
                data: req.body,
            })
        }
        res.status(200).json({
            success: true,
            status: 'success',
            results: req.params._id,
            data: { myUser: user },
        })
    } catch (error) {
        res.status(406).json({
            success: false,
            status: 'fail',
            message: error
        })
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json({
            success: true,
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            status: 'fail',
            message: error,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()

        res.status(200).json({
            success: true,
            status: 'success',
            results: users.length,
            data: {
                all_users: users
            }
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            status: 'fail',
            message: error,
            value: null,
        })
    }

};

const updateUser = async (req, res) => {
    try {
        const allowedUpdates = ["name", "password", "company", "phone"];
        const updates = Object.keys(req.body);
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidUpdate) {
            return res.status(400).json({
                success: false,
                status: "fail",
                message: "Invalid updates!",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                status: "fail",
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            status: "success",
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: "fail",
            message: error,
        });
    }

};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: deletedUser
        })

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error
        })
    }

};

const deleteAllUsers = async (req, res) => {

    try {
        const deletedUsers = await User.deleteMany({})

        res.status(200).json({
            status: 'success',
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error,
            success: false,
        })
    }

};

const addInterview = async (req, res) => {

    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { interviews: req.params.postId } },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error,
            success: false,
        });
    }

};

module.exports = { getUser, getUserById, getAllUsers, updateUser, deleteUser, deleteAllUsers, addInterview };
