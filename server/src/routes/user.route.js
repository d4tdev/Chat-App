const userController = require('../controllers/user.controller');

const router = require('express').Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.route('/:userId').get(userController.getUser);
router.route('/').get(userController.getAllUser);

module.exports = router;
