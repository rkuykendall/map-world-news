const React = require('react')

module.exports = React.createClass({
  render: function() {
    let {feeds, log} = this.props;
    let keys = [];
    if (feeds) {
      keys = Object.keys(feeds);
    }

    return <div className="feed-list">
      <h3>News Feeds</h3>
      <ul>
        {keys && keys.map(function(key) {
          return <li
              onMouseDown={this.props.feedClicked.bind(this, key, !feeds[key].show)}
              key={key}
              className={(feeds[key].fetched ? 'loaded' : 'loading') + (feeds[key].show ? '' : ' unselected')}>
            {feeds[key].data && feeds[key].data.length > 0 ?
              <span>{key} <span className='light'>({feeds[key].data.length})</span></span>
              : key}
          </li>
        }, this)}
      </ul>
    </div>;
  }
});
