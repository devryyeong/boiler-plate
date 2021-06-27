const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//saltRounds: salt의 길이
const saltRounds = 10
const jwt = require('jsonwebtoken');

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
        bcrypt.genSalt(saltRounds, function(err, salt) { //salt 생성
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    } else{ //비밀번호가 아닌 다른 정보를 바꿀 때는 그냥 next()
        next()
    }
})

//plainPassword를 암호화한 다음 DB의 password와 비교
userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}
userSchema.methods.generateToken = function(cb){
    //jsonwebtoken을 이용해 token 생성하기
    var user=this;
    var token=jwt.sign(user._id.toHexString(), 'secretToken') //_id: mongoDB의 user collenction의 id
    //user._id + 'secretToken' = token 이므로 'secretToken'을 넣으면 user._id를 얻을 수 있음

    //생성한 Token을 User에 넣어줌.
    user.token=token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}


const User = mongoose.model('User', userSchema)

module.exports={User}
