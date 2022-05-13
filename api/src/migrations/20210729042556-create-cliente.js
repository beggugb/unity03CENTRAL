'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Clientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombres: {
        type: Sequelize.STRING
      },
      direccion: {
        type: Sequelize.STRING
      },
      tipo: {
        type: Sequelize.STRING
      },
      nit: {
        type: Sequelize.STRING
      },
      nombreNit: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      licencia: {
        type: Sequelize.STRING
      },
      fechaInicio: {        
        type: Sequelize.DATE
      },
      fechaVencimiento: {        
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Clientes');
  }
};