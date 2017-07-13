const Sequelize = require('sequelize');
const database = require('../');

const MusicList = database.define('MusicList', {
  playId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    defaultValue: '제목없음',
  },
  description: {
    type: Sequelize.STRING,
    defaultValue: '설명없음',
  },
  thumbnailUrl: {
    type: Sequelize.STRING,
  },
  duration: {
    type: Sequelize.STRING,
  },
  state: {
    type: Sequelize.ENUM('READY', 'PLAYED'),
    defaultValue: 'READY',
  },
  kickVote: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  defaultScope: {
    where: {
      state: 'READY',
    },
    order: [['createdAt', 'ASC']],
  },
  scopes: {
    current: {
      state: 'PLAYED',
    },
  }
});

module.exports = MusicList;
