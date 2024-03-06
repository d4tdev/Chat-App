const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger-output.json');

const routes = (app) => {
   app.use('/api/users', require('./user.route'));
   app.use('/api/chats', require('./chat.route'));
   app.use('/api/messages', require('./message.route'));
   app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = routes;
