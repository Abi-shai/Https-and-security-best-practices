const fs = require('fs')
const https = require('https')
const path = require('path')
const express = require('express')
const helmet = require('helmet')

const app = express()

// Helmet is a usefull package that add a security layer to a nodejs Api
app.use(helmet())
app.use(express.json())

// Good practice in an Express application to use functions as parameters to an Express endpoint instead of 
// a middleware
function checkLoggedIn(req, res, next) {
    const isLoggeIn = true
    if(!isLoggeIn) {
        return res.status(401).json({
            error: `You can't log in!`
        })
    }
    next()
}

app.get('/auth/google', (req, res) => {

})

app.get('/auth/google/callback', (req, res) => {})

app.get('/auth/logout', (req, res) => {})


app.get('/secret', /** Used the function as param there**/ checkLoggedIn, (req, res) => {
    return res.send('Your secret is that you have 500$')
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(8000, () => {
    console.log('Listenning at port 8000')
})