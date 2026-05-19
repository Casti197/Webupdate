'use strict';
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
      Usuario.hasOne(models.Perfil, { foreignKey: 'usuarioId' });
    }
  }
  Usuario.init({
    username: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        // We will hash in hooks for better control, or here.
        // Hooks are better for bulk operations too if properly configured.
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
          const bcrypt = require('bcrypt');
          const hash = await bcrypt.hash(usuario.password, 10);
          usuario.password = hash;
        }
      }
    }
  });
  return Usuario;
};