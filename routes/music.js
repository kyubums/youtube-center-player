const express = require('express');
const router = express.Router();
const YouTube = require('youtube-node');
const Sequelize = require('sequelize');
const MusicList = require('../database/models/musicList');
const currentMusic = require('../object/currentMusic');
const player = require('../player');

var youtube = new YouTube();
youtube.setKey('AIzaSyA5eSgE-MJstvXLOXclivfQvSAEcnoCWws');

router.get('/', (req, res, next) => {
  MusicList.findAll()
    .then((musicList) => {
      res.send({
        currentMusic,
        musicList,
      });
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { playId } = req.body;
  youtube.getById(playId, (err, result) => {
    if (err || !result || !result.items[0]) {
      next(new Error('VIDEO NOT FOUND'));
    } else {
      const { id, snippet } = result.items[0];
      console.log(snippet);
      const { title, description, thumbnails, liveBroadcastContent } = snippet;
      if (liveBroadcastContent !== 'none') next(new Error('LIVE NOT ALLOWED'));
      else {
        MusicList.create({
          playId: id,
          title,
          description,
          thumbnailUrl: thumbnails.default.url,
        })
        .then(({ title }) => {
          res.send(title + ' 이 등록되었습니다.');
        })
        .catch(next);
      }
    }
  });
});

router.post('/vote', (req, res, next) => {
  const { id } = req.body;
  const VOTE_MAX = 10;

  MusicList.scope('current')
    .findById(id)
    .then(music => {
      if (!music) throw new Error('NO_MUSIC');

      return music.update({ kickVote: Sequelize.literal('kickVote +1') });
    })
    .then(() => MusicList.scope('current').findById(id))
    .then(({ kickVote }) => {
      if (kickVote >= VOTE_MAX) {
        player.next();
        res.send(kickVote+'명이 안좋아하여, 다음 노래로 넘어갑니다.');
      } else {
        const voteLeft = VOTE_MAX - kickVote;
        res.send(voteLeft + '명이 더 안좋아하면 다음노래로 넘길게요!');
      }
    })
    .catch(next);
});

module.exports = router;
