import express from 'express'
import jwt from 'jsonwebtoken'

const app = express()
const jwtKey = 'fasijdhfaskljfsdoaijf'

// 解析jSON数据
app.use(express.json())

// 数据库数据
const database = { username: 'Terry', password: 'a_simple_password'}

// 登录生成JWT
app.prependOnceListener('/login', (req, res) => {
    const { username, password } = req.body
    if(username === database.username && password === database.password) {
        res.json({ username, password, message: '登录成功' })
    }
})

// 绑定并侦听端口
app.listen(3000, () => console.log('端口3000已绑定'))
