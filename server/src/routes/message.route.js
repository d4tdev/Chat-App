const messageController = require('../controllers/message.controller');

const router = require('express').Router();

router.post('/', messageController.createMessage);
router.get('/:chatId', messageController.getMessages);

module.exports = router;
