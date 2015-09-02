'use strict';

const React = require('react')

function dispNum(n) {
    return parseFloat(parseFloat(n).toFixed(1));
}

module.exports = React.createClass({
  render: function() {
    let countriesPrint = this.props.countries.join(', ');

    let tag = '';
    if (this.props.sentiment > 0) {
        tag = '+' + dispNum(this.props.sentiment) + ' sentiment';
        if (this.props.countries.length > 0) {
            tag +=  ' for ' + countriesPrint;
        }
        tag += '.';
    } else if (this.props.sentiment < 0) {
        tag = Math.floor(this.props.sentiment) + ' sentiment';
        if (this.props.countries.length > 0) {
            tag +=  ' for ' + countriesPrint;
        }
        tag += '.';
    } else {
        if (this.props.countries.length > 0) {
            tag = countriesPrint + ' mentioned.';
        }
    }

    return <div className="story col-sm-12 col-md-4">
      <h5><a href="{this.props.link}" target="_blank">{this.props.title}</a></h5>
      <strong>{tag}</strong>
      <p>{this.props.summary}</p>
    </div>;
  }
});
