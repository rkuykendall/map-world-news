const Reflux = require('reflux');

let appActions = Reflux.createActions([
  'fetchFeed',
  'countryClicked',
  'feedClicked'
]);

module.exports = appActions;
