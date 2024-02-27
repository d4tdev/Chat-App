'use strict';
const mongoose = require('mongoose');
require('dotenv').config();

const connectString = process.env.MONGO_URI;

class Database {
   constructor() {
      this.connect();
   }

   connect(type = 'mongodb') {
      if (process.env.NODE_ENV === 'development') {
         mongoose.set('debug', true);
         mongoose.set('debug', { color: true });
      }

      mongoose
         .connect(connectString, {
            maxPoolSize: 100,
         })
         .then((_) => {
            console.log('Database connection successful');
         })
         .catch((err) => {
            console.error(`Error connecting database: ${err}`);
         });
   }

   static getInstance() {
      if (!Database.instance) {
         Database.instance = new Database();
      }
      return Database.instance;
   }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
