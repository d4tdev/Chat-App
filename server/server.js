'use strict';
require('dotenv').config();

const PORT = process.env.PORT || 4090;

const { server } = require('./socket');
const serverListener = server.listen(PORT, () => {
   console.log(`Server is running on port ${server.address().port}`);
});

process.on('SIGINT', () => {
   serverListener.close(() => {
      console.log(`Server closed!`);
      process.exit(0);
   });
});
