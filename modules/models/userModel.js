const mongo = require('mongoose')
const userSchema = new mongo.Schema({

    f_name: {
        type: String,
        required: true
    },
    l_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role:{
        type: String,
        default: "user"
    }
});
const users = mongo.model('users', userSchema);
module.exports = users;



