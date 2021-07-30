const {Router} = require('express')
const {body} = require('express-validator')
const chatController = require('../controllers/chatController')

const {requireAuth, checkUser} = require('../middleware/authMiddleware')
const router = Router()

// create chat
router.get('/createchat', requireAuth, checkUser, chatController.createchat_get)
router.post('/createchat', chatController.createchat_post)

// chats
router.get('/userchats', requireAuth, checkUser, chatController.chats_get)


// single chat
router.get('/:chatid', requireAuth, checkUser, chatController.singlechat_get)


router.post('/message', chatController.message_post)

module.exports = router