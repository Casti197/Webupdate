import Sequelize from 'sequelize';
import config from '../config/config.js';

// Import model factories
import habilidadFactory from './habilidad.cjs';
import perfilFactory from './perfil.cjs';
import personajeFactory from './personaje.cjs';
import personajeHabilidadFactory from './personajehabilidad.cjs';
import usuarioFactory from './usuario.cjs';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const db = {};

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else if (dbConfig.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbConfig.storage || './database.sqlite',
    ...dbConfig
  });
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

// Initialize models
const models = [
  habilidadFactory,
  perfilFactory,
  personajeFactory,
  personajeHabilidadFactory,
  usuarioFactory
];

for (const factory of models) {
  const model = factory(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
