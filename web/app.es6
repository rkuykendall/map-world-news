'use strict';

require('./style.less');
const Rainbow = require('rainbowvis.js');
const NProgress = require('nprogress');
const jsLogger = require('js-logger');
const React = require('react')
let StoryList = require('./components/storyList.jsx')

let log = jsLogger;
log.useDefaults();

const CATEGORIES = {
    'World News': 'http://feeds.reuters.com/Reuters/worldNews',
    'US News': 'http://feeds.reuters.com/Reuters/domesticNews',
    'Top News': 'http://feeds.reuters.com/reuters/MostRead',
    'Politics': 'http://feeds.reuters.com/Reuters/PoliticsNews'
}

$(document).ready(function () {
    $('#countryInfo').html('').css('display', 'none');

    $('.slug').click(function(event) {
        requestStories($(this).text());
        event.preventDefault();
        return false;
    });

    $(document).on('mousemove', function (e) {
        $('#countryInfo').css({
            left: e.pageX,
            top: e.pageY
        });
    });

    requestStories('World News');
});

let mWidth = $('#map').width(),
    width = 1000,
    height = 360,
    country;

let rainbow = new Rainbow();
rainbow.setSpectrum('f61f55', '40dee3', '67ff8c');
rainbow.setNumberRange(-200, 200);

let projection = d3.geo.mercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

let path = d3.geo.path()
    .projection(projection);

let svg = d3.select('#map').append('svg')
    .attr('preserveAspectRatio', 'xMidYMid')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('width', mWidth)
    .attr('height', mWidth * height / width);

svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)
    .on('click', countryClicked);

let g = svg.append('g');
d3.json('countries.topo.json', function (error, us) {
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

            let sentiment = d3.select(this).attr('sentiment');
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

function requestStories(slug) {
    NProgress.start();

    g.selectAll('#countries *').style('fill', null);
    g.selectAll('#countries *').attr('sentiment', 0);

    $('#title').html('<h1>' + slug + '</h1>');
    $('#footer').css('border-top', '1px solid #ddd');

    let url = 'http://localhost:5000/feeds';
    if (window.location.host == 'mapworldnews.com') {
        url = 'http://map-world-news.herokuapp.com/feeds';
    }

    $.post(url, { url: CATEGORIES[slug] }, function(data) {
        $.post(url, { data: data }, function(data) {
            let itemsPositive = [];
            let itemsNegative = [];
            let itemsNeutral = [];

            let i = 1;
            log.info(data);
            React.render(<StoryList stories={data} />, document.getElementById('app'));

            $.each(data, function(idx, val) {
            //     let open = '<div class="story">';
            //     let close = '</div>';
            //
            //     let title = '<h5><a href="' + val.link + '" target="_blank">'
            //           + val.title + '</a></h5>';
            //
            //     let tag = ''
            //
            //     if (val.sentiment > 0) {
            //         tag = '+' + dispNum(val.sentiment) + ' sentiment';
            //         if (val.countries.length > 0) {
            //             tag +=  ' for ' + val.countries.join(', ');
            //         }
            //         tag += '.';
            //     } else if (val.sentiment < 0) {
            //         tag = Math.floor(val.sentiment) + ' sentiment';
            //         if (val.countries.length > 0) {
            //             tag +=  ' for ' + val.countries.join(', ');
            //         }
            //         tag += '.';
            //     } else {
            //         if (val.countries.length > 0) {
            //             tag = val.countries.join(', ') + ' mentioned.';
            //         }
            //     }
            //
            //     tag = '<strong>' + tag + '</strong>';
            //     let text = '<p>' + val.summary + '</p>';
            //     let story = open + title + tag + text + close;
            //
            //     if (val.sentiment > 0) {
            //         itemsPositive.push(story);
            //     } else if (val.sentiment < 0) {
            //         itemsNegative.push(story);
            //     } else {
            //         itemsNeutral.push(story);
            //     }
            //
                i++;
                val.countries.forEach(function (entry) {
                    let original = entry;
                    entry = g.selectAll('#' + entry)

                    if (entry.empty()) {
                        log.error('Error. Country not found: ' + original);
                    } else {
                        let currentSentiment = parseFloat(entry.attr('sentiment'));
                        currentSentiment = currentSentiment || 0;
                        let newSentiment = currentSentiment + val.sentiment;
                        entry.attr('sentiment', newSentiment);

                        entry.style('fill', '#' + rainbow.colourAt(Math.round(newSentiment * 100)));
                        $('#map').css('background-image', 'url("key.png")');
                    }
                });
            });
            //
            // $('#itemsPositive').html('<h3>Positive</h3>' + itemsPositive.join('\n'))
            // $('#itemsNeutral').html('<h3>Neutral</h3>' + itemsNeutral.join('\n'))
            // $('#itemsNegative').html('<h3>Negative</h3>' + itemsNegative.join('\n'))
            NProgress.done();
        }, 'json');
    }).fail(function() {
        NProgress.done();
        log.error( 'Failure to getJSON for ' + url);
        $('#errors').slideDown().delay(30000).slideUp();
    });
}

$(window).resize(function () {
    let w = $('#map').width();
    svg.attr('width', w);
    svg.attr('height', w * height / width);
});
