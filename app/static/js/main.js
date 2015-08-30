/*eslint-disable no-var, no-console, vars-on-top*/

// require('./custom.css');
// require('./map.css');
var Rainbow = require('rainbowvis.js');
var NProgress = require('nprogress');

var places;

CATEGORIES = {
    'world': 'World News',
    'domestic': 'US News',
    'top': 'Top News',
    'politics': 'Politics'
}

function dispNum(n) {
    return parseFloat(parseFloat(n).toFixed(1));
}

$(document).ready(function () {
    $('#countryInfo').html('').css('display', 'none');
    $('#errors').hide();

    $('.slug').click(function(event) {
        requestStories('feed/' + $(this).attr('href'));
        event.preventDefault();
        return false;
    });

    $(document).on('mousemove', function (e) {
        $('#countryInfo').css({
            left: e.pageX,
            top: e.pageY
        });
    });

    requestStories('feed/world');
});

var mWidth = $('#map').width(),
    width = 1000,
    height = 360,
    country;

var rainbow = new Rainbow();
rainbow.setSpectrum('f61f55', '40dee3', '67ff8c');
rainbow.setNumberRange(-200, 200);

var projection = d3.geo.mercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select('#map').append('svg')
    .attr('preserveAspectRatio', 'xMidYMid')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('width', mWidth)
    .attr('height', mWidth * height / width);

svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)
    .on('click', countryClicked);

var g = svg.append('g');
d3.json('/json/countries.topo.json', function (error, us) {
    g.append('g')
        .attr('id', 'countries')
        .selectAll('path')
        .data(topojson.feature(us, us.objects.countries).features)
        .enter()
        .append('path')
        .attr('id', function (d) {
            return d.id;
        })
        .attr('name', function (d) {
            return d.properties.name;
        })
        .attr('d', path)
        .on('click', countryClicked)
        .on('mouseover', function (d) {
            d3.select(this).classed('selected', true);

            sentiment = d3.select(this).attr('sentiment');
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
        })
        .on('mouseout', function (e) {
            d3.select(this).classed('selected', false);
            $('#countryInfo').html('').css('display', 'none');
        });
});

function countryClicked(d) {
    // FeedZilla is down so do nothing for now.

    // // Previous selection
    // if (country) {
    //     g.selectAll('#' + country.id).classed('selected', false);
    // }
    //
    // if (d && country !== d) {
    //     country = d;
    //     g.selectAll('#' + country.id).classed('selected', true);
    //     requestStories(country.properties.name);
    // }
}

NProgress.configure({
    trickleRate: 0.05,
    trickleSpeed: 400
});

function requestStories(query) {
    NProgress.start();

    g.selectAll('#countries *').style('fill', null);
    g.selectAll('#countries *').attr('sentiment', 0);

    if (query.substring(0, 5) == 'feed/') {
        slug = query.substring(5);
        $('#title').html('<h1>' + CATEGORIES[slug] + '</h1>');
    } else {
        $('#title').html('<h1>' + query + '</h1>');
    }
    $('#footer').css('border-top', '1px solid #ddd');

    url = query + '.json';

    if (window.location.host == 'mapworldnews.com') {
        url = 'http://map-world-news.herokuapp.com/' + url;
    }

    $.getJSON(url, function (data) {
        var itemsPositive = [];
        var itemsNegative = [];
        var itemsNeutral = [];

        var i = 1;
        $.each(data, function (key, val) {
            open = '<div class="story" id="' + key + '">';
            close = '</div>';

            title = '<h5><a href="' + val.link + '" target="_blank">'
                  + val.title + '</a></h5>';

            tag = ''

            if (val.sentiment > 0) {
                tag = '+' + dispNum(val.sentiment) + ' sentiment';
                if (val.countries.length > 0) {
                    tag +=  ' for ' + val.countries.join(', ');
                }
                tag += '.';
            } else if (val.sentiment < 0) {
                tag = Math.floor(val.sentiment) + ' sentiment';
                if (val.countries.length > 0) {
                    tag +=  ' for ' + val.countries.join(', ');
                }
                tag += '.';
            } else {
                if (val.countries.length > 0) {
                    tag = val.countries.join(', ') + ' mentioned.';
                }
            }
            tag = '<strong>' + tag + '</strong>';

            text = '<p>' + val.summary + '</p>';


            story = open + title + tag + text + close;

            if (val.sentiment > 0) {
                itemsPositive.push(story);
            } else if (val.sentiment < 0) {
                itemsNegative.push(story);
            } else {
                itemsNeutral.push(story);
            }

            i++;
            val.countries.forEach(function (entry) {
                original = entry;
                entry = g.selectAll('#' + entry)

                if (entry.empty()) {
                    console.log('Error. Country not found: ' + original);
                } else {
                    currentSentiment = parseFloat(entry.attr('sentiment'));
                    currentSentiment = currentSentiment || 0;
                    newSentiment = currentSentiment + val.sentiment;
                    entry.attr('sentiment', newSentiment);

                    entry.style('fill', '#' + rainbow.colourAt(Math.round(newSentiment * 100)));
                    $('#map').css('background-image', 'url("/static/img/key.png")');
                }
            });
        });

        $('#itemsPositive').html('<h3>Positive</h3>' + itemsPositive.join('\n'))
        $('#itemsNeutral').html('<h3>Neutral</h3>' + itemsNeutral.join('\n'))
        $('#itemsNegative').html('<h3>Negative</h3>' + itemsNegative.join('\n'))
        NProgress.done();
    }).fail(function() {
        NProgress.done();
        console.log( 'Failure to getJSON for ' + url);
        $('#errors').slideDown().delay(30000).slideUp();
    });
}

$(window).resize(function () {
    var w = $('#map').width();
    svg.attr('width', w);
    svg.attr('height', w * height / width);
});
