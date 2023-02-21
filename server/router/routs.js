const Router = require('express').Router
const userController = require('../controllers/user-controller')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')
const router = new Router()

router.post('/registration',
 body('email').isEmail(),
 body('username').isLength({min: 3, max: 12}),
 body('password').isLength({min: 4, max: 20}),
 userController.registration
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router