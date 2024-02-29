const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Message';
const COLLECTION_NAME = 'Messages';

// Declare the Schema of the Mongo model
const messageSchema = new mongoose.Schema(
   { chatId: String, senderId: String, text: String },
   {
      timestamps: true,
      collection: COLLECTION_NAME,
   }
);

const MessageModel = mongoose.model(DOCUMENT_NAME, messageSchema);
//Export the model
module.exports = MessageModel;
