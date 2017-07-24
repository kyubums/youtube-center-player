const _ = require('lodash');
const moment = require('moment');
const YouTube = require('youtube-node');
const Promise = require('bluebird');

const youtube = new YouTube();
youtube.setKey('AIzaSyA5eSgE-MJstvXLOXclivfQvSAEcnoCWws');

const getById = (videoId) => {
  return new Promise((resolve, reject) => {
    youtube.getById(videoId, (err, result) => {
      if (err || !result) {
        console.log(err);
        reject(new Error('VIDEO NOT FOUND'));
      } else {
        const list = result.items.map((item) => {
          const { id, snippet, contentDetails } = item;
          const { title, channelTitle, description, thumbnails, liveBroadcastContent } = snippet;
          const duration = moment.duration(contentDetails.duration);
          const durationText = duration.get('hours') + ':'
            + duration.get('minutes') + ':'
            + duration.get('seconds');

          return {
            id,
            title,
            channelTitle,
            description,
            thumbnails,
            isLive: liveBroadcastContent !== 'none',
            duration: duration.valueOf(),
            durationText,
          };
        })

        resolve(list);
      }
    });
  });
}

const searchIds = (searchText, option = {}) => {
  option.part = 'id';

  return new Promise((resolve, reject) => {
    youtube.search(searchText, 20, option, (err, result) => {
      if (err) {
        console.log(err);
        reject(new Error('SEARCH_ERR'));
      } else {
        const { nextPageToken, items } = result;
        const ids = _.chain(items)
          .map((item) => {
            if (item.id.kind !== 'youtube#video') return null;
            return item.id.videoId;
          })
          .compact()
          .value();
        resolve({ nextPageToken, ids });
      }
    });
  });
};

const search = (searchText, option = {}) => {
  return searchIds(searchText, option)
    .then(({ nextPageToken, ids }) => {
      const idString = ids.join(',');

      return [nextPageToken, getById(idString)];
    })
    .spread((nextPageToken, videos) => {
      return { nextPageToken, videos };
    });
}

module.exports = {
  getById,
  searchIds,
  search,
}
