const {Router} = require('express')
const {body} = require('express-validator')
const indexController = require('../controllers/indexController')
const {checkUser} = require('../middleware/authMiddleware')

const router = Router()
router.get('/', checkUser, indexController.index_get)

// sign-up routers
router.get('/signup', checkUser ,indexController.signup_get)
router.post('/signup', [
    body('username', 'Username must not be empty').isLength({min: 3}).escape(),
    body('email', 'Email must not be empty').trim().isEmail().withMessage('Not correct email'),
    body('password', 'Password must not be empty').isLength({min: 6}).withMessage('Minimum password length is 6')
], indexController.signup_post)

// login routers
router.get('/login', checkUser ,indexController.login_get)
router.post('/login', [
    body('email', 'Email must not be empty').trim().isEmail().withMessage('Not correct email'),
    body('password', 'Password must not be empty').isLength({min: 6}).withMessage('Password not currect')
], indexController.login_post)

router.get('/logout', indexController.logout_get)

module.exports = router