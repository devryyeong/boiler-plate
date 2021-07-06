//Register Route
const express = require('express')
const app = express()
const port = 5000
//즉, body-parser를 이용해 req.body로 client가 보내는 정보를 받을 수 있음.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key');  
const {auth} = require('./middleware/auth');
const {User} = require('./models/User'); //User 모델 가져오기

//option1: bodyparser가 client로부터 오는 정보를 server에서 분석해서 가져올 수 있게 해주는 역할
//(application/x-www-form-urlencoded)
app.use(express.urlencoded({extended: true}));
//(application/json) 형태의 정보를 분석해서 가져올 수 있게 해주는 역할
app.use(express.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, { //dev.js의 mongoURI
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connected...'))
.catch(err=>console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World! haaa')
})

app.get('/api/hello', (req, res)=> {
    res.send("proxy server 설정")
})

//라우트의 endpoint: register
app.post('/api/users/register', (req, res) => {
    //인스턴스 만들고 정보들을 DB에 넣기.
    //req.body안에는 json형태로 회원가입할 때 필요한 정보(client가 보내는)가 들어있음.
    const user= new User(req.body) 
    

    //mongoDB메소드: 정보들이 user모델에 저장됨.
    user.save((err, userInfo) => { //callback function
        if(err) return res.json({ success: false, err}) //실패했을 때
        return res.status(200).json({ //성공했을 때: status(200)
            success: true
        })
    })
})


//Log-in
app.post('/api/users/login', (req, res)=>{
    //요청된 이메일을 데베에서 찾음(findOne: mongoDB에 있는 메소드.)
    User.findOne({ email: req.body.email }, (err, user)=> {
        if(!user){
            return res.json({ 
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없음."
            })
        }
        
        //데베에 있다면 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password, (err, isMatch)=> {
            //비밀번호가 틀리다면
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀림." })

            //비밀번호까지 맞다면 Token 생성
            //index.js에서 User에 넣어준 것이 user로 들어옴.
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err); //status(400) : err있다!->send!

                //Token을 Cookie에 저장 (cookie-parser 이용)
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id})
            })
        })
    })
})


//Authentication(미들웨어를 통과함 = Authentication이 true. 인증 통과~!)
app.get('api/users/auth', auth, (req, res)=>{
    res.status(200).json({ //Client에게 User 정보 제공(선택적으로)
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false:true, //role=0: 일반유저 / role=1: Admin
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})


//Log-out
app.get('/api/users/logout', auth, (req, res)=> {
    //로그아웃하려는 유저를 DB에서 찾기(미들웨어에서 찾아서)
    User.findOneAndUpdate({ _id: req.user._id},
        {token: ""}
        ,(err, user)=> {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})