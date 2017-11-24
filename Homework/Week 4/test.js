/*
 * Jelle Witsen Elias
 * University of Amsterdam
 * studentno. 10753532
 *
 * fills in a test svg as legend for a graph
 */

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
});

var colors = ["#ccece6","#99d8c9","#66c2a4"]
var text = ["Test 1", "Test 2", "Test 3", "Test 4"]

// ensure window is loaded before starting script
window.onload = function(){
  var selectedRectangles = d3.selectAll(".st1")
  selectedRectangles
    .data(colors)
    .style("fill", function(d, i) { return colors[i]})

  var selectedText = d3.select("#Laag_1")
    .selectAll("text")
    .data(text)
    .enter().append("text")
      .attr("x", 70)
      .attr("y", function(d, i) { return (i + 1) * 40 })
      .text( function(d) { return d } )
}
