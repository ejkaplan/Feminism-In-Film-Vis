// Tooltip code adapted from https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html and https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
function buildHeatMap() {

  var svg = d3.select('#heatmap_svg');
  var svgWidth = +svg.attr('width');
  var svgHeight = +svg.attr('height');
  var padding = {
    t: 40,
    r: 40,
    b: 60,
    l: 60
  };
  const maxActors = 15;
  var chartWidth = svgWidth - padding.l - padding.r;
  var chartHeight = svgHeight - padding.t - padding.b;
  const cellWidth = chartWidth / (maxActors + 1);
  const cellHeight = chartHeight / (maxActors + 1);

  var yearLow = 1920,
    yearHigh = 2017;
  var searchTerm = "";
  var tagList;

  var colorScale = d3.scalePow()
    .range(['#FFF4E9', '#366C81', '#a93f55'])
    .exponent(0.5)
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
    .attr('class', 'axis-label')
    .attr('dy', (padding.b / 2) + 10)
    .attr('dx', chartWidth / 2)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
  yAxisG.call(d3.axisLeft(yScale).ticks(maxActors));
  yAxisG.append('text')
    .text("Number of Female Cast Members")
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('dy', (-padding.l / 2) - 10)
    .attr('dx', -chartHeight / 2)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')

  var tooltipDiv = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
  var selectedTags = new Set();

  d3.json('../data/movies.json').then(function(dataset) {
    movies = dataset;
    movies.forEach(function(movie) {
      movie['release_date'] = new Date(movie['release_date']);
    });
    movies = movies.filter(x => x.female_cast > 0 || x.male_cast > 0);
    drawMovies();
  });

  function getFilteredMovies() {
    let filtered_movies = movies.filter(function(movie) {
      let year = movie.release_date.getFullYear();
      if (yearLow <= year && year <= yearHigh) {
        if (selectedTags.size == 0) {
          return true;
        }
        for (const keyword of movie.keywords) {
          if (selectedTags.has(keyword)) {
            return true;
          }
        }
      }
      return false;
    });
    return filtered_movies;
  }

  function getTagList() {
    let tag_counts = {};
    movies.forEach(function(movie) {
      movie.keywords.forEach(function(tag) {
        if (!(tag in tag_counts)) {
          tag_counts[tag] = 1;
        } else {
          tag_counts[tag] += 1;
        }
      })
    });
    out = Object.entries(tag_counts).map(x => ({
      keyword: x[0],
      count: x[1]
    }));
    out = out.filter(x => x.count >= 5);
    out.sort(function(a, b) {
      if (a.count == b.count) return a.keyword > b.keyword ? 1 : -1;
      return a.count > b.count ? -1 : 1;
    });
    return out;
  };

  function getGridVals() {
    let grid = new Array(maxActors + 1);
    for (let i = 0; i < maxActors + 1; i++) {
      grid[i] = new Array(maxActors + 1).fill(0);
    }
    let filtered_movies = getFilteredMovies();
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
    // Functions for enter/exit a cell to show/hide tooltips
    var mouseover = function(d) {
      tooltipDiv
        .transition()
        .duration(200)
        .style("opacity", 1)
      tooltipDiv.html(d.count + " movie(s) with: " + "<br>" + d.m + " " + "credited male actors and " + "<br>" + d.f + " credited female actors")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - cellHeight) + "px");;
      d3.select(this)
        .style("stroke", "#ff8509")
        .style("stroke-width", 4);
    }
    var mouseleave = function(d) {
      tooltipDiv
        .transition()
        .duration(200)
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", '#333333')
        .style('stroke-width', d => d.m == d.f ? 6 : 2.5);
    }
    // Draw the rectangles
    cellsEnter.append('rect')
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .style('fill', d => colorScale(d.count))
      .style("opacity", 1.0)
      .style('stroke-width', d => d.m == d.f ? 6 : 2.5)
      .style('stroke', "#333333")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

    // Populate tag list:
    tagList = getTagList();
    var tagDiv = d3.select(".tagfilter");
    var tags = tagDiv.selectAll('.tagbox')
      .data(tagList);
    var tagsEnter = tags.enter()
      .append('g')
      .attr('class', 'tagbox');
    tagsEnter.append('input')
      .attr('type', 'checkbox')
      .on('change', function(d) {
        if (this.checked) selectedTags.add(d.keyword);
        else selectedTags.delete(d.keyword);
        console.log(selectedTags);
        updateMovies();
      });
    tagsEnter.append('span')
      .html(d => d.keyword + " (" + d.count + ")<br>");
  }

  function updateMovies() {
    var grid = getGridVals();
    var maxCount = d3.max(grid.map(x => x.count));
    colorScale.domain([0, maxCount / 2, maxCount]);
    // Heatmap
    var cells = chartG.selectAll('.cell rect')
      .data(grid)
      .transition()
      .duration(200)
      .style('fill', d => colorScale(d.count));
  }

  function updateTags() {
    // Update Searchable Tags
    var filteredTagList = searchTerm.length > 0 ? tagList.filter(x => x.keyword.includes(searchTerm)) : tagList;
    var tagDiv = d3.select(".tagfilter");
    var tags = tagDiv.selectAll('.tagbox')
      .data(filteredTagList);
    tags.exit().remove();
    var tagSpans = tagDiv.selectAll('.tagbox span')
      .data(filteredTagList)
      .html(d => d.keyword + " (" + d.count + ")<br>");
    var tagBoxes = tagDiv.selectAll('.tagbox input')
      .data(filteredTagList)
    var tagsEnter = tags.enter()
      .append('g')
      .attr('class', 'tagbox');
    tagsEnter.append('input')
      .attr('type', 'checkbox')
      .on('change', function(d) {
        if (this.checked) selectedTags.add(d.keyword);
        else selectedTags.delete(d.keyword);
        console.log(selectedTags);
        updateMovies();
      });
    tagsEnter.append('span')
      .html(d => d.keyword + " (" + d.count + ")<br>");
    tagDiv.selectAll('.tagbox input')
      .property('checked', d => selectedTags.has(d.keyword));
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
  buildHeatMap.changeYearLow = changeYearLow;

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
  buildHeatMap.changeYearHigh = changeYearHigh;

  function changeSearch(searchStr) {
    searchTerm = searchStr.toLowerCase();
    updateTags();
  }
  buildHeatMap.changeSearch = changeSearch;
}

buildHeatMap();