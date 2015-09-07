'use strict';

require('./style.less');
const React = require('react');
const Rainbow = require('rainbowvis.js');
const App = require('./components/app.jsx')
const log = require('./log.es6')

let topo = [];
React.render(<App topo={topo} />, document.getElementById('app'));

$.get('countries.topo.json', function(data) {
  topo = topojson.feature(data, data.objects.countries).features
  React.render(<App topo={topo} />, document.getElementById('app'));
});
