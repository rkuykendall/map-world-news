'use strict';

const React = require('react')
const Rainbow = require('rainbowvis.js');
const _ = require('lodash');

function dispNum(n) {
    return parseFloat(parseFloat(n).toFixed(1));
}

module.exports = React.createClass({
  getInitialState() {
    return {
      mWidth: 50,
      height: 360,
      width: 1000
    }
  },

  handleResize: function(e) {
    let w = $('#map').width();
    this.setState({
      mWidth: w,
      width: w,
      height:  this.state.mWidth * this.state.height / this.state.width
    })
  },

  componentDidMount() {
    this.setState({
      mWidth: $('#map').width()
    })
    window.addEventListener('resize', this.handleResize);

    let rainbow = new Rainbow();
    rainbow.setSpectrum('f61f55', '40dee3', '67ff8c');
    rainbow.setNumberRange(-200, 200);

    let keys = Object.keys(this.props.countries);
    for (let key of keys) {
      let sentiment = _.sum(this.props.countries[key], function(story) {
        return story.sentiment;
      });
      let stories = this.props.countries[key]
      let entry = d3.select('#' + key)

      if (entry.empty()) {
          this.props.log.error('Error. Country not found: ' + key);
      } else {
          let currentSentiment = parseFloat(entry.attr('sentiment'));
          currentSentiment = currentSentiment || 0;
          let newSentiment = currentSentiment + sentiment;
          entry.attr('sentiment', newSentiment);

          entry.style('fill', '#' + rainbow.colourAt(Math.round(newSentiment * 100)));
          $('#map').css('background-image', 'url("key.png")');
      }
    }
  },

  componentWillReceiveProps(nextProps) {
    // g.selectAll('#countries *').style('fill', null);
    // g.selectAll('#countries *').attr('sentiment', 0);
  },

  countryClicked(d) {
    this.props.countryClicked(d.id);
  },

  onMouseOver(d) {
    d3.select('#' + d.id).classed('selected', true);

    let sentiment = d3.select('#' + d.id).attr('sentiment');
    if (sentiment == null) {
      sentiment = 0;
    }

    if (sentiment < 0) {
      $('#countryInfo').html(d.properties.name + ', ' + dispNum(sentiment) + ' sentiment').css('display', 'block');
    } else if (sentiment > 0) {
      $('#countryInfo').html(d.properties.name + ', +' + dispNum(sentiment) + ' sentiment').css('display', 'block');
    } else {
      $('#countryInfo').html(d.properties.name).css('display', 'block');
    }
  },

  onMouseOut(d) {
    d3.select('#' + d.id).classed('selected', false);
    $('#countryInfo').html('').css('display', 'none');
  },

  render() {
    let {mWidth, height, width} = this.state;

    let projection = d3.geo.mercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    let path = d3.geo.path().projection(projection);

    return (
      <div id="map-background">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div id="map">
                <svg
                  preserveAspectRatio='xMidYMid'
                  viewBox={'0 0 ' + width + ' ' + height}
                  width={mWidth}
                  height={mWidth * height / width}>

                  <rect
                    className='background'
                    width={width}
                    height={height} />

                  <g id="countries">
                    {this.props.topo.map(function(d) {
                      return <path
                        id={d.id}
                        name={d.properties.name}
                        d={path(d)}
                        sentiment={0}
                        onClick={this.countryClicked.bind(this, d)}
                        onMouseOver={this.onMouseOver.bind(this, d)}
                        onMouseOut={this.onMouseOut.bind(this, d)} />;
                    }, this)}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div id="countryInfo"></div>
      </div>);
  }
});
