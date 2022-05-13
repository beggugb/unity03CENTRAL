'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
    }
  };
  Usuario.init({
    nombres: DataTypes.STRING,
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    estado: DataTypes.BOOLEAN,        
    isCajero: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Usuario',
  });


  Usuario.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch){
      if(err){
        return cb(err);
      }
      cb(null,isMatch);
    })
  };
  
  Usuario.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });
  Usuario.beforeUpdate((user, options) => {
    console.log('popop')
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });

  return Usuario;
};