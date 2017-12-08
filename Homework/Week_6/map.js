window.onload = function() {

  var width = 900;
  var height = 600;

  var projection = d3.geo.mercator()
    .center([ 13, 52 ])
    .translate([ width/2, height/2 ])
    .scale([ width/1.5 ]);

  var mapSvg = d3.select("body").append("svg")
    .attr("id", "map")
    .attr("width", width)
    .attr("height", height)
  var path = d3.geo.path()
    .projection(projection);
  var g = mapSvg.append("g");
  var color = d3.scale.linear()
    .range(["rgb(0,51,0)", "rgb(26,255,26)"])
    .domain([86, 201.53])

  // info of current mouse position to show
  var countryInfo = g.append("text")
    .attr("class", "countryInfo dataInfo")
    .attr("x", 20)
    .attr("y", 200)
    .style("font-size", "10px")
  var qolInfo = g.append("text")
    .attr("class", "qolInfo dataInfo")
    .attr("x", 20)
    .attr("y", 220)
  var ppiInfo = g.append("text")
    .attr("class", "ppiInfo dataInfo")
    .attr("x", 20)
    .attr("y", 240)


  // group element for legend
  var legend = g.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20,450)");

  var legendData = [["rgb(0,51,0)", "rgb(26,255,26)"], [86.53, 201.53]]

  // append group elements to legend group for every element of legend
  legend.selectAll(".legenditem")
    .data(legendData[0])
    .enter().append("g")
        .attr("class", "legenditem")
        .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"});

  // make squares with specific for legend items
  legend.selectAll(".legenditem")
    .append("rect")
    .attr("width", 8)
    .attr("height", 8)
    .style("fill", function(d, i) { return d });

  // put text next to legend squares
  legend.selectAll(".legenditem")
    .append("text")
    .attr("x", 10)
    .attr("y", 4)
    .attr("dy", ".35em")
    .style("font-size", "10px")
    .text(function(d, i) { return "QoLIndex: " + legendData[1][i] });


  d3.selectAll(".dataInfo")
    .style("font-size", "10px")

  d3.csv("dataset_2016.csv", function(error, data) {
    if (error) {
      window.alert(error)
    }
    d3.json("world.json", function(error, world) {
      if (error) {
        window.alert(error)
      }
      for (var i = 0; i < data.length; i++) {
        var country = data[i]["Country"];

        var qolIndex = data[i]["Quality of Life Index"]
        var ppIndex = data[i]["Purchasing Power Index"]

        for (var j = 0; j < world.features.length; j++) {
          var jsonCountry = world.features[j].properties.name
          if (country == jsonCountry) {
            world.features[j].properties["qolIndex"] = qolIndex
            world.features[j].properties["ppIndex"] = ppIndex
            break;
          }
        }
      }

      // console.log(topojson.feature(europe))
      console.log(world)
      mapSvg.selectAll("path")
        .data(world.features)
        .enter().append("path")
          .attr("d", path)
          .style("stroke", "#fff")
          .style("stroke-width", "1")
          .style("fill", function(d) {
            var value = d.properties["qolIndex"]
            if (value) {
              return color(value)
            }
            else {
              return "rgb(0,0,0)";
            }
          })
          .on("mouseover", function(d) {
            d3.select(this)
              .style("opacity", 0.5)
            if (d.properties["qolIndex"]) {
              d3.select(".countryInfo")
                .text(d.properties.name)
              d3.select(".qolInfo")
                .text("Quality of life index: " + d.properties["qolIndex"])
              d3.select(".ppiInfo")
                .text("Purchasing power index: " + d.properties["ppIndex"])
            }
            else {
              d3.select(".countryInfo")
                .text(d.properties.name + ": no data")
              d3.select(".qolInfo")
                .text("")
              d3.select(".ppiInfo")
                .text("")
            }
          })
          .on("mouseout", function() {
            d3.select(this)
              .style("opacity", 1)
          })
    });
  });

};
