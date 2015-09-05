'use strict';

require('./style.less');
const jsLogger = require('js-logger');
const React = require('react');
const Rainbow = require('rainbowvis.js');
const App = require('./components/app.jsx')

let log = jsLogger;
log.useDefaults();

let topo = [];
React.render(<App topo={topo} log={log} />, document.getElementById('app'));

$.get('countries.topo.json', function(data) {
  topo = topojson.feature(data, data.objects.countries).features
  React.render(<App topo={topo} log={log} />, document.getElementById('app'));
});
