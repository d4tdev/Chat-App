'use strict';
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require('./configs/connectDB');

require('./routes/index.route')(app);

module.exports = app;
