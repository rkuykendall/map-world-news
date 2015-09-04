'use strict';

const React = require('react')
const Rainbow = require('rainbowvis.js');
const _ = require('lodash');

module.exports = React.createClass({
  getSentiments(countries) {
    let newSentiments = {};
    let newFills = {};

    let keys = Object.keys(countries);
    for (let key of keys) {
      let sentiment = _.sum(countries[key], function(story) {
        return story.sentiment;
      });
      newSentiments[key] = sentiment;
    }

    if (Object.keys(newSentiments).length > 0) {
      let rainbowLows = new Rainbow();
      rainbowLows.setSpectrum('f61f55', '40dee3');
      rainbowLows.setNumberRange(_.min(newSentiments), 0);

      let rainbowHighs = new Rainbow();
      rainbowHighs.setSpectrum('40dee3', '67ff8c');
      rainbowHighs.setNumberRange(0, _.max(newSentiments));

      for (let key of keys) {
        let sentiment = newSentiments[key];
        if (sentiment < 0) {
          newFills[key] = rainbowLows.colourAt(sentiment);
        } else {
          newFills[key] = rainbowHighs.colourAt(sentiment);
        }
        newFills[key] = '#' + newFills[key];
      }
    }

    return {
      sentiments: newSentiments,
      fills: newFills
    }
  },

  getInitialState() {
    let {sentiments, fills} = this.getSentiments(this.props.countries);

    return {
      mWidth: 50,
      height: this.props.height,
      width: this.props.width,
      sentiments: sentiments,
      fills: fills
    }
  },

  handleResize(e) {
    let w = $('#map').width();
    this.setState({
      mWidth: w,
      width: w,
      height:  w * this.props.height / this.props.width
    })
  },

  componentDidMount() {
    this.handleResize(null);
    window.addEventListener('resize', this.handleResize);

    $(document).on('mousemove', function (e) {
        $('#countryInfo').css({
            left: e.pageX,
            top: e.pageY
        });
    });

    $('#map').css('background-image', 'url("key.png")');
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this.getSentiments(nextProps.countries));
  },

  countryClicked(d) {
    this.props.countryClicked(d.id);
  },

  onMouseOver(d) {
    let name = d.properties.name;

    if (d.id in this.state.sentiments && this.state.sentiments[d.id] != 0) {
      let sentiment = this.state.sentiments[d.id];
      sentiment = parseFloat(parseFloat(sentiment).toFixed(1))
      sentiment = sentiment > 0 ? '+' + sentiment : sentiment;
      $('#countryInfo').html(name + ', ' + sentiment + ' sentiment');
    } else {
      $('#countryInfo').html(name);
    }
    $('#countryInfo').show();
  },

  onMouseOut(d) {
    $('#countryInfo').hide();
  },

  render() {
    let {mWidth, height, width, sentiments, fills} = this.state;
    this.props.log.error(sentiments);

    let projection = d3.geo.mercator()
      .scale(150)
      .translate([this.props.width / 2, this.props.height / 1.5]);

    let path = d3.geo.path().projection(projection);

    return (
      <div id="map-background">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div id="map">
                <svg
                  preserveAspectRatio='xMidYMid'
                  viewBox={'0 0 ' + this.props.width + ' ' + this.props.height}
                  width={width}
                  height={height}>

                  <rect
                    className='background'
                    width={this.props.width}
                    height={this.props.height} />

                  <g id="countries">
                    {this.props.topo.map(function(d) {
                      return <path
                        key={d.id}
                        id={d.id}
                        name={d.properties.name}
                        d={path(d)}
                        fill={d.id in fills ? fills[d.id] : null}
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
