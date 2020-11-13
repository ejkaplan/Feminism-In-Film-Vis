function buildKeywords() {

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
  var barBand = chartWidth / 10;
  var barWidth = barBand * 0.8;


  var chartG = svg.append('g')
    .attr('transform', 'translate(' + [padding.l, padding.t] + ')');
  var yAxisG = chartG.append('g');
  const yearSlider = document.getElementById("yearRange");
  const yearLabel = document.getElementById("yearLabel");
  var year = '1975';

  function changeYear(newYear) {
    newYear = "" + newYear;
    // console.log(newYear);
    yearLabel.innerHTML = "Year: " + newYear;
    year = newYear;
    updateChart();
  }

  d3.json('../data/top10_keywords_by_year.json').then(function(dataset) {
    years = dataset;
    updateChart(year);
  });

  function updateChart() {
    // console.log(year);
    var xScale = d3.scaleBand()
      .domain(years[year].map(x => x['keyword']))
      .range([0, chartWidth]);
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(years[year].map(x => x['count']))])
      .range([chartHeight, 0]);
    yAxisG.transition().duration(300).call(d3.axisLeft(yScale));

    chartG.selectAll('.keyword_bar').remove();
    var bars = chartG.selectAll('.keyword_bar')
      .data(years[year])
    var barsEnter = bars.enter()
      .append('g')
      .attr('class', 'keyword_bar')
      .attr('transform', d => 'translate(' + [xScale(d['keyword']), yScale(d['count'])] + ')')

    barsEnter.append('rect')
      .attr('width', barWidth)
      .attr('height', d => chartHeight - yScale(d['count']));
    barsEnter.append('text')
      .text(d => d['keyword'])
      .attr('transform', function(d) {
        var tx = barWidth / 2;
        var ty = chartHeight - yScale(d['count']) - 10;
        return 'translate(' + [tx, ty] + ') rotate(-90)'
      })
  }
}

buildKeywords();