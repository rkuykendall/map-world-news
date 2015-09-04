'use strict';

const React = require('react')
const Rainbow = require('rainbowvis.js');

function dispNum(n) {
    return parseFloat(parseFloat(n).toFixed(1));
}

module.exports = React.createClass({
  render: function() {
    let {countries, sentiment, title, link} = this.props;

    let rainbow = new Rainbow();
    rainbow.setSpectrum('f61f55', '40dee3', '67ff8c');
    rainbow.setNumberRange(-10, 10);
    let styles = {
      'borderColor': '#' + rainbow.colourAt(Math.round(sentiment))
    }

    let sentFmt = parseFloat(parseFloat(sentiment).toFixed(1));
    if (sentFmt > 0) {
      sentFmt = '+' + sentFmt;
    }

    return <div className="story" style={styles}>
      <h5><a href={link} target="_blank">{title}</a></h5>
      <strong>
        {sentFmt} sentiment {countries.length > 0 ? ' for ' + countries.join(', ') : '' }
      </strong>
      <p>{this.props.summary}</p>
    </div>;
  }
});
