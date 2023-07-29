const mongoose = require('mongoose');

//Users main Documents
const Users_data = new mongoose.Schema({
    User_type:{
        type: String,
    },
    name:{
        type: String,
    },
    lastname:{
        type: String,
    },
    password:{
        type: String,
        //maxlength: 20,
        minlength: [7, "Password must have at least 7 characters"],
        required:[true, 'please add a password']
    },

    email:{
        type: String
    },
    company:{
        type: String,
    },
    _id:{
        type: String,
        default: ""
    },
    phone:{
        type: String,
        default: ""
    },
    CV:{
        type: String,
        default: ""
    },
    applied:[],
    interviews:[]
})

const  User = mongoose.model('users',Users_data)

module.exports = User