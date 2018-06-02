import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  connectorRemote: {
    enable: true,
    package: 'egg-connector-remote',
  },
  swagger: {
    enable: true,
    package: 'egg-swagger',
  },
  graphql: {
    enable: true,
    package: 'egg-graphql',
  },
};

export default plugin;
