const jwt = require('jsonwebtoken')
const User = require('../models/user')

require('dotenv').config()

const requireAuth = (req, res, next) => {
    const token = req.cookies[process.env.JWT_NAME]

    if(token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if(err) {
                res.clearCookie(process.env.JWT_NAME)
                res.redirect('/login')
                return
            }
            next()
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies[process.env.JWT_NAME]

    if(token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if(err) {
                res.locals.user = null
                next()
            } else {
                User.findById(decodedToken.id)
                    .then(user => {
                        res.locals.user = user
                        next()
                    })
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = {
    checkUser,
    requireAuth
}