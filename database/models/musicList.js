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
    defaultValue: 0,
  },
  comment: {
    type: Sequelize.STRING,
    defaultValue: '코멘트없음',
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  }
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
