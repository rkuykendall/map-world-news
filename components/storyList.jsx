const React = require('react')
const Story = require('./story.jsx')

module.exports = React.createClass({
  render: function() {
    let {stories, title, id, log} = this.props;

    let positives = _.dropRightWhile(_.sortBy(stories, 'sentiment').reverse(), function(story) {
      return story.sentiment < 0;
    });

    let negatives = _.dropRightWhile(_.sortBy(stories, 'sentiment'), function(story) {
      return story.sentiment >= 0;
    });

    return <div id={id} className="story-list">
      <h3>{title}</h3>
      <div className="row">
        <div className='col-sm-12 col-md-6'>
          {positives.length > 0 ?
            positives.map(function(story) {
              return <Story key={story.link} {...story} />
            })
          : <p>No positve stories were found which mention {title}</p>}
        </div>
        <div className='col-sm-12 col-md-6'>
          {negatives.length > 0 ?
            negatives.map(function(story) {
              return <Story key={story.link} {...story} />
            })
          : <p>No negative stories were found which mention {title}</p>}
        </div>
      </div>
    </div>;
  }
});
