d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
});

var colors = ["#ccece6","#99d8c9","#66c2a4"]

// ensure window is loaded before starting script
window.onload = function(){
  var selectedRectangles = d3.selectAll(".st1")
  selectedRectangles
    .data(colors)
    .style("fill", function(d, i) { return colors[i]})
}
