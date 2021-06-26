//Register Route
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const config = require('./models/User');  
//User 모델 가져오기
const {User} = require('./models/User');

//option1: bodyparser가 client로부터 오는 정보를 server에서 분석해서 가져올 수 있게 해주는 역할
//(application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({extended: true}));
//(application/json) 형태의 정보를 분석해서 가져올 수 있게 해주는 역할
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connected...'))
.catch(err=>console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World! haaa')
})

//라우트의 endpoint: register
app.post('/register', (req, res) => {
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
//즉, body-parser를 이용해 req.body로 client가 보내는 정보를 받을 수 있음.


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})