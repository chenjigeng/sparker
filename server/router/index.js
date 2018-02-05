const userRouter = require('./user');
const commonRouter = require('./common');

function initRouter (app) {
  app.use('/', commonRouter);
  app.use('/user', userRouter);
}

module.exports = initRouter;
