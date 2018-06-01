import Sequelize from 'sequelize';

declare module "*.json" {
  const value: any;
  export default value;
}
declare module 'egg' {
    // 扩展 app
    interface Application {
        Sequelize: Sequelize;
        model: Sequelize.Sequelize;
        swagger: any;
        registerRemote: func;
    }

    // 扩展 context
    interface Context {
        Sequelize: Sequelize;
        model: Sequelize.Sequelize;
    }

    // 扩展你的配置
    interface EggAppConfig {
        sequelize: {
            dialect: string;
            database: string;
            host: string;
            port: string;
            username: string;
            password: string;
            storage: string;
        };
    }

}
