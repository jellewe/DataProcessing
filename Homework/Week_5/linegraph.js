/*
 * Jelle Witsen Elias
 * 30/11/2017
 * Univesity of Amsterdam: data processing
 * studentno. 10753532
 *
 * Draws a linegraph with data of a few weather stations in the
 * Netherlands
 */

// open json data and check for error
window.onload = d3.json("KNMI_data.json", function(error, data) {
  if (error) {
    window.alert("error loading data")
  }

  // selection of svg in html
  var svg = d3.select("svg")

  // margins around graph in pixels
  var margin = {top: 30, right: 30, bottom: 50, left: 70};

  // convert values in data to JS Numbers or date object
  for (i = 0; i < data.length; i++) {
    date = data[i]["date"]
    date = date.slice(0, 4) + "," + date.slice(4, 6) + "," + date.slice(6);
    data[i]["date"] = new Date(date);
    data[i]["averageTemp"] = Number(data[i]["averageTemp"]) / 10
    data[i]["maxTemp"] = Number(data[i]["maxTemp"]) / 10
    data[i]["weatherStation"] = Number(data[i]["weatherStation"])
    data[i]["minTemp"] = Number(data[i]["minTemp"]) / 10
  };

  // width and height of graph in pixels
  var width = 900 - margin.left - margin.right;
  var height = 450 - margin.top - margin.bottom;

  // scales for x and y dimensions
  var xScale = d3.time.scale()
    .domain([d3.min(data, function(d) { return d["date"] }),
             d3.max(data, function(d) { return d["date"] })])
    .range([0, width]);
  var yScale = d3.scale.linear()
    .domain([d3.min(data, function(d) { return d["minTemp"]}),
             d3.max(data, function(d) { return d["maxTemp"] })])
    .range([height, 0])

  // variables for x and y axes
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  // group element for entire graph
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // filter data into subsets of data for weatherstations
  var deBiltData = data.filter(function(d) {
    if (d.weatherStation == 260) {
      delete d.weatherStation
      return d;
    };
  });
  var leeuwardenData = data.filter(function(d) {
    if (d.weatherStation == 270) {
      delete d.weatherStation
      return d;
    };
  });
  var maastrichtData = data.filter(function(d) {
    if (d.weatherStation == 380) {
      delete d.weatherStation
      return d;
    };
  });

  // select graph with specified width and height
  var graph = d3.select(".linegraph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // g element for x axis
  g.append("g")
    .attr("class", "x axis")
    .style("font-size", "10px")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
      .style("text-anchor", "end")
      .attr("dx", "7em")
      .attr("dy", "4em")
      .text("Month in 2016");

  // g element for y axis
  g.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("font-size", "10px")

  // text to show next to y axis
  g.selectAll(".y")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("yScale", 6)
      .attr("dy", "1.5em")
      .style("text-anchor", "end")
      .attr("font-size", "10px")
      .text("Temperature (Celcius)");

  // info of current mouse position to show
  var xInfo = g.append("text")
    .attr("class", "dataInfo")
    .attr("x", 30)
    .attr("y", 0)
    .style("font-size", "10px")

  var yInfo = g.append("text")
    .attr("class", "dataInfo")
    .attr("x", 30)
    .attr("y", 10)
    .style("font-size", "10px")

  // lines for crosshair to show at cursor position
  g.append("line")
    .attr("class", "crosshair")
    .attr("id", "horizontalLine")
    .style("opacity", 0)

  g.append("line")
    .attr("class", "crosshair")
    .attr("id", "verticalLine")
    .style("opacity", 0)

  // overlay with listener for mouse, to show data for cursor position
  g.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .style("opacity", 0)
    .on("mouseover", function() {
      mouse = d3.mouse(this)
      g.select("#horizontalLine")
        .attr("x1", 0).attr("y1", mouse[1])
        .attr("x2", width).attr("y2", mouse[1])
        .style("opacity", 1)
        .style("stroke", "black")
      g.select("#verticalLine")
        .attr("x1", mouse[0]).attr("y1", 0)
        .attr("x2", mouse[0]).attr("y2", height)
        .style("opacity", 1)
        .style("stroke", "black")

      // get data of current mouse position
      var date = xScale.invert(mouse[0])
      var month = date.getUTCMonth() + 1
      var day = date.getUTCDate()

      // format information to show for current data point
      xInfo.html(day.toString() + "-" + month.toString() + "-2016")
      yInfo.html(yScale.invert(mouse[1]).toFixed(2) + " degrees Celsius")

    })

  // line functions for average, minimum and maximum temperatures
  var lineFunctionAvg = d3.svg.line()
    .x(function(d) { return xScale(d["date"]); })
    .y(function(d) { return yScale(d["averageTemp"])})

  var lineFunctionMin = d3.svg.line()
    .x(function(d) { return xScale(d["date"]); })
    .y(function(d) { return yScale(d["minTemp"])})

  var lineFunctionMax = d3.svg.line()
    .x(function(d) { return xScale(d["date"]); })
    .y(function(d) { return yScale(d["maxTemp"])})

  // all lines for Leeuwarden, De Bilt and Maastricht
  var biltPathMin = g.append("path")
    .data(deBiltData)
    .attr("class", "line min bilt")
    .attr("d", function() { return lineFunctionMin(deBiltData) })

  var biltPathMax = g.append("path")
    .data(deBiltData)
    .attr("class", "line max bilt")
    .attr("d", function() { return lineFunctionMax(deBiltData) })

  var biltPathAvg = g.append("path")
    .data(deBiltData)
    .attr("class", "line avg bilt")
    .attr("d", function() { return lineFunctionAvg(deBiltData) })

  var leeuwPathMin = g.append("path")
    .data(leeuwardenData)
    .attr("class", "line min leeuwarden")
    .attr("d", function() { return lineFunctionMin(leeuwardenData) })

  var leeuwPathMax = g.append("path")
    .data(leeuwardenData)
    .attr("class", "line max leeuwarden")
    .attr("d", function() { return lineFunctionMax(leeuwardenData) })

  var leeuwPathAvg = g.append("path")
    .data(leeuwardenData)
    .attr("class", "line avg leeuwarden")
    .attr("d", function() { return lineFunctionAvg(leeuwardenData) })

  var maastrichtPathMin = g.append("path")
    .data(maastrichtData)
    .attr("class", "line min maastricht")
    .attr("d", function() { return lineFunctionMin(maastrichtData) })

  var maastrichtPathMax = g.append("path")
    .data(maastrichtData)
    .attr("class", "line max maastricht")
    .attr("d", function() { return lineFunctionMax(maastrichtData) })

  var maastrichtPathAvg = g.append("path")
    .data(maastrichtData)
    .attr("class", "line avg maastricht")
    .attr("d", function() { return lineFunctionAvg(maastrichtData) })

  // give lines appropriate color
  d3.selectAll(".min")
    .attr("stroke", "blue")
  d3.selectAll(".max")
    .attr("stroke", "red")
  d3.selectAll(".avg")
    .attr("stroke", "green")

  d3.selectAll(".line")
    .attr("fill", "none")

  // only show De Bilt data by default
  d3.selectAll(".leeuwarden")
    .style("display", "none")

  d3.selectAll(".maastricht")
    .style("display", "none")

  // data for legend
  legendData = [['Red', 'Green', 'Blue'], ['Maximum temperature',
                                           'Average temperature',
                                           'Minimum temperature']]

  // group element for legend
  var legend = g.append("g")
    .attr("class", "legend")
    .attr("transform", "translate (" + width + ",0)");

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
    .style("fill", function(d, i) { return legendData[0][i]});

  // put text next to legend squares
  legend.selectAll(".legenditem")
    .append("text")
    .attr("x", - 6)
    .attr("y", 4)
    .attr("dy", ".35em")
    .style("font-size", "10px")
    .style("text-anchor", "end")
    .text(function(d, i) { return legendData[1][i] });

  // toggles for switching between datasets (Leeuwarden, De Bilt, Maastricht)
  g.append("text")
    .attr("class", "toggle")
    .attr("id", "leeuwardenToggle")
    .attr("transform", "translate (" + width + ",100)")
    .style("text-anchor", "end")
    .text("Leeuwarden")
    .on("click", function() {
      g.selectAll(".bilt")
        .style("display", "none")
      g.selectAll(".maastricht")
        .style("display", "none")
      g.selectAll(".leeuwarden")
        .style("display", "inline")
      d3.select(this)
        .attr("fill", "red")
      d3.select("#biltToggle")
        .attr("fill", "black")
      d3.select("#maastrichtToggle")
        .attr("fill", "black")
    })

  g.append("text")
    .attr("class", "toggle")
    .attr("id", "biltToggle")
    .attr("transform", "translate (" + width + ",115)")
    .style("text-anchor", "end")
    .attr("fill", "red")
    .text("De Bilt")
    .on("click", function() {
      g.selectAll(".leeuwarden")
        .style("display", "none")
      g.selectAll(".maastricht")
        .style("display", "none")
      g.selectAll(".bilt")
        .style("display", "inline")
      d3.select(this)
        .attr("fill", "red")
      d3.select("#leeuwardenToggle")
        .attr("fill", "black")
      d3.select("#maastrichtToggle")
        .attr("fill", "black")
    })

  g.append("text")
    .attr("class", "toggle")
    .attr("id", "maastrichtToggle")
    .attr("transform", "translate (" + width + ",130)")
    .style("text-anchor", "end")
    .attr("fill", "black")
    .text("Maastricht")
    .on("click", function() {
      g.selectAll(".leeuwarden")
        .style("display", "none")
      g.selectAll(".maastricht")
        .style("display", "inline")
      g.selectAll(".bilt")
        .style("display", "none")
      d3.select(this)
        .attr("fill", "red")
      d3.select("#leeuwardenToggle")
        .attr("fill", "black")
      d3.select("#biltToggle")
        .attr("fill", "black")
    })

  d3.selectAll(".toggle")
    .style("font-size", "15px")
});
