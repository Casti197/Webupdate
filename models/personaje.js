import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Personaje extends Model {
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