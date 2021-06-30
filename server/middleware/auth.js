const {User} = require('../models/User'); 

let auth = (req, res, next)=> {
    //인증처리 하는 곳
    //1. Client Cookie에서 Token가져옴
    let token= req.cookies.x_auth;

    //2. Token을 복호화한 후 유저 찾음
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, err: true})

        req.token=token; //index.js쪽에서 token,user 정보를 가져와 사용할 수 있도록
        req.user=user;
        next(); //미들웨어 위치에서 다음으로 넘어갈 수 있도록
    })

    //3. 유저가 있으면 인증 ok, 없으면 인증 no
}

module.exports={auth};