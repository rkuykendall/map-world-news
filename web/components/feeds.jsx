const React = require('react')

module.exports = React.createClass({
  render: function() {
    let {feeds, log} = this.props;
    let keys = [];
    if (feeds) {
      keys = Object.keys(feeds);
      keys.sort();
    }

    return <div className="feed-list">
      <h3>News Feeds</h3>
      <ul>
        {keys && keys.map(function(key) {
          return <li
              onMouseDown={this.props.feedClicked.bind(this, key, !feeds[key].show)}
              key={key}
              className={feeds[key].class}>
            <span>{key} <span className='light'>{feeds[key].subtitle}</span></span>
          </li>
        }, this)}
      </ul>
    </div>;
  }
});
