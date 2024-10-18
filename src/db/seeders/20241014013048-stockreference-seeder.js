'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('StockReferences', [
      {
        name: 'Reliance Industries',
        code: 'RELIANCE',
        sector: 'Energy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tata Consultancy Services',
        code: 'TCS',
        sector: 'Information Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'HDFC Bank',
        code: 'HDFCBANK',
        sector: 'Banking',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Infosys',
        code: 'INFY',
        sector: 'Information Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ICICI Bank',
        code: 'ICICIBANK',
        sector: 'Banking',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hindustan Unilever',
        code: 'HINDUNILVR',
        sector: 'Consumer Goods',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bharti Airtel',
        code: 'BHARTIARTL',
        sector: 'Telecommunications',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Maruti Suzuki',
        code: 'MARUTI',
        sector: 'Automobile',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Asian Paints',
        code: 'ASIANPAINT',
        sector: 'Consumer Goods',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Larsen & Toubro',
        code: 'LT',
        sector: 'Infrastructure',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('StockReferences', null, {});
  },
};
