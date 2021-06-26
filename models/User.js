const mongoose = require('mongoose');

const userSchema =mongooose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //사이 공백을 없애줌
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: { //expiration(유효기간)
        type: Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports={User}