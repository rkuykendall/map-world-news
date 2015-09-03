'use strict';

const React = require('react')
const Story = require('./story.jsx')

module.exports = React.createClass({
  render: function() {
    return <div className="story-list col-sm-12 col-md-12">
      <h3>{this.props.title}</h3>
      <div style={{'column-count': 3}}>
      {this.props.stories.map(function(story) {
        return <Story {...story} />;
      })}
      </div>
    </div>;
  }
});
