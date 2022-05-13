'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Cliente.init({    
    nombres: DataTypes.STRING,
    direccion: DataTypes.STRING,
    tipo: DataTypes.STRING,
    nit: DataTypes.STRING,
    nombreNit: DataTypes.STRING,
    estado: DataTypes.STRING,
    filename: DataTypes.STRING,
    telefono: DataTypes.STRING,
    codigo: DataTypes.STRING,
    pais: DataTypes.STRING,	  
    ciudad: DataTypes.STRING,	  
    email: DataTypes.STRING,
    web: DataTypes.STRING,	  
    observaciones: DataTypes.STRING,                
    licencia: DataTypes.STRING,
    fechaInicio:DataTypes.DATE,
    fechaVencimiento:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Cliente',
  });
  return Cliente;
};
