'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Note: We need profiles or just link to fictional IDs for demo
    // However, usually seeders should follow dependency order.
    // For simplicity in this demo, we'll assume profile IDs 1-10 exist.
    const personajes = Array.from({ length: 20 }).map(() => ({
      nombre: faker.person.firstName(),
      descripcion: faker.lorem.paragraph(),
      ataque: faker.number.int({ min: 50, max: 100 }),
      defensa: faker.number.int({ min: 50, max: 100 }),
      estamina: faker.number.int({ min: 50, max: 100 }),
      perfilId: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Personajes', personajes);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Personajes', null, {});
  }
};
