import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PersonajeHabilidad extends Model {
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