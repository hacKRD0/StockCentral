'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add unique composite index on UserId, StockMapperId, and Date
    await queryInterface.addIndex(
      'UserStocks',
      ['UserId', 'StockMapperId', 'Date'],
      {
        unique: true,
        name: 'user_stock_date_unique_index', // Optional: custom index name
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove the index if rolling back the migration
    await queryInterface.removeIndex(
      'UserStocks',
      'user_stock_date_unique_index'
    );
  },
};
