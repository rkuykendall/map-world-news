var places;

CATEGORIES = {
    2: "Industry",
    3: "Politics",
    4: "Society",
    5: "Celebrities",
    6: "Entertainment",
    7: "USA",
    8: "Science",
    9: "Video Games",
    10: "Products",
    11: "Health",
    12: "Universities",
    13: "Art",
    14: "Hobbies",
    15: "IT",
    16: "Programming",
    17: "Events",
    18: "Religion And Spirituality",
    19: "World News",
    20: "Life Style",
    21: "Blogs",
    22: "Business",
    23: "Travel",
    25: "Fun Stuff",
    26: "Top News",
    27: "Sports",
    28: "Internet",
    29: "Music",
    30: "Technology",
    31: "Top Blogs",
    33: "Jobs",
    34: "Shopping",
    36: "Oddly Enough",
    588: "Columnists",
    590: "Video",
    591: "Law",
    1168: "General",
    1314: "Sports"
}

function disp_num(n) {
    return parseFloat(parseFloat(n).toFixed(1));
}

$(document).ready(function () {
    $("#countryInfo").html("").css("display", "none");

    $(".category").click(function (event) {
        requestStories("category_"+$(this).attr('href'));
        event.preventDefault();
        return false;
    });

    $("#search").click(function (event) {
        if (country) {
            g.selectAll("#" + country.id).classed("selected", false);
        }

        requestStories($("#query").val());

        event.preventDefault();
        return false;
    });

    $(document).on('mousemove', function (e) {
        $('#countryInfo').css({
            left: e.pageX,
            top: e.pageY
        });
    });
});

var m_width = $("#map").width(),
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

var svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", country_clicked);

var g = svg.append("g");
d3.json("static/json/countries.topo.json", function (error, us) {
    g.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.countries).features)
        .enter()
        .append("path")
        .attr("id", function (d) {
            return d.id;
        })
        .attr("name", function (d) {
            return d.properties.name;
        })
        .attr("d", path)
        .on("click", country_clicked)
        .on("mouseover", function (d) {
            d3.select(this).classed("selected", true);

            sentiment = d3.select(this).attr("sentiment");
            if (sentiment == null) {
                sentiment = 0;
            }

            if (sentiment < 0) {
                $("#countryInfo").html(d.properties.name + ", " + disp_num(sentiment) + " sentiment").css("display", "block");
            } else if (sentiment > 0) {
                $("#countryInfo").html(d.properties.name + ", +" + disp_num(sentiment) + " sentiment").css("display", "block");
            } else {
                $("#countryInfo").html(d.properties.name).css("display", "block");
            }
        })
        .on("mouseout", function (e) {
            d3.select(this).classed("selected", false);
            $("#countryInfo").html("").css("display", "none");
        });
});

function country_clicked(d) {
    // Previous selection
    if (country) {
        g.selectAll("#" + country.id).classed("selected", false);
    }

    if (d && country !== d) {
        country = d;
        g.selectAll("#" + country.id).classed("selected", true);
        requestStories(country.properties.name);
    }
}

NProgress.configure({
    trickleRate: 0.05,
    trickleSpeed: 400
});

function requestStories(query) {
    NProgress.start();

    g.selectAll("#countries *").style("fill", null);
    g.selectAll("#countries *").attr("sentiment", 0);

    if (query.substring(0, 9) == 'category_') {
        console.log(query.substring(9));
        $("#title").html("<h1>" + CATEGORIES[parseInt(query.substring(9))] + "</h1>");
    } else {
        $("#title").html("<h1>" + query + "</h1>");
    }
    $("#footer").css("border-top", "1px solid #ddd");


    url = "/" + query + "_articles.json";

    $.getJSON(url, function (data) {
        var items_positive = [];
        var items_negative = [];
        var items_neutral = [];

        var i = 1;
        $.each(data, function (key, val) {

            open = '<div class="story" id="' + key + '">';
            close = '</div>';

            title = '<h5><a href="' + val.source + '" target="_blank">'
                  + val.title + '</a></h5>';

            tag = ''

            if (val.sentiment > 0) {
                tag = '+'+disp_num(val.sentiment) + ' sentiment';
                if (val.countries.length > 0) {
                    tag +=  ' for ' + val.countries.join(", ");
                }
                tag += '.';
            } else if (val.sentiment < 0) {
                tag = Math.floor(val.sentiment) + ' sentiment';
                if (val.countries.length > 0) {
                    tag +=  ' for ' + val.countries.join(", ");
                }
                tag += '.';
            } else {
                if (val.countries.length > 0) {
                    tag = val.countries.join(", ") + ' mentioned.';
                }
            }
            tag = '<strong>'+tag+'</strong>';

            text = '<p>' + val.summary + '</p>';


            story = open + title + tag + text + close;

            if (val.sentiment > 0) {
                items_positive.push(story);
            } else if (val.sentiment < 0) {
                items_negative.push(story);
            } else {
                items_neutral.push(story);
            }

            i++;
            val.countries.forEach(function (entry) {
                original = entry;
                entry = g.selectAll("#" + entry)

                if (entry.empty()) {
                    console.log("Error. Country not found: " + original);
                } else {
                    current_sentiment = parseFloat(entry.attr("sentiment"));
                    new_sentiment = current_sentiment + val.sentiment;
                    entry.attr("sentiment", new_sentiment);

                    entry.style("fill", "#"+rainbow.colourAt(Math.round(new_sentiment*100)));
                    $("#map").css("background-image", "url('/static/img/key.png')");
                }
            });
        });

        $("#items_positive").html("<ul><h3>Positive</h3>" + items_positive.join("\n") + "</ul>")
        $("#items_neutral").html("<ul><h3>Neutral</h3>" + items_neutral.join("\n") + "</ul>")
        $("#items_negative").html("<ul><h3>Negative</h3>" + items_negative.join("\n") + "</ul>")
        NProgress.done();
    });
}

$(window).resize(function () {
    var w = $("#map").width();
    svg.attr("width", w);
    svg.attr("height", w * height / width);
});
