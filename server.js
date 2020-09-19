require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')


app.use(express.json())

const users = []
const tasks = []

app.get('/', (req,res) => {
    res.send("Welcome")
});

app.post('/register', (req,res) => {
    try {
        //const hashPass = bcrypt.hash(req.body.password,10)
        const user = {
            id: users.length + 1,
            email: req.body.email,
            password: req.body.password
        }
        users.push(user)
        res.json({id:user.id, email:user.email})
    } catch {    
    }  
});

app.post('/login', (req,res) => {
    const useremail = req.body.email
    const password = req.body.password
    if(users == null){
        return res.json({
            success: false,
            message: 'User does not exists'
          })
    }
    const user = users.find(user => user.email === useremail)
    if(user.password.localeCompare(password) === 0){
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.json({accessToken: accessToken})
    }
    else{
        return res.json({
            success: false,
            message: 'Incorrect Password'
          })
    }    
});

app.get('/user',authenticateToken, (req,res) => {
    const user = users.find(user => user.email === req.user.email)
    res.json({id:user.id, email:user.email })
});

app.post('/create-task', authenticateToken, (req,res) => {
    const user = users.find(user => user.email === req.user.email)
    const task = {
        id: tasks.length + 1,
        userid: user.id,
        name: req.body.name
    }
    tasks.push(task)
    res.json({id:task.id, name:task.name})
});

app.get('/list-tasks', authenticateToken, (req,res) => {
    const user = users.find(user => user.email === req.user.email)
    if(task = null) return res.json({
        success: false,
        message: 'No task exists'
      })
    else{
        res.json(tasks.filter(task => task.userid === user.id))
    }    
});

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000)
