function buildMenVsWomen() {

  //Assign these variables based on scrollytelling

  // var era = "1";
  // var start = 1920;
  // var end = 1959;

  // var era = "1";
  // var start = 1920;
  // var end = 1959;


  // var era = "2";
  // var start = 1960;
  // var end = 1980;

  var era = "3";
  var start = 1981;
  var end = 2010;

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


  svg = d3.selectAll('#harshali_div3');
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
    .attr('font-family', 'Nunito Sans');



  d3.csv('../data/movies.csv').then(function(dataset) {
    

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
      .attr('fill', '#FFD6AD')
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
      .domain([0, 100])
      .range([380, 20]);

    var tickLabels = ["", '20%','40%','60%', '80%', '100%'];
    var maleAxis = d3.axisTop(malewScale).ticks(6);
    maleAxis.tickFormat((d, i) => tickLabels[i]);
    var femaleAxis = d3.axisTop(wScale).ticks(6);
    femaleAxis.tickFormat((d, i) => tickLabels[i]);

    var lineGenerator = d3.line();
    var male20points = [
      [malewScale(20), topPadding],
      [malewScale(20), 600]
    ];

    var male40points = [
      [malewScale(40), topPadding],
      [malewScale(40), 600]
    ];

    var male60points = [
      [malewScale(60), topPadding],
      [malewScale(60), 600]
    ];

    var male80points = [
      [malewScale(80), topPadding],
      [malewScale(80), 600]
    ];

    maleGraph.append('path')
      .attr('d', lineGenerator(male20points))
      .style('stroke','black')
      .style("stroke-dasharray", ("3, 3")) 
      .style('stroke-opacity', '0.3');
    maleGraph.append('path')
      .attr('d', lineGenerator(male40points))
      .style('stroke','black')
      .style("stroke-dasharray", ("3, 3")) 
      .style('stroke-opacity', '0.3');
    maleGraph.append('path')
      .attr('d', lineGenerator(male60points))
      .style('stroke','black')
      .style("stroke-dasharray", ("3, 3")) 
      .style('stroke-opacity', '0.3');
    maleGraph.append('path')
      .attr('d', lineGenerator(male80points))
      .style('stroke','black')
      .style("stroke-dasharray", ("3, 3")) 
      .style('stroke-opacity', '0.3');

//Draw male graph
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
      .attr('height', 10)
      .attr('width', function(d) {
        return wScale(d.maleCount);
      })
      .style('fill', '#366C81')
      .on("mouseover", function(d) {
          toolTip.show(d);
          d3.select(this)
          .attr("stroke", "#366C81")
          .attr("stroke-width", '3')
          .transition()
          .duration(100);})
      .on("mouseout", function(d) {
          toolTip.hide(d);
          d3.select(this)
          .attr("stroke", "none")
          .transition()
          .duration(100);
        });

//Male axis
    maleGraph.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (topPadding) + ')')
      .call(maleAxis)
      .attr('font-family', 'Nunito Sans');

   var female20points = [
      [femaleGraphX + wScale(20) - 20, topPadding],
      [femaleGraphX + wScale(20) - 20, 600]
    ];

    var female40points = [
      [femaleGraphX + wScale(40) - 20, topPadding],
      [femaleGraphX + wScale(40) - 20, 600]
    ];

    var female60points = [
      [femaleGraphX + wScale(60) - 20, topPadding],
      [femaleGraphX + wScale(60) - 20, 600]
    ];

    var female80points = [
      [femaleGraphX + wScale(80) - 20, topPadding],
      [femaleGraphX + wScale(80) - 20, 600]
    ];

    femaleGraph.append('path')
      .attr('d', lineGenerator(female20points))
      .style('stroke', 'black')
      .style("stroke-dasharray", ("3, 3")) 
      .style('stroke-opacity', '0.3');
    femaleGraph.append('path')
      .attr('d', lineGenerator(female40points))
      .style('stroke', 'black')
      .style("stroke-dasharray", ("3, 3")) 
      .style('stroke-opacity', '0.3');
    femaleGraph.append('path')
      .attr('d', lineGenerator(female60points))
      .style('stroke', 'black')
      .style("stroke-dasharray", ("3, 3")) 
      .style('stroke-opacity', '0.3');
    femaleGraph.append('path')
      .attr('d', lineGenerator(female80points))
      .style('stroke', 'black')
      .style("stroke-dasharray", ("3, 3")) 
      .style('stroke-opacity', '0.3');

//Draw female graph
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
      .attr('height', 10)
      .attr('width', function(d) {
        return wScale(d.femaleCount);
      })
      .style('fill', '#A93F55')
      .on("mouseover", function(d) {
          toolTip.show(d);
          d3.select(this)
          .attr("stroke", "#A93F55")
          .attr("stroke-width", '3')
          .transition()
          .duration(100);})
      .on("mouseout", function(d) {
          toolTip.hide(d);
          d3.select(this)
          .attr("stroke", "none")
          .transition()
          .duration(100);
      });

//Female Axis
    femaleGraph.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(400,' + (topPadding) + ')')
      .call(femaleAxis)
      .attr('font-family', 'Nunito Sans');

//Vertical Year Labels
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
      .style('font-weight', 'bold')
      .style('fill', 'black')
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

    svg.call(toolTip);

//Axis labels

    maleGraph.append('text')
      .attr('font-size', 16)
      .text('Actors')
      .attr('x', malewScale(50)-20)
      .attr('y', 20)
      .style('font-family', 'Nunito Sans')
      .style('font-weight', 'bold')
      .style('fill', 'black');

    femaleGraph.append('text')
      .attr('font-size', 16)
      .text('Actresses')
      .attr('x', femaleGraphX + wScale(50) - 50)
      .attr('y', 20)
      .style('font-family', 'Nunito Sans')
      .style('font-weight', 'bold')
      .style('fill', 'black');

  })
}

buildMenVsWomen();