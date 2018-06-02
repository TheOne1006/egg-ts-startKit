'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { STRING, INTEGER, DATE } = Sequelize;

    await queryInterface.createTable('accessTokens', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      token: {
        type: STRING,
        allowNull: false,
      },
      userId: {
        type: INTEGER,
      },
      adminId: {
        type: INTEGER,
      },
      scope: {          // 用户 类型/ 管理员类型
        type: STRING,
        allowNull: false,
      },
      ttl: {
        type: INTEGER,
        defulat: 1209600,
      },
      createdAt: DATE,
      updatedAt: DATE,
      version: INTEGER,
    });

    await queryInterface.addIndex('accessTokens', ['userId']);

    return queryInterface.addIndex('accessTokens', ['token']);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('accessTokens');
  }
};
