var svg = d3.select('svg');
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');
var padding = {
  t: 40,
  r: 40,
  b: 60,
  l: 60
};
const maxActors = 20;
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;
const cellWidth = chartWidth / (maxActors + 1);
const cellHeight = chartHeight / (maxActors + 1);

var yearLow = 1874,
  yearHigh = 2017;

var colorScale = d3.scaleLinear()
  .range(['white', 'blue', 'red']);
var xScale = d3.scaleLinear()
  .domain([0, maxActors])
  .range([0, chartWidth]);
var yScale = d3.scaleLinear()
  .domain([0, maxActors])
  .range([chartHeight, 0]);
var chartG = svg.append('g')
  .attr('transform', 'translate(' + [padding.l, padding.t] + ')');
var yAxisG = chartG.append('g')
  .attr('transform', 'translate(' + [-5, -cellHeight / 2] + ')')
  .attr('class', 'axis');
var xAxisG = chartG.append('g')
  .attr('transform', 'translate(' + [cellWidth / 2, chartHeight + 5] + ')')
  .attr('class', 'axis');
xAxisG.call(d3.axisBottom(xScale).ticks(maxActors));
xAxisG.append('text')
  .text("Number of Male Cast Members")
  .attr('dy', padding.b / 2)
  .attr('dx', chartWidth / 2)
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
yAxisG.call(d3.axisLeft(yScale).ticks(maxActors));
yAxisG.append('text')
  .text("Number of Female Cast Members")
  .attr('transform', 'rotate(-90)')
  .attr('dy', -padding.l / 2)
  .attr('dx', -chartHeight / 2)
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')

d3.json('../data/movies.json').then(function(dataset) {
  movies = dataset;
  movies.forEach(function(movie) {
    movie['release_date'] = new Date(movie['release_date']);
  });
  movies = movies.filter(x => x.female_cast > 0 || x.male_cast > 0);
  drawMovies();
});

function getGridVals() {
  let grid = new Array(maxActors + 1);
  for (let i = 0; i < maxActors + 1; i++) {
    grid[i] = new Array(maxActors + 1).fill(0);
  }
  let filtered_movies = movies.filter(function(movie) {
    let year = movie.release_date.getFullYear();
    return yearLow <= year && year <= yearHigh;
  });
  filtered_movies.forEach(function(movie) {
    let m = movie['male_cast'];
    let f = movie['female_cast'];
    if (m + f > 0 && m <= maxActors && f <= maxActors) {
      grid[m][f]++;
    }
  });
  let out = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (i != 0 || j != 0)
        out.push({
          m: i,
          f: j,
          count: grid[i][j]
        });
    }
  }
  return out;
}

function drawMovies() {
  var grid = getGridVals();
  var maxCount = d3.max(grid.map(x => x.count));
  colorScale.domain([0, maxCount / 2, maxCount]);
  // Heatmap
  var cells = chartG.selectAll('.cell')
    .data(grid)
  var cellsEnter = cells.enter()
    .append('g')
    .attr('class', 'cell')
    .attr('transform', d => 'translate(' + [xScale(d.m), yScale(d.f) - cellHeight] + ')')
  cellsEnter.append('rect')
    .attr('width', cellWidth)
    .attr('height', cellHeight)
    .style('fill', d => colorScale(d.count))
    .style('stroke-width', d => d.m == d.f ? 5 : 1)
  // cellsEnter.append("text")
  //   .text(d => d.count)
  //   .attr('text-anchor', 'middle')
  //   .attr('alignment-baseline', 'middle')
  //   .attr('dx', cellWidth / 2)
  //   .attr('dy', cellHeight / 2);
}

function updateMovies() {
  var grid = getGridVals();
  var maxCount = d3.max(grid.map(x => x.count));
  colorScale.domain([0, maxCount / 2, maxCount]);
  // Heatmap
  var cells = chartG.selectAll('.cell')
    .data(grid)
  // .enter();
  cells.selectAll('rect')
    .transition()
    .duration(200)
    .style('fill', d => colorScale(d.count));
  // cells.selectAll("text")
  //   .text(d => d.count)
}

function changeYearLow(year, update = true) {
  let label = document.getElementById('year-low-label');
  let slider = document.getElementById('year-low');
  slider.value = year;
  if (year > yearHigh) {
    changeYearHigh(year, false);
  }
  label.innerHTML = "Year Low: " + year;
  yearLow = year;
  if (update)
    updateMovies();
}

function changeYearHigh(year, update = true) {
  let label = document.getElementById('year-high-label');
  let slider = document.getElementById('year-high');
  slider.value = year;
  if (year < yearLow) {
    changeYearLow(year, false);
  }
  label.innerHTML = "Year High: " + year;
  yearHigh = year;
  if (update)
    updateMovies();
}