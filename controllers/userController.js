const { User, Thought } = require('../models/index');

const userController = {
    getUsers(req, res) {
        User.find()
            .populate({
                path: 'thought',
                select: '-__v'
            })
            .select('-__v')
            .then(userAll => res.json(userAll))
            .catch((err) => {
                console.log(err);
                res.status(404).json(err);
            });
    },
    getUserById(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(userById => res.json(userById))
            .catch((err) => {
                console.log(err);
                res.status(404).json(err)
            });
    },
    createUser(req, res) {
        User.create(req, res)
            .then((newUser) => res.json(newUser))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true },
            { new: true }
            )
            .then((userData) => 
            !userData
                ? res.status(404).json({ message: 'No user with this ID found!' })
                : res.json(userData)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((deletedUser) =>
            !deletedUser
                ? res.status(404).json({ message: 'No user with this ID found!' })
                : res.json(deletedUser)
            )
            .catch((err) => res.status(500).json(err));
    },
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendsId }},
            { new: true }
        )
        .then(friendData => {
            !friendData
                ? res.status(404).json({ message: 'No user found with that ID!' })
                : res.json({ message: 'Friend successfully added!' })
        })
        .catch((err) => res.status(500).json(err))
    },
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendsId }},
            { new: true }
        )
        .then(friendData => {
            !friendData
                ? res.status(404).json({ message: 'No user found with that ID!' })
                : res.json({ message: 'Friend successfully added!' })
        })
        .catch((err) => res.status(500).json(err))
    },
};

module.exports = userController;