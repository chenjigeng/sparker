const userRouter = require('./user');
const commonRouter = require('./common');

function initRouter (app) {
  app.use('/api/', commonRouter);
  app.use('/api/user', userRouter);
}

module.exports = initRouter;
