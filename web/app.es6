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

$.get('countries.topo.json', function(data) {
  topo = topojson.feature(data, data.objects.countries).features
});

const CATEGORIES = {
  'World News': 'http://feeds.reuters.com/Reuters/worldNews',
  'US News': 'http://feeds.reuters.com/Reuters/domesticNews',
  'Top News': 'http://feeds.reuters.com/reuters/MostRead',
  'Politics': 'http://feeds.reuters.com/Reuters/PoliticsNews'
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

  requestStories('World News');
});

function requestStories(slug) {
  NProgress.start();

  $('#footer').css('border-top', '1px solid #ddd');

  let url = 'http://localhost:5000/feeds';
  if (window.location.host == 'mapworldnews.com') {
    url = 'http://map-world-news.herokuapp.com/feeds';
  }

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
        NProgress.done();
        React.render(<App countries={countries} topo={topo} log={log} />, document.getElementById('app'));
      }, 'json');
    }).fail(function() {
      NProgress.done();
      log.error( 'Failure to getJSON for ' + url);
      $('#errors').slideDown().delay(30000).slideUp();
    });
  }
}
