// import * as debug from 'debug';

import { Application } from 'egg';

import BaseModel from '../common/BaseModel';

const roleMappingConfig = require('./role-mapping.json');

// const logger = debug('app:model:roleMapping');

export default function RoleMapping(app: Application) {
  const { STRING, INTEGER } = app.Sequelize;

  // 创建模型
  const modelSchema = BaseModel(app, 'roleMapping', {
    principalType: { type: STRING, allowNull: false }, // 角色名称 The principal type, such as user, application, or role
    principalId: { type: INTEGER, allowNull: true }, // 类型的id 为 user 时为 userId
    roleId: { type: INTEGER, allowNull: true }, // 角色Id
  }, {
      // 关闭软删除
      paranoid: false,
    },
    roleMappingConfig,
  );

  return modelSchema;
}
