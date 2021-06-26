const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//saltRounds: salt의 길이
const saltRounds = 10

const userSchema = mongoose.Schema({
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

//유저 모델을 저장하기 전에 뭔가(비밀번호 암호화)를 한다!
userSchema.pre('save', function(next){
    var user=this; //userSchema
    //비밀번호 암호화
    //myPlaintextPassword: 사용자가 입력하는 순수 비밀번호
    //hash: 암호화된 비밀번호
    if(user.isModified('password')){ //다른 데이터가 아닌 비밀번호를 바꿀 때만 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    }
})

const User = mongoose.model('User', userSchema)

module.exports={User}