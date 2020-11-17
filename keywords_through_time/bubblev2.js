function buildKeywords() {

  const rCoef = 13;

  var svg = d3.select('#eliot_keywords');
  var svgWidth = +svg.attr('width');
  var svgHeight = +svg.attr('height');
  var padding = {
    t: 40,
    r: 40,
    b: 40,
    l: 40
  };

  var chartWidth = svgWidth - padding.l - padding.r;
  var chartHeight = svgHeight - padding.t - padding.b;
  var chartG = svg.append('g')
    .attr('transform', 'translate(' + [padding.l + chartWidth / 2, padding.t + chartHeight / 2] + ')');

  const yearSlider = document.getElementById("yearRange");
  const yearLabel = document.getElementById("yearLabel");
  var year = 1950;

  function getTagList(year) {
    let tag_counts = {};
    let filteredMovies = movies.filter(x => x.release_date.getFullYear() == year)
    filteredMovies.forEach(function(movie) {
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
      count: x[1],
      r: rCoef * Math.sqrt(x[1])
    }));
    out.sort(function(a, b) {
      if (a.count == b.count) return a.keyword > b.keyword ? 1 : -1;
      return a.count > b.count ? -1 : 1;
    });
    out = out.slice(0, 10);
    return d3.packSiblings(out);
  };

  var movies, keywords;
  d3.json('../data/movies.json').then(function(dataset) {
    movies = dataset;
    movies.forEach(function(movie) {
      movie['release_date'] = new Date(movie['release_date']);
    });
    keywords = getTagList(year);
    drawChart();
  })

  function changeYear(newYear) {
    newYear = newYear;
    yearLabel.innerHTML = "Year: " + newYear;
    year = newYear;
    keywords = getTagList(year);
    updateChart();
  }
  buildKeywords.changeYear = changeYear;

  var toolTipBubble = d3.select("body")
    .append("div")
    .attr("class", "tooltip-bubble")
    .style("opacity", 0);

  function drawChart() {
    var circles = chartG.selectAll('.keyword_circle')
      .data(keywords);
    var circlesEnter = circles.enter()
      .append('g')
      .attr('class', 'keyword_circle')
    circlesEnter.append('circle')
      .attr("r", d => d.r)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .style('fill', "#D4999F")
      .on('mouseover', function (d) {
        d3.select(this)
          .style('fill', "#BA6473");
        toolTipBubble
          .style("opacity", 1.0)
          .html("Count: " + d.count)
          .style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mousemove', function (d) {
        d3.select(this)
        toolTipBubble
          .style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .style('fill', "#D4999F");
        toolTipBubble
          .style("opacity", 0.0);
      })

    circlesEnter.append('text')
      .style('text-anchor', 'middle')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .text(d => d.keyword)
      .style("font-family", "Karla")
      .style("font-size", "12px")
      .style("fill", "black");
  }

  function updateChart() {
    chartG.selectAll('.keyword_circle circle')
      .data(keywords)
      .transition()
      .duration(200)
      .attr("r", d => d.r)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    chartG.selectAll('.keyword_circle text')
      .data(keywords)
      .transition()
      .duration(200)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .text(d => d.keyword);
  }
}

buildKeywords();