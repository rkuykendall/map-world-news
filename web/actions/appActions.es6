const Reflux = require('reflux');

let appActions = Reflux.createActions([
  'fetchFeed',
  'countryClicked'
]);

module.exports = appActions;
