const Stream = require('youtube-audio-stream');
const Decoder = require('lame').Decoder;
const Speaker = require('speaker');
const Volume = require('pcm-volume');

const MusicList = require('../database/models/musicList');
const currentMusic = require('../object/currentMusic');

let playStream = null;
let decoder = Decoder();
let volume = Volume();
let speaker = Speaker();
let worker = null;

const BASE_URL = 'http://youtube.com/watch?v=';
const WORK_INTERVAL = 1000 * 10;

const player = {
  start() {
    if (worker) {
      console.log('WORKER ALREADY WOKRING NOW!');
      return;
    }

    worker = setInterval(() => {
      if (currentMusic.id) {
        return;
      }
      player.next();
    }, WORK_INTERVAL);
  },
  play(id) {
    try {
      playStream = Stream(BASE_URL + id);

      playStream.on('finish', () => {
        setTimeout(() => {
          player.next();
        }, 1000)
      });
      volume.setVolume(currentMusic.volume);

      playStream.pipe(decoder)
      .pipe(volume)
      .pipe(speaker);

      return true;
    } catch (e) {
      console.log(e);
      setTimeout(() => {
        player.next();
      }, 1000)
      return false;
    }
  },
  stop() {
    if (!playStream) {
      return;
    }

    playStream.unpipe(speaker);
    playStream.unpipe(decoder);
    speaker.end();
    decoder.end();
    playStream.end();

    decoder = Decoder();
    volume = Volume();
    speaker = Speaker();
  },
  next() {
    player.stop();
    MusicList.findOne()
      .then((music) => {
        if (!music) throw new Error('NO_MUSIC');

        const { id, title, description, thumbnailUrl } = music;
        Object.assign(currentMusic, { id, title, description, thumbnailUrl });
        return music.update({ state: 'PLAYED' });
      })
      .then((music) => {
        if (!player.play(music.playId)) throw new Error('PLAY_FAILED');

        console.log('PLAY_SUCCESS');
      })
      .catch((err) => {
        Object.assign(currentMusic, { id: null, title: null, description: null, thumbnailUrl: null });
        console.log(err.message);
      });
  },
  setVolume(v) {
    if (v > 1 || v < 0) {
      return false;
    }

    volume.setVolume(v);
    return true;
  }
}

module.exports = player;
