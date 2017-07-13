const MusicList = require('./models/musicList');

MusicList.sync({ force: true });
