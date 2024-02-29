const routes = (app) => {
   app.use('/api/users', require('./user.route'));
   app.use('/api/chats', require('./chat.route'));
   app.use('/api/messages', require('./message.route'));
   app.get('/', (req, res) => {
      res.send('Hello World! from github');
   });
};

module.exports = routes;
