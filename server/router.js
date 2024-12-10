const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getMessage', mid.requiresLogin, controllers.Message.getMessage);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/message', mid.requiresLogin, controllers.Message.messagePage);
  app.post('/message', mid.requiresLogin, controllers.Message.setMessage);

  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};
module.exports = router;
