const ChatModel = require('../models/chat.model');

class ChatController {
   createChat = async (req, res) => {
      try {
         const { firstId, secondId } = req.body;

         const chat = await ChatModel.findOne({
            members: { $all: [firstId, secondId] },
         });
         if (chat) return res.status(200).json({ chat });
         const newChat = await ChatModel.create({
            members: [firstId, secondId],
         });

         return res.status(201).json({ success: true, metadata: newChat });
      } catch (error) {
         console.error(error);
         return res.status(500).json({
            success: false,
            message: 'Internal server error',
         });
      }
   };

   getUserChats = async (req, res) => {
      try {
         const { userId } = req.params;

         const chats = await ChatModel.find({
            members: { $in: [userId] },
         });

         return res.status(200).json({ success: true, metadata: chats });
      } catch (error) {
         console.error(error);
         return res.status(500).json({
            success: false,
            message: 'Internal server error',
         });
      }
   };

   getChat = async (req, res) => {
      try {
         const { firstId, secondId } = req.params;

         const chat = await ChatModel.findOne({
            members: { $all: [firstId, secondId] },
         });

         return res.status(200).json({
            success: true,
            metadata: chat,
         });
      } catch (error) {
         console.error(error);
         return res.status(500).json({
            success: false,
            message: 'Internal server error',
         });
      }
   };
}

module.exports = new ChatController();
