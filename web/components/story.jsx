'use strict';

const React = require('react')
const Rainbow = require('rainbowvis.js');

function dispNum(n) {
    return parseFloat(parseFloat(n).toFixed(1));
}

module.exports = React.createClass({
  render: function() {
    let rainbow = new Rainbow();
    rainbow.setSpectrum('f61f55', '40dee3', '67ff8c');
    rainbow.setNumberRange(-200, 200);

    let color = rainbow.colourAt(Math.round(this.props.sentiment * 100));


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


    let styles = {
      'borderColor': '#' + color
    }

    return <div className="col-sm-12 col-md-4">
      <div className="story" style={styles}>
        <h5><a href="{this.props.link}" target="_blank">{this.props.title}</a></h5>
        <strong>{tag}</strong>
        <p>{this.props.summary}</p>
      </div>
    </div>;
  }
});
