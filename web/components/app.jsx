const React = require('react');
const Reflux = require('reflux');
const StoryList = require('./storyList.jsx');
const WorldMap = require('./worldMap.jsx');
const Feeds = require('./feeds.jsx');
const AppStore = require('../stores/appStore.es6');
const AppActions = require('../actions/appActions.es6');
const countryNames = require('country-data').countries

module.exports = React.createClass({
  mixins: [Reflux.connect(AppStore)],

  render: function() {
    let {selected, feeds, countries} = this.state;
    let {log, topo} = this.props;

    if (!this.state.feeds) {
      let feeds = [];
      let countries = {};
      let selected = null;
    }

    return <div className="app">
      <WorldMap
        countries={countries}
        topo={topo}
        countryClicked={AppActions.countryClicked}
        width={1000}
        height={360} />

      <div className="container">
        <div className="row">
          <div id="errors" className="col-sm-12 col-md-12">
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;Problem retrieving one of your feeds.
              &nbsp;Please wait a few seconds and try again.
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 col-md-4">
            <Feeds feeds={feeds} log={log} feedClicked={AppActions.feedClicked} />
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
