const routes = (app) => {
   app.use('/api/users', require('./user.route'));
   app.get('/', (req, res) => {
      res.send('Hello World!');
   });
};

module.exports = routes;
