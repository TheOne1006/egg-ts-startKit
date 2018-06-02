import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/swagger.json', controller.home.swagger);

  app.registerRemote(app.model.Admin);
  app.registerRemote(app.model.AccessToken);
  app.registerRemote(app.model.Role);
  app.registerRemote(app.model.RoleMapping);
};
