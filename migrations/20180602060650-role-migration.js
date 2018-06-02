'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const { STRING, INTEGER, DATE } = Sequelize;

    await queryInterface.createTable('Roles', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: STRING, allowNull: false }, // 角色名称
      description: { type: STRING, allowNull: true }, // 角色描述
      createdAt: DATE,
      updatedAt: DATE,
      version: INTEGER,
    });

    await queryInterface.bulkInsert('Roles', [{
      id: 1,
      name: 'admin',
      description: '超级管理员',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    }, {
      id: 2,
      name: 'channelUser',
      description: '渠道商',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    }, {
      id: 3,
      name: 'crawler',
      description: '爬虫',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    }, {
      id: 4,
      name: 'user',
      description: '普通用户',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    }]);

    // 键值唯一
    return queryInterface.addIndex('Roles', ['name'], { indicesType: 'UNIQUE' });

  },

  down: queryInterface => queryInterface.dropTable('Roles'),
};
