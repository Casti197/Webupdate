import 'dotenv/config';

const config = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

export default config;
