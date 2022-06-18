const fs = require('fs')
const https = require('https')
const path = require('path')
const express = require('express')
const helmet = require('helmet')
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')

require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

// Google OAuth configuration params
const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
}

function verifyCallback(accessToken, refreshToken, profile, done){
    console.log('Google profile', profile);
    done(null, profile)
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

// Helmet is a usefull package that add a security layer to a nodejs Api
app.use(helmet())
app.use(passport.initialize())
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

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email']
    })
)

app.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect:'/failure',
        successRedirect: '/',
        session: false
    }),
    (req, res) => {
        console.log('Google called us back')
    }
)

app.get('/failure', (req, res) => {
    return res.send('Failed to log in')
})

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
}, app).listen(PORT, () => {
    console.log(`Listenning at port ${PORT}`)
})