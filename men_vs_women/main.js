function buildMenVsWomen() {
  // Data fields: adult, budget, genres, title, poster_path, release_date, revenue, vote_average, year, wave
  // vote_count, keywords, male_cast, female_cast, ungendered_cast, male_crew, female_crew, ungendered_crew

  // var waveTimePeriods = [
  //     { name: "Between the First and Second Waves", id: "first", start: 1920, end: 1959},
  //     { name: "The Second Wave", id: "second", start: 1960, end: 1980},
  //     { name: "The Third Wave", id: "third", start: 1981, end: 2010},
  //     { name: "The Fourth Wave", id: "fourth", start: 2011, end: 2017},
  // ];

  //Assign these variables based on scrollytelling
  var era = "1";
  var start = 1920;
  var end = 1959;


  // var era = "2";
  // var start = 1960;
  // var end = 1980;

  // var era = "3";
  // var start = 1981;
  // var end = 2010;

  // var era = "4";
  // var start = 2011;
  // var end = 2017;

  //-------------------

  //Dimension-related vars
  var topPadding = 50;
  var femaleGraphX = 420;
  var yearGap = 40;

  var yearsDomain = [];

  for (var y = start; y <= end; y++) {
    yearsDomain.push(y);
  }


  svg = d3.selectAll('#harshali');
  var maleGraph = svg.append('g')
    .attr('id', '.maleGraph')
    .attr('x', 0)
    .attr('y', topPadding);
  var femaleGraph = svg.append('g')
    .attr('id', '.femaleGraph')
    .attr('x', femaleGraphX)
    .attr('y', topPadding);
  var yearsLabels = svg.append('g')
    .attr('id', 'labels')
    .attr('x', 385)
    .attr('y', topPadding)
    .style('fill', '#E5F77D')
    .attr('font-family', 'futura');


  d3.csv('./data/movies.csv').then(function(dataset) {

    var waveMovies = dataset.filter(function(d) {
      return d['wave'] == era;
    })

    var maleDict = {}; //{year:sum}
    var femaleDict = {};
    var yearsDict = [];

    waveMovies.forEach(calculateGenderSums);

    function calculateGenderSums(row) {
      if (row.year in maleDict) {

        var male = +row.male_cast;
        var female = +row.female_cast;

        maleDict[+row.year] += male;
        femaleDict[+row.year] += female;
      } else {
        maleDict[+row.year] = 0;
        femaleDict[+row.year] = 0;
      }

    }

    for (var y = start; y <= end; y++) {
      yearsDict.push({
        'year': y,
        'maleCount': Math.round(100 * (maleDict[y] / (maleDict[y] + femaleDict[y])).toFixed(4)),
        'femaleCount': Math.round(100 * (femaleDict[y] / (maleDict[y] + femaleDict[y])).toFixed(4))
      });
    }


    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-12, 0])
      .html(function(d, i) {
        return "<table><thead><tr><td>"+d.year+"</td></tr></thead>" +
          "<tbody><tr><td>Percentage of Actors </td><td>" + d.maleCount + '%' + "</td></tr></tbody>" +
          "<tbody><tr><td>Percentage of Actresses </td><td>" + d.femaleCount + '%' + "</td></tr></tbody>" +
          "</table>";
      });

    var yScale = d3.scaleBand()
      .domain(yearsDomain)
      .rangeRound([topPadding, 600])
      .padding(0.35);
    var wScale = d3.scaleLinear()
      .domain([0, 100])
      .range([20, 380]);
    var malewScale = d3.scaleLinear()
      .domain([100, 0])
      .range([20, 380]);

    var tickLabels = ['', '50%', '100%'];
    var maleAxis = d3.axisTop(malewScale).ticks(2);
    maleAxis.tickFormat((d, i) => tickLabels[2 - i]);
    var femaleAxis = d3.axisTop(wScale).ticks(2);
    femaleAxis.tickFormat((d, i) => tickLabels[i]);


    maleGraph.selectAll('rect')
      .data(yearsDict)
      .enter()
      .append('rect')
      .attr('id', function(d) {
        return d.year;
      })
      .attr('x', function(d) {
        return 380 - wScale(d.maleCount);
      })
      .attr('y', function(d) {
        return yScale(d.year);
      })
      .attr('height', yScale.bandwidth())
      .attr('width', function(d) {
        return wScale(d.maleCount);
      })
      .style('fill', '#1861F8')
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

    maleGraph.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (topPadding) + ')')
      .call(maleAxis)
      .style('stroke', '#E5F77D')
      .attr('font-family', 'futura');

    var lineGenerator = d3.line();
    var points = [
      [malewScale(50), topPadding],
      [malewScale(50), 600]
    ];

    maleGraph.append('path')
      .attr('d', lineGenerator(points))
      .style('stroke', '#E5F77D')
      .style('stroke-dasharray', '5,5');

    femaleGraph.selectAll('rect')
      .data(yearsDict)
      .enter()
      .append('rect')
      .attr('id', function(d) {
        return d.year;
      })
      .attr('x', femaleGraphX)
      .attr('y', function(d) {
        return yScale(d.year);
      })
      .attr('height', yScale.bandwidth())
      .attr('width', function(d) {
        return wScale(d.femaleCount);
      })
      .style('fill', '#9F1D5A')
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

    femaleGraph.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(400,' + (topPadding) + ')')
      .call(femaleAxis)
      .style('stroke', '#E5F77D')
      .attr('font-family', 'futura');

    var points = [
      [femaleGraphX + wScale(50) - 20, topPadding],
      [femaleGraphX + wScale(50) - 20, 600]
    ];

    maleGraph.append('path')
      .attr('d', lineGenerator(points))
      .style('stroke', '#E5F77D')
      .style('stroke-dasharray', '5,5');

    console.log(yScale.bandwidth());

    var labels = yearsLabels.selectAll('text')
      .data(yearsDict)
      .enter()
      .append('text')
      .attr('x', 385)
      .attr('y', function(d) {
        return yScale(d.year) + (12 * 0.75);
      })
      .text(function(d) {
        return d.year;
      })
      .attr('font-size', 12)
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);


    svg.call(toolTip);

  })
}

buildMenVsWomen();