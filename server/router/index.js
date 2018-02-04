const userRouter = require('./user');

function initRouter (app) {
  app.use('/user', userRouter);

}

module.exports = initRouter;
