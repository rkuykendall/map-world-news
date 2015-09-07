const React = require('react')
const countryNames = require('country-data').countries

module.exports = React.createClass({
  render: function() {
    let {countries, log, countryClicked} = this.props;
    let keys = [];
    if (countries) {
      keys = Object.keys(countries);
    }

    return <div className="country-list">
      <h3>Select a country to see stories.</h3>
      <ul>
        {keys && keys.map(function(key) {
            return <li className="clickable" onClick={countryClicked.bind(this, key)}>{countryNames[key].name}</li>
          })
        }
      </ul>
      </div>;
  }
});
