const { Schema, model } = require('mongoose');
const moment = require('moment');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            // len: (1, 280),
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtValue => moment(createdAtValue).format('MM DD, YYYY [at] hh:mm')
        },
         username: {
             type: String,
             required: true
         },
         reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        },
        id: false
    },
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;