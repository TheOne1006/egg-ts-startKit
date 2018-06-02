'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const { STRING, INTEGER, DATE } = Sequelize;

    await queryInterface.createTable('RoleMappings', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      principalType: { type: STRING, allowNull: false }, // 角色名称 The principal type, such as user, application, or role
      principalId: { type: INTEGER, allowNull: true }, // 类型的id 为 user 时为 userId
      roleId: { type: INTEGER, allowNull: true }, // 角色Id
      createdAt: DATE,
      updatedAt: DATE,
      version: INTEGER,
    });

    await queryInterface.bulkInsert('RoleMappings', [{
      id: 1,
      principalType: 'admin',
      principalId: 1,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    }, {
      id: 2,
      principalType: 'admin',
      principalId: 3,
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    }, {
      id: 3,
      principalType: 'admin',
      principalId: 4,
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    }]);

    // 键值唯一
    return queryInterface.addIndex('RoleMappings', ['principalId', 'roleId'], { indicesType: 'UNIQUE' });

  },

  down: queryInterface => queryInterface.dropTable('RoleMappings'),
};
