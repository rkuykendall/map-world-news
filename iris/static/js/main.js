var places;

$(document).ready(function () {

   $("#search").click(function (event) {
      $("#searchDropdown").dropdown("toggle");

      // Previous selection
      if (country) {
         g.selectAll("#" + country.id).classed("selected", false);
      }

      // console.log($("#query").val());
      requestStories($("#query").val());

      // $("#query").submit();
      event.preventDefault();
      return false;
   });

   $("#searchPlace").click(function (event) {

      // Previous selection
      if (country) {
         g.selectAll("#" + country.id).classed("selected", false);
      }

      // console.log($("#place").val());
      requestStories($("#place").val());
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
   width = 938,
   height = 300,
   country,
   state;

var projection = d3.geo.mercator()
   .scale(100)
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
         d3.select(this).style("fill", "#77adf5");

         sentiment = d3.select(this).attr("sentiment")
         if (sentiment == null) {
            sentiment = 0;
         }
         $("#countryInfo").html(d.properties.name + " [" + sentiment + "]");
		document.getElementById("countryInfo").style.border="1px solid black";
		document.getElementById("countryInfo").style.padding="5px 15px";
         //$("#countryInfo").html(this.name);
      })
      .on("mouseout", function (e) {
         d3.select(this).style("fill", null);

		document.getElementById("countryInfo").style.border="0px";
		document.getElementById("countryInfo").style.padding="0px";
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

function requestStories(query) {
    g.selectAll("#countries *").classed("negative very-negative positive very-positive neutral", false);
    g.selectAll("#countries *").attr("sentiment", 0);
    $("#title").html("<h3 class=\"text-center\" style=\"margin-top: 10px;\">" + query + "</h3>");

    $(".articles").html("<br><br><br><center><img src=\"static/loader.gif\"><center>");

    url = "/" + query + "_articles.json";

   $.getJSON(url, function (data) {
      var items = [];
      var i = 1;
      $.each(data, function (key, val) {

         // if(val.countries.length == 0) {
         //   val.countries = ["None found"];
         // }
         // console.dir(val.countries);
         items.push(
            // "<div class=\"story\" id=\"story"+i+"\">" + "<p>"
            "<div class=\"story\" id=\"" + key + "\">"
            + "<h5>" + val.title + "</h5>" + "<small class=\"text-muted\">" + val.summary + "</small><br><br>"
            + "<small>Sentiment: <i class=\"text-muted\">" + val.sentiment + "</i><br>Countries: <i class=\"text-muted\">" + val.countries.join(", ") + "</i></small><br><br>"
            + "<h5 class=\"text-right\"><a class=\"text-right\" href=\"" + val.source + "\" target=\"_blank\" class=\"text-right\"><span class=\"glyphicon glyphicon-link\"></span> View Source</a></h5>" + "</div>");
         // console.log(val.link);
         // console.log(val.sentiment);
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

    $(".articles").html("<ul class=\"list-unstyled\" style=\"margin-bottom: 0px;\">" + items.join("\n") + "</ul>")

    $(".story").mouseover(function (event) {
      event.preventDefault();
      return false;
    });
  });
}

$(window).resize(function () {
   var w = $("#map").width();
   svg.attr("width", w);
   svg.attr("height", w * height / width);
});
