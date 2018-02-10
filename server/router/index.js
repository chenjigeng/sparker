const userRouter = require('./user');
const docRouter = require('./doc');
const commonRouter = require('./common');

function initRouter (app) {
  app.use('/api/', commonRouter);
  app.use('/api/user', userRouter);
  app.use('/api/doc', docRouter);
}

module.exports = initRouter;
