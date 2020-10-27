var svg = d3.select('svg');
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');
var padding = 20;

var chartG = svg.append('g');
const yearSlider = document.getElementById("yearRange");
const yearLabel = document.getElementById("yearLabel");
var year = '1975';

function changeYear(newYear) {
  newYear = "" + newYear;
  console.log(newYear);
  yearLabel.innerHTML = "Year: " + newYear;
  year = newYear;
  updateChart();
}

d3.json('../data/top10_keywords_by_year.json').then(function(dataset) {
  years = dataset;
  updateChart(year);
});

function updateChart() {
  console.log(year);
  var xScale = d3.scaleBand()
    .domain(years[year].map(x => x['keyword']))
    .range([padding, svgWidth - padding]);
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(years[year].map(x => x['count']))])
    .range([padding, svgHeight - padding]);
  var boxes = svg.selectAll('keyword_box')
    .data(years[year])
  boxes.enter()
    .append('rect')
    .attr('class', 'keyword_box')
    .attr('y', d => svgHeight - yScale(d['count']))
    .attr('x', d => xScale(d['keyword']))
    .attr('width', svgWidth / 10 - 20)
    .attr('height', d => yScale(d['count']))
  boxes.exit()
    .remove();
}