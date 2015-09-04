'use strict';

require('./style.less');
const jsLogger = require('js-logger');
const React = require('react');
const Rainbow = require('rainbowvis.js');
const NProgress = require('nprogress');
const App = require('./components/app.jsx')

let log = jsLogger;
log.useDefaults();

const feeds = [
  {
  	name: 'Reuters',
  	url: 'http://feeds.reuters.com/Reuters/worldNews',
  	data: [],
  	fetched: false
  },
  {
  	name: 'Associated Press',
  	url: 'http://hosted2.ap.org/atom/APDEFAULT/cae69a7523db45408eeb2b3a98c0c9c5',
  	data: [],
  	fetched: false
  },
  {
  	name: 'BBC',
  	url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
  	data: [],
  	fetched: false
  },
  {
  	name: 'Fox',
  	url: 'http://feeds.foxnews.com/foxnews/world',
  	data: [],
  	fetched: false
  },
  {
  	name: 'NPR',
  	url: 'http://www.npr.org/rss/rss.php?id=1004',
  	data: [],
  	fetched: false
  },
  {
  	name: 'USNews',
  	url: 'http://www.usnews.com/rss/news',
  	data: [],
  	fetched: false
  },
  {
  	name: 'CNN',
  	url: 'http://rss.cnn.com/rss/cnn_world.rss',
  	data: [],
  	fetched: false
  },
  {
  	name: 'NYTimes Middle East',
  	url: 'http://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
  	data: [],
  	fetched: false
  },
  {
  	name: 'NYTimes Europe',
  	url: 'http://rss.nytimes.com/services/xml/rss/nyt/Europe.xml',
  	data: [],
  	fetched: false
  },
  {
  	name: 'NYTimes Asia Pacific',
  	url: 'http://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml',
  	data: [],
  	fetched: false
  },
  {
  	name: 'NYTimes Africa',
  	url: 'http://rss.nytimes.com/services/xml/rss/nyt/Africa.xml',
  	data: [],
  	fetched: false
  },
  {
    name: 'NYTimes Americas',
    url: 'http://rss.nytimes.com/services/xml/rss/nyt/Americas.xml',
    data: [],
    fetched: false
  }
]

let topo = [];
let countries = {};
React.render(<App countries={countries} topo={topo} log={log} feeds={feeds} />, document.getElementById('app'));

$.get('countries.topo.json', function(data) {
  topo = topojson.feature(data, data.objects.countries).features
  React.render(<App countries={countries} topo={topo} log={log} feeds={feeds} />, document.getElementById('app'));
});

function dispNum(n) {
  return parseFloat(parseFloat(n).toFixed(1));
}

$(document).ready(function () {
  $('#countryInfo').html('').css('display', 'none');

  $('.slug').click(function(event) {
    requestStories($(this).text());
    event.preventDefault();
    return false;
  });

  requestStories();
});

function requestStories() {
  NProgress.start();

  $('#footer').css('border-top', '1px solid #ddd');

  let api = 'http://localhost:5000/feeds';
  if (window.location.host == 'mapworldnews.com') {
    api = 'http://map-world-news.herokuapp.com/feeds';
  }

  let processed = 0;
  for (let feed of feeds) {
    $.post(api, { url: feed.url }, function(data) {
      $.post(api, { data: data }, function(data) {
        feed.data = data;
        feed.fetched = true;

        for (let story of data) {
          for (let country of story.countries) {
            if (!(country in countries)) {
              countries[country] = [];
            }
            countries[country].push(story);
          }
        }

        processed += 1;
        if (processed == feeds.length) {
          NProgress.done();
        } else {
          NProgress.inc(0.8 / feeds.length);
        }

        React.render(<App countries={countries} topo={topo} log={log} feeds={feeds} />, document.getElementById('app'));
      }, 'json');
    }).fail(function() {
      NProgress.done();
      log.error( 'Failure to getJSON for ' + url);
      $('#errors').slideDown().delay(30000).slideUp();
    });
  }
}
