'use strict';

require('./style.less');
const jsLogger = require('js-logger');
const React = require('react');
const Rainbow = require('rainbowvis.js');
const NProgress = require('nprogress');
const App = require('./components/app.jsx')

let log = jsLogger;
log.useDefaults();

let topo = [];
let countries = {};
React.render(<App countries={countries} topo={topo} log={log} />, document.getElementById('app'));

$.get('countries.topo.json', function(data) {
  topo = topojson.feature(data, data.objects.countries).features
  React.render(<App countries={countries} topo={topo} log={log} />, document.getElementById('app'));
});

const CATEGORIES = {
  'Reuters': 'http://feeds.reuters.com/Reuters/worldNews',
  'Associated Press': 'http://hosted2.ap.org/atom/APDEFAULT/cae69a7523db45408eeb2b3a98c0c9c5',
  'BBC': 'http://feeds.bbci.co.uk/news/world/rss.xml',
  'Fox': 'http://feeds.foxnews.com/foxnews/world',
  'NPR': 'http://www.npr.org/rss/rss.php?id=1004',
  'USNews': 'http://www.usnews.com/rss/news',
  'CNN': 'http://rss.cnn.com/rss/cnn_world.rss',
  'NYTimes Middle East': 'http://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
  'NYTimes Europe': 'http://rss.nytimes.com/services/xml/rss/nyt/Europe.xml',
  'NYTimes Asia Pacific': 'http://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml',
  'NYTimes Africa': 'http://rss.nytimes.com/services/xml/rss/nyt/Africa.xml',
  'NYTimes Americas': 'http://rss.nytimes.com/services/xml/rss/nyt/Americas.xml'
}

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

  let url = 'http://localhost:5000/feeds';
  if (window.location.host == 'mapworldnews.com') {
    url = 'http://map-world-news.herokuapp.com/feeds';
  }

  let processed = 0;
  let keys = Object.keys(CATEGORIES);
  for (let key of keys) {
    $.post(url, { url: CATEGORIES[key] }, function(data) {
      $.post(url, { data: data }, function(data) {
        for (let story of data) {
          for (let country of story.countries) {
            if (!(country in countries)) {
              countries[country] = [];
            }
            countries[country].push(story);
          }
        }

        processed += 1;
        if (processed == keys.length) {
          NProgress.done();
        } else {
          NProgress.inc(0.8 / keys.length);
        }

        React.render(<App countries={countries} topo={topo} log={log} />, document.getElementById('app'));
      }, 'json');
    }).fail(function() {
      NProgress.done();
      log.error( 'Failure to getJSON for ' + url);
      $('#errors').slideDown().delay(30000).slideUp();
    });
  }
}
