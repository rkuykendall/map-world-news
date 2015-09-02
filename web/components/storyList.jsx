'use strict';

const React = require('react')
const Story = require('./story.jsx')

module.exports = React.createClass({
  render: function() {
    return <div class="story-list">
      <h3>{this.props.title}</h3>
      {this.props.stories.map(function(story) {
        return <Story {...story} />;
      })}
    </div>;
  }
});
