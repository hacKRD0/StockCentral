'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcrypt'); // For hashing passwords

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'Amit Sharma',
        email: 'amit.sharma@example.in',
        password: await bcrypt.hash('password123', 10),
        role: 0, // User
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Priya Verma',
        email: 'priya.verma@example.in',
        password: await bcrypt.hash('password123', 10),
        role: 0, // User
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Rahul Gupta',
        email: 'rahul.gupta@example.in',
        password: await bcrypt.hash('password123', 10),
        role: 1, // Admin
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sneha Iyer',
        email: 'sneha.iyer@example.in',
        password: await bcrypt.hash('password123', 10),
        role: 0, // User
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@example.in',
        password: await bcrypt.hash('password123', 10),
        role: 1, // Admin
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
