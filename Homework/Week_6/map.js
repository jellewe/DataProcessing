/*
 * Jelle Witsen Elias
 * 15/12/2017
 * Univesity of Amsterdam: data processing
 * studentno. 10753532
 *
 * Draws a map and barchart of clicked country on map with data about quality of
 * life, purchasing power etc.
 */


var barchart = function(countryInfo) {
  // remove previous barchart, if it exists
  d3.select("#barchart").remove()

  // draw new barchart for current country
  var barchartSvg = d3.select("body").append("svg")
    .attr("id", "barchart")
    .attr("class", "chart")

  // margins around chart in pixels
  var margin = {top: 70, right: 30, bottom: 130, left: 40}

  // width and height of chart in pixels
  var width = 400 - margin.left - margin.right
  var height = 450 - margin.top - margin.bottom

  // domain for x scale
  domain = ["ppIndex", "qolIndex", "safetyIndex", "hcIndex", "colIndex"];

  // variable for width of bars
  var barWidth = width / domain.length;

  // variable for chart
  var chart = d3.select(".chart")

      // set width and height of chart
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    // transform g element to proper position
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // scale for y dimension with domain of 0 to max rainfall value
    var yScale = d3.scale.linear()
      .domain([0, 250])
      .range([height, 0])

    // scale for x dimension
    var xScale = d3.scale.ordinal()
      .domain(domain)
      .rangeRoundBands([0, width])


    // variables for x and y axes
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(domain.length)
      .orient("bottom")
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")

    xText = ["Quality of life index", "Purchasing power index", "safety Index",
             "Healthcare index", "Cost of living index"]

    // append x axis
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)")
        .text(function(d, i) { return xText[i] })

    // append y axis
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    // make group element for bars
    chart.append("g")
      .attr("class", "bars")

    // strip countryInfo of irrelevant information
    infoArray = []
    countryInfo = countryInfo["properties"]
    for (var key in countryInfo) {
      if (key != domain[0] && key != domain[1] && key != domain[2]
          && key != domain[3] && key != domain[4]){
        delete countryInfo[key]
      }
      else {
        infoArray.push(countryInfo[key])
      }
    }

    // select all bars and make new bar for every data element
    var barSelection = chart.select(".bars").selectAll("rect")
      .data(infoArray)
      .enter().append("rect")
      .attr("x", function(d, i) { return i * barWidth + 15})
      .attr("y", function(d) { return yScale(d) })
      .attr("height", function(d) { return height - yScale(d) })
      .attr("width", barWidth - 30)
}

window.onload = function() {
  var width = 900;
  var height = 600;

  // projection for the map
  var projection = d3.geo.mercator()
    .center([ 13, 52 ])
    .translate([ width/2, height/2 ])
    .scale([ width/1.5 ]);

  var mapSvg = d3.select("body").append("svg")
    .attr("id", "map")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(0, 100)")

  // path for map
  var path = d3.geo.path()
    .projection(projection);
  var g = mapSvg.append("g");

  // color scale
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
  d3.selectAll(".dataInfo")
    .style("font-size", "10px")

  // group element for legend
  var legend = g.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20,450)");

  // data to show in legend
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
    .text(function(d, i) { return "Quality of life index: " + legendData[1][i] });

  // load dataset and world json file
  d3.csv("dataset_2016.csv", function(error, data) {
    if (error) {
      window.alert(error)
    }
    d3.json("world.json", function(error, world) {
      if (error) {
        window.alert(error)
      }

      // store relevant data in variables and append to world data
      for (var i = 0; i < data.length; i++) {
        var country = data[i]["Country"];
        var qolIndex = data[i]["Quality of Life Index"]
        var ppIndex = data[i]["Purchasing Power Index"]
        var safetyIndex = data[i]["Safety Index"]
        var hcIndex = data[i]["Health Care Index"]
        var colIndex = data[i]["Cost of Living Index"]
        for (var j = 0; j < world.features.length; j++) {
          var jsonCountry = world.features[j].properties.name
          if (country == jsonCountry) {
            world.features[j].properties["qolIndex"] = qolIndex
            world.features[j].properties["ppIndex"] = ppIndex
            world.features[j].properties["safetyIndex"] = safetyIndex
            world.features[j].properties["hcIndex"] = hcIndex
            world.features[j].properties["colIndex"] = colIndex
            break;
          }
        }
      }

      // draws map
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

          // on mouseover, show quality of life info
          .on("mouseover", function(d) {
            d3.select(this)
              .style("opacity", 0.5)
            if (d.properties["qolIndex"]) {
              d3.select(".countryInfo")
                .text(d.properties.name)
              d3.select(".qolInfo")
                .text("Quality of life index: " + d.properties["qolIndex"])
            }

            // else, show 'no data'
            else {
              d3.select(".countryInfo")
                .text(d.properties.name + ": no data")
              d3.select(".qolInfo")
                .text("")
              d3.select(".ppiInfo")
                .text("")
            }
          })

          // on click, call barchart function
          .on("click", function(d) {
            if (d.properties["qolIndex"]) {
              barchart(d)
            }
          })

          // reset opacity to 1 on mouseout
          .on("mouseout", function() {
            d3.select(this)
              .style("opacity", 1)
          })
    });
  });

};
