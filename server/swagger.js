const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const doc = {
   info: {
      title: 'Chat App API',
      description: 'API for chat application',
   },
   host: process.env.HOST,
};

const outputFile = './swagger-output.json';
const routes = ['./src/app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
