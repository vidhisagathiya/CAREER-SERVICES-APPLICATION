const mongoose = require('mongoose');

//Candidate main Documents
const candidateSchema = new mongoose.Schema({
    
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    password:{
        type: String,
        maxlength: 30,
        minlength: 7,
        required:true, 
    },

    email:{
        type: String,
        unique : true
    },
    company:{
        type: String,
    },
    phone:{
        type: String,
        required: true,
    },
    resume:{
        type: String,
        default: ""
    },
    applied: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post',
        },
      ]
})

const Candidate = mongoose.model('candidate',candidateSchema)

module.exports = Candidate