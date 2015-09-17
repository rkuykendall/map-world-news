const React = require('react')
const log = require('../log.es6')

module.exports = React.createClass({
  render: function() {
    let {feeds} = this.props;
    let keys = [];
    if (feeds) {
      keys = Object.keys(feeds).sort();
    }

    return <div className="feed-list">
      <h3>News Feeds</h3>
      <ul>
        {keys && keys.map(function(key) {
          return <li
              onMouseDown={this.props.feedClicked.bind(this, key, !feeds[key].show)}
              key={key}
              className={'clickable ' + feeds[key].class}>
            <span>
              {key}
              <span className='light'> {feeds[key].subtitle}</span>
              {feeds[key].show ? <span className='light'> Click to hide</span> : ' Click to show'}
            </span>
          </li>
        }, this)}
      </ul>
    </div>;
  }
});
