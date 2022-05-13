'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:*/
     await queryInterface.bulkInsert('Rols', [
	{ nombre: 'Administrador', createdAt: new Date(), updatedAt: new Date() },
	{ nombre: 'Encargado', createdAt: new Date(), updatedAt: new Date() },
	{ nombre: 'Ejecutivo', createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Contador', createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Usuario', createdAt: new Date(), updatedAt: new Date() }
     ], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:*/
      await queryInterface.bulkDelete('Rols', null, {});
     
  }
};
