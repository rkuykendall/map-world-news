'use strict';

const React = require('react');
const StoryList = require('./storyList.jsx');
const WorldMap = require('./worldMap.jsx');

module.exports = React.createClass({
  render: function() {
    let keys = Object.keys(this.props.countries);

    return <div className="app">
      <WorldMap
        countries={this.props.countries}
        topo={this.props.topo} />

      <div className="container">
        <div className="row">
          {keys.map(function(code) {
            return <StoryList stories={this.props.countries[code]} title={code} />;
          }, this)}
        </div>;
      </div>;
    </div>;
  }
});
