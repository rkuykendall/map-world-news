const Reflux = require('reflux');
const $ = require('jquery');
const NProgress = require('nprogress');
const FeedActions = require('../actions/feedActions.es6');
const defaultFeeds = require('./defaultFeeds.es6');

let FeedStore = Reflux.createStore({
  listenables: [FeedActions],
  feedstore: {
    feeds: defaultFeeds,
    countries: {}
  },
  url: window.location.host.indexOf('.com') == -1 ? 'localhost:5000' : 'map-world-news.herokuapp.com',
  processing: 0,
  total: 0,

  init() {
    this.trigger(this.feedstore);
    let keys = Object.keys(this.feedstore.feeds);
    this.total = keys.length;
    for (let key of keys) {
      this.fetchFeed(key);
    }
  },

  feedsToCountries() {
    // Take in a list of feeds with data
    // Output a hash of countries with all associated stories
    let feeds = this.feedstore.feeds;
    let countriesNew = {};

    let keys = Object.keys(feeds);
    for (let key of keys) {
      let feed = feeds[key];
      for (let story of feed.data) {
        for (let country of story.countries) {
          if (!(country in countriesNew)) {
            countriesNew[country] = [];
          }
          countriesNew[country].push(story);
        }
      }
    }

    this.feedstore.countries = countriesNew;
  },

  completedGet() {
    this.processing = this.processing - 1;
    if (this.processing == 0) {
      this.total = 0;
      NProgress.done();
    } else {
      NProgress.inc(0.8 / this.total);
    }
    this.feedsToCountries();
    this.trigger(this.feedstore);
  },

  fetchFeed(id) {
    if (this.processing == 0) {
      this.total = 0;
      NProgress.start();
    }
    this.processing += 1;

    let api = 'http://' + this.url + '/feeds';
    let newFeed = this.feedstore.feeds[id];
    let completedGet = this.completedGet;
    newFeed.show = true;

    $.post(api, { url: newFeed.url }, function(data) {
      $.post(api, { data: data }, function(data) {
        newFeed.data = data;
        newFeed.fetched = true;
        completedGet()
      }, 'json');
    }).fail(function() {
      completedGet()
      newFeed.failed = true;
      // log.error( 'Failure to getJSON for ' + id);
      $('#errors').slideDown().delay(30000).slideUp();
    });

    this.feedstore.feeds[id] = newFeed;
  }
});

module.exports = FeedStore;
