const jwt = require('jsonwebtoken')
const Message = require('../models/message')
const User = require('../models/user')

const message_post = (req, res) => {
    const token = req.cookies[process.env.JWT_NAME]
    const {text} = req.body 
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
        if(err) {
            res.clearCookie(process.env.JWT_NAME)
            res.redirect('/login')
            return
        } 
        const message = new Message({text, author: decodedToken.id, date: Date.now()})
        message.save()
            .then(
                res.json({message: {
                    date: message.getdate
                }})
            )
    })
}

module.exports = {
    message_post
}