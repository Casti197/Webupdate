'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'role', {
      type: Sequelize.STRING(20),
      defaultValue: 'USER',
    });
    // Renaming columns to match the request "username, password"
    // Note: SQLite support for renameColumn depends on the version/environment.
    await queryInterface.renameColumn('Usuarios', 'nombre', 'username');
    await queryInterface.renameColumn('Usuarios', 'contrasena', 'password');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'role');
    await queryInterface.renameColumn('Usuarios', 'username', 'nombre');
    await queryInterface.renameColumn('Usuarios', 'password', 'contrasena');
  }
};
