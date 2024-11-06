const mongo = require('mongoose');
const users = require('./userModel');
const tasks = require('./taskModel');
const taskSchema = new mongo.Schema({

        subtask:{
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

        task_id:{
            type: mongo.Schema.Types.ObjectId,
            ref: 'tasks',
            required: true
        }
    },
    {
        timestamps: {created_at: true, updated_at: true}
});

const subtasks = mongo.model('subtasks', taskSchema);

module.exports = subtasks;