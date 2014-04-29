var places;

$(document).ready(function () {
  $("#search").click(function (event) {
    $("#searchDropdown").dropdown("toggle");
    requestStories($("#query").val());

    // $("#query").submit();
    event.preventDefault();
  });

  $("#query").submit(function (event) {
  
      // Previous selection
    if (country) {
      g.selectAll("#" + country.id).classed("selected", false);
    }
  
    console.log($("#query").val());
    requestStories($("#query").val());

    event.preventDefault();
  });

 

  $("#searchPlace").click(function (event) {
    // $("#place").submit();
    // url = "/"+$( "#place" ).val()+"_articles.json";
    // console.log(url);

    // $.getJSON(url, function(data) {
    //   var items = [];
    //   $.each( data, function( key, val ) {
    //     items.push( "<li id='" + key + "'>" + val + "</li>" );
    //   });

    //   $(".story").html("<ul>"+items.join("\n")+"</ul>")
    //   $("#title").html("<ul>"+$( "#place" ).val()+"</ul>")
    // });

    // Previous selection
    if (country) {
      g.selectAll("#" + country.id).classed("selected", false);
    }
  
    requestStories($("#place").val());
    event.preventDefault();
    return false;
  });

  $("#place").submit(function (event) {
    console.log($("#place").val());
    event.preventDefault();
  });

  event.preventDefault();
});

var m_width = $("#map").width(),
  width = 938,
  height = 500,
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
    .attr("d", path)
    .on("click", country_clicked)
	.on("mouseover", function(e){d3.select(this).style("fill", "#5599f3")})
    .on("mouseout", function(e){d3.select(this).style("fill", null)})
;
});

function zoom(xyz) {
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
    .selectAll(["#countries", "#states"])
    .style("stroke-width", 1.0 / xyz[2] + "px")
    .selectAll(".city")
    .attr("d", path.pointRadius(20.0 / xyz[2]));
}

function get_xyz(d) {
  var bounds = path.bounds(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .96 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [x, y, z];
}

function country_clicked(d) {


  // g.selectAll(["#states"]).remove();
  // state = null;

  // Previous selection
  if (country) {
    g.selectAll("#" + country.id).classed("selected", false);
  }

  if (d && country !== d) {
    country = d;
    g.selectAll("#" + country.id).classed("selected", true);
    requestStories(country.properties.name);
    
     
    //   var xyz = get_xyz(d);

    //   if (d.id == 'USA') {
    //     d3.json("data/json/states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
    //       g.append("g")
    //       .attr("id", "states")
    //       .selectAll("path")
    //       .data(topojson.feature(us, us.objects.states).features)
    //       .enter()
    //       .append("path")
    //       .attr("id", function(d) { return d.id; })
    //       .attr("class", "active")
    //       .attr("d", path)
    //       .on("click", state_clicked);

    //       // zoom(xyz);
    //       g.selectAll("#" + d.id).style('display', 'none');
    //     });
    //   } else {
    //     // zoom(xyz);
    //   }
    // } else {
    //   var xyz = [width / 2, height / 1.5, 1];
    //   country = null;
    //   // zoom(xyz);
  }

  // // $.getJSON("/"+d.properties.name+"_articles.json", function(data) {
  // $.getJSON("json/us_articles.json", function(data) {
  //   var items = [];
  //   // alert("getting data!");
  // 	$.each( data, function( key, val ) {

  // 	$.each( story, function( key, val ) {
  //     	items.push( "<li id='" + items.length + key + "'>" + val + "</li>" );
  //     });

  //   });

  //   $("#stories").html("<ul>"+items.join("\n")+"</ul>")
  // });


  // var places = [
  // {
  //   name: "Wollongong, Australia",
  //   location: {
  //     latitude: -34.42507,
  //     longitude: 150.89315
  //   }
  // },
  // {
  //   name: "Newcastle, Australia",
  //   location: {
  //     latitude: -32.92669,
  //     longitude: 151.77892
  //   }
  // }
  // ]

  // svg.selectAll(".pin")
  // .data(places)
  // .enter().append("circle", ".pin")
  // .attr("r", 5)
  // .attr("transform", function(d) {
  //   return "translate(" + projection([
  //     d.location.longitude,
  //     d.location.latitude
  //     ]) + ")"
  // });

}


function requestStories(query) {
  g.selectAll("#countries *").classed("negative", false);
  g.selectAll("#countries *").classed("positive", false);
  g.selectAll("#countries *").attr("sentiment", 0);
  $("#title").html("<h3 class=\"text-center\" style=\"margin-top: 10px;\">" + query + "</h3>");

  // $(".articles").html("<br><br><div class=\"progress progress-striped active\" style=\"margin: 30px;\">" + "<div class=\"progress-bar\"  role=\"progressbar\" aria-valuenow=\"50\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 50%\">" + "<span class=\"sr-only\">50% Complete</span></div></div>");
  $(".articles").html("<br><br><br><center><img src=\"static/loader.gif\"><center>");

  url = "/" + query + "_articles.json";
  // console.log(query);
  // var places;

  $.getJSON(url, function (data) {
    var items = [];
    var i=1;
    $.each(data, function (key, val) {

      // if(val.countries.length == 0) {
      //   val.countries = ["None found"];
      // }

      items.push(
        // "<div class=\"story\" id=\"story"+i+"\">" + "<p>" 
        "<div class=\"story\" id=\""+key+"\">" + "<p>" 
        + val.title + "</p>"
        + "<small class=\"text-muted\">" + val.summary
        + " [Sentiment: "+val.sentiment+ "] [Countries: "+val.countries.join(", ")+ "]"
        + "</small><br><br>"
        + "<a href=\"" + val.link + "\" target=\"_blank\" class=\"text-right\">View Source</a>"
        + "</div>");
      // console.log(val.link);
      // console.log(val.sentiment);
      i++;
      val.countries.forEach(function(entry) {
        entry = g.selectAll("#" + entry)

        current = parseInt(entry.attr("sentiment"));
        entry.attr("sentiment", current + val.sentiment);

        if (entry.attr("sentiment") < 0) {
          entry.classed("negative", true);
        } else if (entry.attr("sentiment") > 0) {
          entry.classed("positive", true);
        }
        //   // if (val.sentiment < 0) {
        //     g.selectAll("#" + entry).classed("negative", true);
        //   } else {
        //     g.selectAll("#" + entry).classed("positive", true);
        //   }
      });

      // places = [{
      //   name: val.country,
      //   location: {
      //     latitude: val.long,
      //     longitude: val.lat
      //   }
      // }]
    });

    // $.each( data, function( key, val ) {
    //   items.push( "<li id='" + key + "'>" + val + "</li>" );
    // });

    $(".articles").html("<ul class=\"list-unstyled\" style=\"margin-bottom: 0px;\">" + items.join("\n") + "</ul>")

    $(".story").mouseover(function (event){
    console.dir(this.id); 
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

 

function toColor(sentiment) {
  var r = 0;
  var g = 0;
  var b = 0;
  if (sentiment > 0) {
    b = 100 * sentiment;
  }
  if (sentiment < 0) {
    r = 100 * sentiment;
  }
  return "rgb(" + r + "," + g + "," + b + ")";
}
