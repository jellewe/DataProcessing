d3.csv("Merged data.csv", function(data) {
  // margins around plot in pixels
  var margin = {top: 30, right: 30, bottom: 30, left: 70}

  for (i = 0; i < data.length; i++) {
    data[i]["Phonesubscriptions"] = Number(data[i]["Phonesubscriptions"])
    data[i]["GDP"] = Number(data[i]["GDP"])
  }

  // width and height of plot in pixels
  var width = 900 - margin.left - margin.right
  var height = 450 - margin.top - margin.bottom

  var plot = d3.select(".scatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var xScale = d3.scale.linear()
    .domain([d3.min(data, function(d) { return d["Phonesubscriptions"] }),
             d3.max(data, function(d) { return d["Phonesubscriptions"] })])
    .range([0, width])

  var yScale = d3.scale.linear()
    .domain([d3.min(data, function(d) { return d["GDP"]}),
             d3.max(data, function(d) { return d["GDP"] })])
    .range([height, 0])

  // variables for x and y axes
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")

  plot.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
    .call(xAxis)

  plot.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(yAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", "10px")

  // make g element and transform to proper position, append g's for circles
  plot.append("g")
    .attr("class", "field")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .selectAll("circle")
    .data(data)
    .enter()
      .append("circle")

  plot.selectAll("circle")
    .attr("cx", function(d) { return xScale(d["Phonesubscriptions"])})
    .attr("cy", function(d) { return yScale(d["GDP"])})
    .attr("r", "3")
})
