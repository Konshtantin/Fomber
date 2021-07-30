const jwt = require('jsonwebtoken')
const Message = require('../models/message')
const User = require('../models/user')
const Chat = require('../models/chat')
const async = require('async')

const message_post = (req, res) => {
    const token = req.cookies[process.env.JWT_NAME]
    const {text, chat, date} = req.body 
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
        if(err) {
            res.clearCookie(process.env.JWT_NAME)
            res.redirect('/login')
            return
        } 
        const message = new Message({text, author: decodedToken.id, date, chat})
        message.save()
            .then(
                res.json({message: {
                    date: message.getdate
                }})
            )
    })
}

const createchat_get = (req, res) => {
    User.find()
        .sort({'username': 1})
        .then(users => {
            res.render('createchat', {users})
        })
}

const createchat_post = (req, res) => {
    const {chatname, chatusers} = req.body
    const token = req.cookies[process.env.JWT_NAME]
    if(!token) {
        res.json({error: '/login'})
        return
    }
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
        if(err) {
            res.clearCookie(process.env.JWT_NAME)
            res.json({error: '/login'})
            return
        }
        // push yourself to chat
        chatusers.push({userid: decodedToken.id, role: 'admin'})
        const chat = new Chat({
            chatname,
            chatauthor: decodedToken.id,
            userCount: chatusers.length
        })

        chatusers.forEach(async chatuser => {
            const user = await User.findById(chatuser.userid)
            user.chats.push({chat: chat._id, role: chatuser.role})
            await user.save()
        })

        await chat.save()
        res.json({chat: chat._id})
    })

}

const chats_get = (req, res) => {
    const token = req.cookies[process.env.JWT_NAME]

    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
        if(err) {
            res.clearCookie(process.env.JWT_NAME)
            res.redirect('/login')
            return
        }
        User.findById(decodedToken.id)
            .populate('chats.chat')
            .then(user => {
                user.chats.sort((a, b) => {
                    if (a.chat > b.chat) return 1
                    if (a.chat === b.chat) return 0
                    if (a.chat < b.chat) return -1
                })
                res.render('chats', {chats: user.chats})
            })
        
    })
}

const singlechat_get = (req, res, next) => {
    async.parallel({
        messages: function(callback) {
            Message.find({chat: req.params.chatid})
                .sort({'date': 1})
                .exec(callback)
        },
        chat: function(callback) {
            Chat.findById(req.params.chatid)
                .exec(callback)
        }
    }, function(err, results) {
        if(err) {
            res.render('singlechat', {error: 'This chat does not exist'})
            return
        }
        if(results.chat === null) {
            res.render('singlechat', {error: 'This chat does not exist'})
            return
        }
        res.render('singlechat', {error: null, messages: results.messages, chat: results.chat})
    })
    
}

module.exports = {
    message_post,
    createchat_get,
    createchat_post,
    chats_get,
    singlechat_get,
}
