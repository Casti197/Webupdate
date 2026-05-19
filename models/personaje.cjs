'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Personaje extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Personaje.belongsTo(models.Perfil, { foreignKey: 'perfilId' });
      Personaje.belongsToMany(models.Habilidad, {
        through: models.PersonajeHabilidad,
        foreignKey: 'personajeId',
        otherKey: 'habilidadId',
      });
    }
  }
  Personaje.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    ataque: DataTypes.INTEGER,
    defensa: DataTypes.INTEGER,
    estamina: DataTypes.INTEGER,
    perfilId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Personaje',
  });
  return Personaje;
};