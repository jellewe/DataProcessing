/*
 * Jelle Witsen Elias
 * Univesity of Amsterdam: data processing
 * studentno. 10753532
 *
 * Draws a scatterplot with data about mobile phone subscriptions and GDP per
 * country in HTML.
 */

// open csv data  and check for error
d3.csv("Merged data.csv", function(error, data) {
  if (error) throw error;

  // margins around plot in pixels
  var margin = {top: 30, right: 30, bottom: 50, left: 70};

  // convert GDP nad phonesubscription data to JS Numbers
  for (i = 0; i < data.length; i++) {
    data[i]["Phonesubscriptions"] = Number(data[i]["Phonesubscriptions"]);
    data[i]["GDP"] = Number(data[i]["GDP"]);
  };

  // width and height of plot in pixels
  var width = 900 - margin.left - margin.right;
  var height = 450 - margin.top - margin.bottom;

  // select plot with specified width and height
  var plot = d3.select(".scatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // scales for x and y dimensions
  var xScale = d3.scale.linear()
    .domain([d3.min(data, function(d) { return d["Phonesubscriptions"] }),
             d3.max(data, function(d) { return d["Phonesubscriptions"] })])
    .range([0, width]);
  var yScale = d3.scale.linear()
    .domain([d3.min(data, function(d) { return d["GDP"]}),
             d3.max(data, function(d) { return d["GDP"] })])
    .range([height, 0]);

  // scale for colors of dots in scatterplot
  var color = d3.scale.category10();

  // tooltip to show when hovering above dot
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // variables for x and y axes
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  // g element for x axis
  plot.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
    .call(xAxis)
    .append("text")
      .style("text-anchor", "end")
      .attr("dx", "21.5em")
      .attr("dy", "4em")
      .text("Mobile phone subscriptions per 100 people");

  // g element for y axis
  plot.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(yAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", "10px");

  // text to show next to y axis
  plot.select(".y")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("yScale", 6)
      .attr("dy", "1.5em")
      .style("text-anchor", "end")
      .text("GDP");

  // make g element and transform to proper position, append g's for circles
  plot.append("g")
    .attr("class", "field")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .selectAll("circle")
    .data(data)
    .enter()
      .append("circle");

  // give circles proper positions in plot, and make tooltip appear
  plot.selectAll("circle")
    .attr("cx", function(d) { return xScale(d["Phonesubscriptions"])})
    .attr("cy", function(d) { return yScale(d["GDP"])})
    .attr("r", "3")
    .style("fill", function(d) { return color(d["Continent"])})
    .on("mouseover", function(d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9)
        tooltip.html(d["Country"])
          .style("left", (d3.mouse(this)[0]) + "px")
          .style("top", ((d3.mouse(this)[1]) - 28) + "px");
        })
    .on("mouseout", function(d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0)
        });

  // group element for legend
  var legend = plot.append("g")
    .attr("class", "legend")
    .attr("transform", "translate (" + width + "," + margin.top + ")");

  // append group elements to legend group for every element of legend
  legend.selectAll(".legenditem")
    .data(color.domain())
    .enter().append("g")
        .attr("class", "legenditem")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"});

  // make squares with specific for legend items
  legend.selectAll(".legenditem")
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  // put text next to legend squares
  legend.selectAll(".legenditem")
    .append("text")
    .attr("x", - 6)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d });
});
