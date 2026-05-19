'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonajeHabilidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PersonajeHabilidad.init({
    personajeId: DataTypes.INTEGER,
    habilidadId: DataTypes.INTEGER,
    nivel: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PersonajeHabilidad',
  });
  return PersonajeHabilidad;
};