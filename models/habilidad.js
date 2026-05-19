import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Habilidad extends Model {
    static associate(models) {
      Habilidad.belongsToMany(models.Personaje, {
        through: models.PersonajeHabilidad,
        foreignKey: 'habilidadId',
        otherKey: 'personajeId',
      });
    }
  }
  Habilidad.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    incremento_ataque: DataTypes.INTEGER,
    incremento_defensa: DataTypes.INTEGER,
    incremento_estamina: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Habilidad',
  });
  return Habilidad;
};