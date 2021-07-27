const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// models
const User = require('../models/user')
const Message = require('../models/message')

require('dotenv').config()

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, {expiresIn: '24h'})
}

const index_get = (req, res) => {
    Message.find()
        .sort({date: 1})
        .populate('author')
        .then(messages => {
            res.render('home', {messages})
        })
    
}

const signup_get = (req, res) => {
    res.render('signup')
}
const signup_post = async (req, res) => {

    const {username, email, password} = req.body

    // check errors
    const errors = validationResult(req)

    // find user with email
    const exist = await User.findOne({email})

    if(exist) {
        errors.errors.push({param: 'email', msg: 'User with this email is already exist'})
    }
    
    if(!errors.isEmpty()) {
        const messages = {username: '', email: '', password: ''}
        errors.errors.forEach(err => {
            messages[err.param] = err.msg
        })
        res.json({errors: messages})
        return
    }
    const user = await User.create({username, email, password})
    const token = createToken(user._id)
    res.cookie(process.env.JWT_NAME, token, {maxAge: 1000*60*60*24})
    res.json({user: user._id})
}

const login_get = (req, res) => {
    res.render('login')
}
const login_post = async (req, res) => {
    const {email, password} = req.body

    const errors = validationResult(req)

    const user = await User.findOne({email})

    if(!user) {
        errors.errors.push({param: 'email', msg: 'User with that email does not exist'})
    }

    if(!errors.isEmpty()) {
        const messages = {email: '', password: ''}
        errors.errors.forEach(err => {
            messages[err.param] = err.msg
        })
        res.json({errors: messages})
        return
    }
    const auth = await bcrypt.compare(password, user.password)

    if(!auth) {
        res.json({errors: {email: '', password: 'Wrong password'}})
        return
    }
    const token = createToken(user._id)
    res.cookie(process.env.JWT_NAME, token, {maxAge: 1000*60*60*24})
    res.json({user: user._id})
}

module.exports = {
    index_get,
    signup_get,
    signup_post,
    login_get,
    login_post
}