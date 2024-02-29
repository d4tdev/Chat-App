const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Chat';
const COLLECTION_NAME = 'Chats';

// Declare the Schema of the Mongo model
const chatSchema = new mongoose.Schema(
   {
      members: Array,
   },
   {
      collection: COLLECTION_NAME,
      timestamps: true,
   }
);

const ChatModel = mongoose.model(DOCUMENT_NAME, chatSchema);
//Export the model
module.exports = ChatModel;
