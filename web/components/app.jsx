'use strict';

const React = require('react');
const StoryList = require('./storyList.jsx');
const WorldMap = require('./worldMap.jsx');
const countries = require('country-data').countries

module.exports = React.createClass({
  getInitialState() {
    return {
      country: null
    }
  },

  countryClicked(id) {
    this.setState({
      country: id
    });
  },

  onPropsChange() {
    this.props.log.info(this.props);
  },

  render: function() {
    let keys = Object.keys(this.props.countries);
    let code = this.state.country;

    return <div className="app">
      <WorldMap
        {...this.props}
        countryClicked={this.countryClicked}
        width={1000}
        height={360} />

      {code &&
        <div className="container">
          <div className="row">
              <StoryList stories={this.props.countries[code]} id={code} title={countries[code].name} log={this.props.log} />
          </div>
        </div>
      }
    </div>
  }
});
