'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const { STRING, INTEGER, DATE } = Sequelize;

    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      phone: { type: STRING, allowNull: false },
      username: { type: STRING, allowNull: true },
      password: { type: STRING, allowNull: true },
      email: { type: STRING, allowNull: true },
      lastSignInAt: DATE,
      createdAt: DATE,
      updatedAt: DATE,
      version: INTEGER,
    });

    await queryInterface.addIndex('users', ['phone'], { indicesType: 'UNIQUE' });

    return queryInterface.bulkInsert('users', [{
      id: 1,
      phone: '13810556559',
      email: 'user@user.com',
      username: 'user',
      password: '$2a$10$QlA.DnpNNoehYSsfoCPm.eMkv8Bujwbvl5x3r6afmO12E0PdQD3kO',
      lastSignInAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    }]);

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('users');
  }
};
