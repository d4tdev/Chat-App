'use strict';
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
   cors({
      origin: ['http://localhost:5173', 'https://chat-with-friend.vercel.app/'],
   })
);

require('./configs/connectDB');
require('./routes/index.route')(app);

module.exports = app;
