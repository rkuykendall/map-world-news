const Reflux = require('reflux');

let appActions = Reflux.createActions([
  'fetchFeed',
  'countryClicked',
  'feedClicked',
  'deselectCountry'
]);

module.exports = appActions;
