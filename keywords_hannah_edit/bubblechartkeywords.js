

var svg = d3.select('svg');

svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#171717");

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 80, r: 80, b: 80, l: 80};

var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;


d3.csv("../data/FeminismMoviesWave4.csv").then (function(moviedata) {
    console.log(moviedata);

var pack = d3.pack()
    .size([width, height])
    .padding(1.5);

