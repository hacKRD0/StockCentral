'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('StockMasters', [
      // Entries for Stock 1 (Reliance)
      {
        UserId: 1,
        BrokerageId: 1, // Brokerage 1
        // StockReferenceId: 1, // Stock Reference: Reliance
        BrokerageCode: 'RELIANCE',
        BrokerageSector: 'Energy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 1,
        BrokerageId: 2, // Brokerage 2
        // StockReferenceId: 1, // Stock Reference: Reliance
        BrokerageCode: 'RIL',
        BrokerageSector: 'Energy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Entries for Stock 2 (TCS)
      {
        UserId: 1,
        BrokerageId: 1, // Brokerage 1
        // StockReferenceId: 2, // Stock Reference: TCS
        BrokerageCode: 'TCS',
        BrokerageSector: 'Information Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 1,
        BrokerageId: 3, // Brokerage 3
        // StockReferenceId: 2, // Stock Reference: TCS
        BrokerageCode: 'TCS',
        BrokerageSector: 'Information Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Entries for Stock 3 (HDFC Bank)
      {
        UserId: 1,
        BrokerageId: 2, // Brokerage 2
        // StockReferenceId: 3, // Stock Reference: HDFC Bank
        BrokerageCode: 'HDFCBANK',
        BrokerageSector: 'Banking',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 1,
        BrokerageId: 3, // Brokerage 3
        // StockReferenceId: 3, // Stock Reference: HDFC Bank
        BrokerageCode: 'HDFCBNK',
        BrokerageSector: 'Banking',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // More entries for the same stock with different brokerages
      {
        UserId: 1,
        BrokerageId: 1, // Brokerage 1
        // StockReferenceId: 3, // Stock Reference: HDFC Bank
        BrokerageCode: 'HDFCBANK',
        BrokerageSector: 'Banking',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('StockMasters', null, {});
  },
};
