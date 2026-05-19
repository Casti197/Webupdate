'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const habilidades = Array.from({ length: 15 }).map(() => ({
      nombre: faker.helpers.arrayElement(['Fuego', 'Hielo', 'Rayo', 'Corte', 'Impacto', 'Sanación']),
      descripcion: faker.lorem.sentence(),
      incremento_ataque: faker.number.int({ min: 1, max: 20 }),
      incremento_defensa: faker.number.int({ min: 1, max: 20 }),
      incremento_estamina: faker.number.int({ min: 1, max: 20 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Habilidads', habilidades);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Habilidads', null, {});
  }
};
