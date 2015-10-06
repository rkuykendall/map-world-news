require('./style.less');
const React = require('react');
const Rainbow = require('rainbowvis.js');
const NProgress = require('nprogress');
const App = require('./components/app.jsx')
const log = require('./log.es6')
const $ = require('jquery');

let topo = [];
NProgress.configure({ easing: 'ease', speed: 1500 });
NProgress.start();
React.render(<App topo={topo} />, document.getElementById('app'));

$.get('countries.topo.json', function(data) {
  topo = topojson.feature(data, data.objects.countries).features
  React.render(<App topo={topo} />, document.getElementById('app'));
});
