'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Perfil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Perfil.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      Perfil.hasMany(models.Personaje, { foreignKey: 'perfilId' });
    }
  }
  Perfil.init({
    biografia: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Perfil',
  });
  return Perfil;
};