const _ = require('lodash');
const express = require('express');
const moment = require('moment');
const Sequelize = require('sequelize');
const MusicList = require('../database/models/musicList');
const currentMusic = require('../object/currentMusic');
const YouTube = require('../youtube');
const player = require('../player');

const router = express.Router();

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
  const { playId, comment, username } = req.body;
  const MAX_DURATION = 1000 * 60 * 60; // 넉넉하게 1시간 까지

  YouTube.getById(playId)
    .then(_.head)
    .then((video) => {
      const { id, title, channelTitle, thumbnails, isLive, duration, durationText } = video;
      if (duration > MAX_DURATION) throw new Error('MUSIC TOO LONG');
      if (isLive) throw new Error('LIVE NOT ALLOWED');

      return MusicList.create({
        playId: id,
        title,
        thumbnailUrl: thumbnails.default.url,
        duration: durationText,
        comment,
        username,
      });
    })
    .then(({ title }) => {
      res.send(title + ' 이 등록되었습니다.');
    })
    .catch(next);
});

router.get('/search/:searchText', (req, res, next) => {
  const { searchText } = req.params;
  const numResult = 10;
  const option = {};
  if (req.query.page) {
    option.pageToken = req.query.page;
  }
  YouTube.search(searchText, option)
    .then((result) => {
      res.send(result);
    })
    .catch(next);
});

router.post('/vote', (req, res, next) => {
  const { id } = req.body;
  const VOTE_MAX = 4;

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

router.post('/volume', (req, res, next) => {
  const { v } = req.body;
  if (!player.setVolume(v)) {
    return next(new Error('INVALID VOLUME'));
  }
  currentMusic.volume = v;
  res.send('volume changed');
});

module.exports = router;
