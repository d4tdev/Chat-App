const MessageModel = require("../models/message.model");

class MessageController {
   createMessage = async (req, res) => {
      try {
         const { chatId, senderId, text } = req.body;

         const message = await MessageModel.create({
            chatId,
            senderId,
            text,
         });

         return res.status(201).json({
            success: true,
            metadata: message,
         });
      } catch (error) {
         console.error(error);
         return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
      }
   };

   getMessages = async (req, res) => {
      const { chatId } = req.params;
      try {
         const messages = await MessageModel.find({ chatId });
         return res.status(200).json({ success: true, metadata: messages });
      } catch (error) {
         console.error(error);
         return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
      }
   };
}

module.exports = new MessageController();
