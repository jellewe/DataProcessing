/**
 * Jelle Witsen Elias
 * University of Amsterdam
 * studentno. 10753532
 * 17-11-2017
 *
 * Draws a barchart with KNMI weather data in an html svg.
 */

d3.json("KNMI_data.json", function(data) {
  // margins around chart in pixels
  var margin = {top: 70, right: 30, bottom: 100, left: 40}

  // width and height of chart in pixels
  var width = 900 - margin.left - margin.right
  var height = 450 - margin.top - margin.bottom

  // make date and rainfall variables in dict JS numbers
  for (i = 0; i < data.length; i++) {
    data[i]['date'] = Number(data[i]['date'])
    data[i]['rainfall'] = Number(data[i]['rainfall'])
  }

  // variable for width of bars
  var barWidth = width / data.length;

  // variable for chart
  var chart = d3.select(".chart")

      // set width and height of chart
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    // transform g element to proper position
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  // make tooltip with opacity 0 (it should not show up when not hovering above it)
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // scale for y dimension with domain of 0 to max rainfall value
  var yScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.rainfall })])
    .range([height, 0])

  // scale for x dimension
  var xScale = d3.scale.linear()
    .domain([d3.min(data, function(d) { return d.date }),
             d3.max(data, function(d) { return d.date })])
    .range([barWidth / 2, width - barWidth / 2])

  // convert data numbers to strings with dashes between elements
  for (i = 0; i < data.length; i++){
      data[i].date = String(data[i].date)
      date = data[i].date
      date = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8)
      data[i].date = date
  }

  // variables for x and y axes
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(data.length)
    .tickFormat(function(d, i) { return data[i].date })
    .orient("bottom")
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10)

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

  // append y axis
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("yScale", 6)
      .attr("dy", "1.5em")
      .style("text-anchor", "end")
      .text("Rainfall (mm)")

  // make group element for bars
  chart.append("g")
    .attr("class", "bars")

  // select all bars and make new bar for every data element
  var barSelection = chart.select(".bars").selectAll("rect")
    .data(data)
    .enter().append("rect")

  // draw bars in chart. Also implements interaction
    .attr("x", function(d, i) { return i * barWidth })
    .attr("y", function(d) { return yScale(d.rainfall) })
    .attr("height", function(d) { return height - yScale(d.rainfall) })
    .attr("width", barWidth - 1)
    .on("mouseover", function(d) {
            tooltip.transition()
              .duration(200)
              .style("opacity", .9)
            tooltip.html(d.rainfall + " mm<br/>")
              .style("left", (d3.mouse(this)[0]) + "px")
              .style("top", ((d3.mouse(this)[1]) - 28) + "px");
            })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0)
    })
});
