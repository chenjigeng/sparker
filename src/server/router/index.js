import userRouter from './user';
import docRouter from './doc';
import commonRouter from './common';

function initRouter (app) {
  app.use('/api/', commonRouter);
  app.use('/api/user', userRouter);
  app.use('/api/doc', docRouter);
}

export default initRouter;
