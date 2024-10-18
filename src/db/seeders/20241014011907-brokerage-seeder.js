'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Brokerages', [
      {
        name: 'Zerodha',
        code: 'ZD',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ShareKhan',
        code: 'SK',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Groww',
        code: 'GW',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'UpStox',
        code: 'UP',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Brokerages', null, {});
  },
};
