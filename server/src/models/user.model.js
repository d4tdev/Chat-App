const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

// Declare the Schema of the Mongo model
const userSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         index: true,
      },
      username: {
         type: String,
         required: true,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
   },
   {
      collection: COLLECTION_NAME,
      timestamps: true,
   }
);
const UserModel = model(DOCUMENT_NAME, userSchema);
//Export the model
module.exports = UserModel;
