var places;

$(document).ready(function () {

   $("#search").click(function (event) {
      $("#searchDropdown").dropdown("toggle");

      if (country) {
         g.selectAll("#" + country.id).classed("selected", false);
      }

      requestStories($("#query").val());

      event.preventDefault();
      return false;
   });

   $("#place").submit(function (event) {
      if (country) {
      g.selectAll("#" + country.id).classed("selected", false);
   }
      event.preventDefault();
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
   country,
   state;

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
         $("#countryInfo").html(d.properties.name);
      		document.getElementById("countryInfo").style.display="block";
      })
      .on("mouseout", function (e) {
          d3.select(this).classed("selected", false);
      		document.getElementById("countryInfo").style.display="none";
         $("#countryInfo").html("");
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

NProgress.configure({ trickleRate: 0.05, trickleSpeed: 400 });

function requestStories(query) {
    NProgress.start();
    g.selectAll("#countries *").classed("negative very-negative positive very-positive neutral", false);
    g.selectAll("#countries *").attr("sentiment", 0);
    $("#title").html("<h1>" + query + "</h1>");

    url = "/" + query + "_articles.json";

   $.getJSON(url, function (data) {
      var items_positive = [];
      var items_negative = [];
      var items_neutral = [];

      var i = 1;
      $.each(data, function (key, val) {

         story = '<div class="story" id="'+key+'">'
            +'<h5><a href="'+val.source+'" target="_blank">'+val.title+'</a> '
            +val.countries.join(", ")+': '+val.sentiment+'</h5>'
            +'<small>'+val.summary+'</small></div>';

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

            if(entry.empty()) {
              console.log("Error. Country not found: "+original);
            } else {
              current = parseInt(entry.attr("sentiment"));
              entry.attr("sentiment", current + val.sentiment);

              entry.classed("negative very-negative positive very-positive neutral", false);

              // Very bad -3 or higher
              if (entry.attr("sentiment") < -2) {
                entry.classed("very-negative", true);

              // Bad, -1 to -2
              } else if (entry.attr("sentiment") < 0) {
                entry.classed("negative", true);

              // Very good, 3 or higher
              } else if (entry.attr("sentiment") > 2) {
                entry.classed("very-positive", true);

              // Good, 1-2
              } else if (entry.attr("sentiment") > 0) {
                entry.classed("positive", true);

              // Neutral, 0
              } else if (entry.attr("sentiment") == 0) {
                entry.classed("neutral", true);
              }
            }
         });
      });

    $("#items_positive").html("<ul class=\"list-unstyled\" style=\"margin-bottom: 0px;\"><h3>Positive</h3>" + items_positive.join("\n") + "</ul>")
    $("#items_neutral").html("<ul class=\"list-unstyled\" style=\"margin-bottom: 0px;\"><h3>Neutral</h3>" + items_neutral.join("\n") + "</ul>")
    $("#items_negative").html("<ul class=\"list-unstyled\" style=\"margin-bottom: 0px;\"><h3>Negative</h3>" + items_negative.join("\n") + "</ul>")
    NProgress.done();
  });
}

$(window).resize(function () {
   var w = $("#map").width();
   svg.attr("width", w);
   svg.attr("height", w * height / width);
});
