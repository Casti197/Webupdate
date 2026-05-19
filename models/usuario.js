import { Model } from 'sequelize';
import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasOne(models.Perfil, { foreignKey: 'usuarioId' });
    }
  }
  Usuario.init({
    username: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', value);
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'USER'
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    hooks: {
      beforeSave: async (usuario) => {
        if (usuario.changed('password')) {
          const hash = await bcrypt.hash(usuario.password, 10);
          usuario.password = hash;
        }
      }
    }
  });
  return Usuario;
};