const React = require('react');
const Reflux = require('reflux');
const StoryList = require('./storyList.jsx');
const WorldMap = require('./worldMap.jsx');
const Feeds = require('./feeds.jsx');
const FeedStore = require('../stores/feedStore.es6');
const countryNames = require('country-data').countries

module.exports = React.createClass({
  mixins: [Reflux.connect(FeedStore, 'feedstore')],

  getInitialState() {
    return {
      selected: null
    }
  },

  countryClicked(id) {
    this.setState({
      selected: id
    });
  },

  render: function() {
    let {selected, feedstore} = this.state;
    let {log} = this.props;

    let feeds = {};
    let countries = {};
    let keys = {}
    if (this.state.feedstore) {
      feeds = this.state.feedstore.feeds;
      countries = this.state.feedstore.countries
      keys = Object.keys(countries);
    }

    return <div className="app">
      <WorldMap
        countries={countries}
        topo={this.props.topo}
        countryClicked={this.countryClicked}
        width={1000}
        height={360} />

      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-4">
            <Feeds feeds={feeds} log={log} />
          </div>

          <div className="col-sm-12 col-md-8">
            {selected ?
              <StoryList stories={countries[selected]} id={selected} title={countryNames[selected].name} log={log} />
              : <h3>Select a country to see stories.</h3>
            }
          </div>
        </div>
      </div>
    </div>
  }
});
