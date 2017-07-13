const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  storage: './database/music.sqlite',
});

module.exports = sequelize;
