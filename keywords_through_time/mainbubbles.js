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
  var barBand = chartHeight / 10;
  var barHeight = barBand * 0.8;


  var chartG = svg.append('g')
    .attr('transform', 'translate(' + [padding.l, padding.t] + ')');
  var xAxisG = chartG.append('g');
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
  buildKeywords.changeYear = changeYear;

  d3.json('../data/top10_keywords_by_year.json').then(function(dataset) {
    years = dataset;
    drawChart(year);
  });

  function drawChart() {
    var xScale = d3.scaleBand()
      .domain(years[year].map(x => x['keyword']))
      .range([100, 600]);
    
   // var rScale = d3.scaleLinear()
     // .domain([0, d3.max(years[year].map(x => x['count']))])
    //  .range([0, chartWidth]);
  //  xAxisG.call(d3.axisLeft(xScale));

    var circles = chartG.selectAll('.keyword_circle')
      .data(years[year])
      //console.log(years[year]);
    var circlesEnter = circles.enter()
      .append('g')
      .attr('class', 'keyword_circle')
      .attr('transform', d => 'translate(' + [xScale(d['keyword']), chartHeight / 2] + ')')

   // circlesEnter.append('circle')
    //  .attr('transform', d => 'translate(' + [-padding.l, -barBand / 2] + ')')
     // .attr('height', barBand)
     // .attr('width', svgWidth)
      //.style('opacity', (d, i) => i % 2 == 0 ? 1 : 0)
     // .style('fill', '#FFCE99')

    circlesEnter.append('circle')
    .attr("id", d => (d['keyword']))
      .attr("r", function (d) {return 1.5 * d['count']})
      .attr('cx', d => xScale(d['keyword']))
      .style('fill', '#FFD6AD')
      .style('opacity', '50%')
      .attr('stroke', '#FF8509')
     .attr('stroke-width', 2);


    circlesEnter.append('text')
    .attr('x', function (d) {return xScale(d['keyword'])})
    .style('text-anchor', 'middle')
    .attr('y', chartHeight/5)
    //.attr('transform', 'translate(60,60)')
    //.attr('transform', function (d) {return 'rotate(-30)'})

      .text(d => d['keyword'])
  }

  function updateChart() {
    //var yScale = d3.scaleBand()
     // .domain(years[year].map(x => x['keyword']))
    //  .range([0, chartWidth]);
    //var xScale = d3.scaleLinear()
   //   .domain([0, d3.max(years[year].map(x => x['count']))])
    //  .range([0, chartWidth]);
    //xAxisG.transition().duration(300).call(d3.axisTop(xScale));

    var circles = chartG.selectAll('.keyword_circle circle')
      .data(years[year])
      .transition()
      .duration(300)
      .attr("r", function (d) {return 1.5 * d['count']})
    var labels = chartG.selectAll('.keyword_circle text')
      .data(years[year])
      .text(d => d['keyword'])
  }
}

buildKeywords();