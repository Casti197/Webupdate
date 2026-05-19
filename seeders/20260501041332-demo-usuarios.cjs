'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const usuarios = await Promise.all(Array.from({ length: 10 }).map(async () => ({
      username: faker.internet.username(),
      correo: faker.internet.email(),
      password: await bcrypt.hash('secret123', SALT_ROUNDS),
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

    // Add one admin manually for testing
    usuarios.push({
      username: 'admin',
      correo: 'admin@example.com',
      password: await bcrypt.hash('password123', SALT_ROUNDS),
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert('Usuarios', usuarios);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
