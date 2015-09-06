const Reflux = require('reflux');
const $ = require('jquery');
const NProgress = require('nprogress');
const AppActions = require('../actions/appActions.es6');
const defaultFeeds = require('./defaultFeeds.es6');

let AppStore = Reflux.createStore({
  listenables: [AppActions],
  feeds: defaultFeeds,
  countries: {},
  selected: null,
  url: window.location.host.indexOf('.com') == -1 ? 'localhost:5000' : 'map-world-news.herokuapp.com',
  processing: 0,
  total: 0,

  init() {
    this.listenTo(AppActions.countryClicked, 'onCountryClicked');

    let keys = Object.keys(this.feeds);
    this.total = keys.length;
    NProgress.start();
    for (let key of keys) {
      this.fetchFeed(key);
    }
  },

  onCountryClicked(id) {
    this.selected = id;
    this.trigger(this);
  },

  getInitialState() {
    return {
      feeds: defaultFeeds,
      countries: {},
      selected: null
    }
  },

  feedsToCountries() {
    // Take in a list of feeds with data
    // Output a hash of countries with all associated stories
    let feeds = this.feeds;
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

    this.countries = countriesNew;
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
    this.trigger(this);
  },

  fetchFeed(id) {
    this.processing += 1;
    if (this.total == 0) {
      this.total = 1;
      NProgress.start();
    }

    let api = 'http://' + this.url + '/feeds';
    let newFeed = this.feeds[id];
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

    this.feeds[id] = newFeed;
  }
});

module.exports = AppStore;
