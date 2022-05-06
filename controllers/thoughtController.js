const { User, Thought, Reaction } = require('../models/index');
const userController = require('./userController');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find()
               .populate({
                   path: 'user',
                   select: '-__v'
                })
                .select('-__v')
                .then(thoughtsAll => res.json(thoughtsAll))
                .catch((err) => {
                    console.log(err);
                    res.status(404).json(err);
                });
    },
    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
               .populate({
                   path: 'user',
                   select: '-__v'
        })
        .select('-__v')
        .then(thoughtById => res.json(thoughtById))
        .catch((err) => {
            console.log(err);
            res.status(404).json(err)
        });
    },
    createThought(req, res) {
        Thought.create(req.body)
               .then(({_id}) => {
                User.findOneAndUpdate(
                    { username: body.username },
                    { $addToSet: { thoughts: _id } },
                    { new: true }
            )
        })
        .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { new: true }
        )
        .then((thoughtData) =>
        !thoughtData
            ? res.status(404).json({ message: 'No thought found with that ID!' })
            : res.json(thoughtData)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((deletedThought) =>
        !deletedThought
            ? res.status(404).json({ message: 'No thought found with that ID!' })
            : res.json(deletedThought)
        )
        .catch((err) => res.status(500).json(err));
    },
    addReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: params.thoughtsId }},
            { new: true }
        )
        .then(reactionData => {
            !reactionData
                ? res.status(404).json({ message: 'No thought found with that ID!' })
                : res.json({ message: 'Reaction successfully added!' })
        })
        .catch((err) => res.status(500).json(err))
    },
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: params.reactionId}},
            { new: true }
        )
        .then(reactionData => {
            !reactionData
                ? res.status(404).json({ message: 'No thought found with that ID!' })
                : res.json({ message: 'Reaction successfulled deleted!' })
        })
        .catch((err) => res.status(500).json(err))
    }

};

module.exports = thoughtController;