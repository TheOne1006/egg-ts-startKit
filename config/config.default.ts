import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// app special config scheme
export interface BizConfig {
  sourceUrl: string;
  sequelize: {
    dialect: string;
    database: string;
    storage: string;
    host: string;
    port: string;
    username: string;
    password: string;
  };
}

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig;

  config.security = {
    csrf: {
      enable: false,
    },
  };
  // app special config
  config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1527687360868_6554';

  // add your config here
  config.middleware = [
    'graphql',
    'swagger',
  ];

  return config;
};
