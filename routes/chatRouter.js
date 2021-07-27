const {Router} = require('express')
const {body} = require('express-validator')
const chatController = require('../controllers/chatController')
const router = Router()

router.post('/message', chatController.message_post)

module.exports = router