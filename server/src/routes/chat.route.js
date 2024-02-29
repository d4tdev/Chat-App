const chatController = require('../controllers/chat.controller');

const router = require('express').Router();

router.route('/').post(chatController.createChat)
router.route('/:userId').get(chatController.getUserChats);
router.route('/:firstId/:secondId').get(chatController.getChat);

module.exports = router;
