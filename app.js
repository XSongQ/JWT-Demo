import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const app = express()
const jwtKey = 'fasijdhfaskljfsdoaijf'

// 允许跨域请求
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}))

// 解析jSON数据
app.use(express.json())

// 账户数据库，实际当中写入文件或数据库
const database = {
    users: [{
        username: 'Terry',
        password: 'password1'
    }]
}

// 添加注册接口
app.post('/register', (req, res) => {
    const { username, password } = req.body
    
    // 检查用户名是否已存在
    const userExists = database.users.some(user => user.username === username)
    if (userExists) {
        return res.status(400).json({ message: '用户名已存在' })
    }
    
    // 添加新用户
    database.users.push({ username, password })
    res.json({ message: '注册成功' })
})

// 登录生成JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body
    
    // 修改后的验证逻辑：在users数组中查找匹配的用户
    const user = database.users.find(user => 
        user.username === username && 
        user.password === password
    )

    if (user) {  // 找到有效用户时生成token
        jwt.sign(
            { username },
            jwtKey,
            { expiresIn: '30s' },
            (err, token) => {
                res.json({ username, message: '登录成功', token })
            }
        )
    } else {
        res.status(401).json({ message: '用户名或密码错误' })
    }
})

// 登录后验证token
app.get('/afterlogin', (req, res) => {
    const headers = req.headers
    const token = headers['authorization'].split(' ')[1]
    // console.log(headers)

    jwt.verify(token, jwtKey, (err, payload) => {
        if(err) res.sendStatus(403)
        res.json({ message: '认证成功', payload})
    })
})

// 绑定并侦听端口
app.listen(4000, () => console.log('端口4000已绑定'))
