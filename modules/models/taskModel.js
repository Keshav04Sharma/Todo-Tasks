const mongo = require('mongoose');
const users = require('./userModel');
const taskSchema = new mongo.Schema({

        task:{
            type: String,
            required: true
        },

        is_deleted:{
            type: Number,
            default: 0

        },

        is_complete:{
            type: Number,
            default: 0
        },

        user_id: {
            type: mongo.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
    },
    {
        timestamps: {created_at: true, updated_at: true}
});

const tasks = mongo.model('tasks', taskSchema);

module.exports = tasks;