import { DefaultConfig } from './config.default';

export default () => {
  // console.log('in local');
  const config: DefaultConfig = {
    logger: {
      level: 'DEBUG',
    },
    connectorRemote: {
      enable: true,
      swaggerDefinition: {
        info: { // API informations (required)
          title: 'information_resource_manager', // Title (required)
          version: '1.0.0', // Version (required)
          description: '接口管理', // Description (optional)
        },
        basePath: '/api/v1',
        host: 'localhost:7001',
        securityDefinitions: {
          api_key: {
            type: 'apiKey',
            name: 'X-Access-Token',
            in: 'header',
          },
        },
      },
      registerRemote: true,
      accessRemote: {
        enable: false,
        getMatchFunc: app => app.model.Role.isInRole,
      },
    },
    swagger: {
      enable: true,
      mountPath: '/doces',
      swaggerFilePath: '/swagger.json',
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    sequelize: {
      database: 'demo',
      dialect: 'sqlite',
      storage: 'databases/database.sqlite',
    },
  };
  return config;
};
