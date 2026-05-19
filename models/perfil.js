import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Perfil extends Model {
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