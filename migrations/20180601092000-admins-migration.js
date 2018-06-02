'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const { STRING, INTEGER, DATE } = Sequelize;

    await queryInterface.createTable('admins', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: STRING, allowNull: false },
      password: { type: STRING, allowNull: true },
      email: { type: STRING, allowNull: true },
      lastSignInAt: DATE,
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE,
      version: INTEGER,
    });

    await queryInterface.addIndex('admins', ['username'], { indicesType: 'UNIQUE' });

    return queryInterface.bulkInsert('admins', [{
      id: 1,
      email: 'admin@admin.com',
      username: 'admin',
      password: '$2a$10$QlA.DnpNNoehYSsfoCPm.eMkv8Bujwbvl5x3r6afmO12E0PdQD3kO',
      lastSignInAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 0,
    },
    {
      id: 2,
      email: 'admin@admin.com',
      username: 'admin2',
      password: '$2a$10$DQqxi94DykEUbK3GUudThu88rnQuNRDJ1a8NgeIzgGwYAEecQGlRO',
      lastSignInAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: 3,
      email: 'channel@admin.com',
      username: 'channel',
      password: '$2a$10$DQqxi94DykEUbK3GUudThu88rnQuNRDJ1a8NgeIzgGwYAEecQGlRO',
      lastSignInAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }, {
      id: 4,
      email: 'crawler@admin.com',
      username: 'crawler',
      password: '',
      lastSignInAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }]);

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('admins');
  }
};
