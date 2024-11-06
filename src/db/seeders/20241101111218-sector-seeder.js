'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Sectors',
      [
        {
          name: 'Unknown',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Technology',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Healthcare',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Finance',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
