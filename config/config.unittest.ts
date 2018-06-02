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
        enable: true,
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
    // sql 数据库
    sequelize: {
      database: 'demo',
      dialect: 'sqlite',
      storage: 'databases/database.sqlite',
    },
    graphql: {
      router: '/graphql',
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
      // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
      graphiql: true,
      // graphQL 路由前的拦截器
      // onPreGraphQL: function* (ctx) { },
      // 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
      // onPreGraphiQL: function* (ctx) { },
    },
  };
  return config;
};
