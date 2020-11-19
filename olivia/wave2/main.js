function buildFemaleCastBars() {

  var waveTimePeriods = [{
      name: "Between the First and Second Waves",
      id: "first",
      start: 1920,
      end: 1959
    },
    {
      name: "The Second Wave",
      id: "second",
      start: 1960,
      end: 1980
    },
    {
      name: "The Third Wave",
      id: "third",
      start: 1981,
      end: 2010
    },
    {
      name: "The Fourth Wave",
      id: "fourth",
      start: 2011,
      end: 2017
    },
  ];



  d3.csv('../data/movies_wave2.csv').then(function(dataset) {

    // console.log(dataset);


var extent = d3.extent(dataset, function(d) {
        return +d['Year'];
    })

var xScale = d3.scaleBand()
    .domain([1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980])
    // .domain([1920, 1959])
    .rangeRound([20,1050])
    .padding(0.5);
     


var hScale = d3.scaleLinear()
    .domain ([0,5000])
    .range([400,0]);


var averageScale = d3.scaleLinear()
    .domain([0,10])
    .range([400,0]);


var lineInterpolate = d3.line()
    .x(function(d) { console.log(xScale(d.Year)); return 67 + xScale(d.Year); })
    .y(function(d) { console.log(averageScale(d.avg_female_cast2)); return  60 + averageScale(d.avg_female_cast2) });

var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-12, 0])
        .html(function(d, i) {
            console.log(d);
            console.log(i);
            return "<table><thead><tr><td>Year</td><td>Total Female Cast</td></tr></thead>"
             + "<tbody><tr><td>"+d['Year']+"</td><td>"+d['sum_female_cast2']+"</td></tr></tbody>"
             + "<thead><tr><td></td><td colspan='2'>Avg # Female Cast Per Movie</td></tr></thead>"
             + "<tbody><tr><td>"+"</td><td colspan='2'>"
             +d['avg_female_cast2']+"</td></tr></tbody></table>";
        });



var svg = d3.select('#olivia_div2');



//var nested = d3.nest()
//.key(function(d) {
    //return d.avg_female_cast
//})
//.entries(dataset);

//svg.append('rect')
   // .attr("width", "100%")
    //.attr("height", "100%")
    //.attr("fill", "#171717");

   
svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function(d) {
        return 60 + xScale(d.Year);
    })
    .attr('y', function(d) {
       // console.log(d.female_cast); 
        return (60 + hScale(d.sum_female_cast2)); 
        }
    )




 .attr('width', xScale.bandwidth())
    .attr('height', function(d){
        return  (0 + hScale(0)- hScale(d.sum_female_cast2));
    })
    .style('fill', '#A93F55')
    .style('opacity', '100%')
    .attr('fill', '#A93F55')
     .attr('fill-opacity', 1.0)
      
      .on("mouseover", function(d) {
         toolTip.show(d);
        d3.select(this)
         .attr("stroke", "#A93F55")
          .attr("stroke-width", 3)
          .transition()
          .duration(100)
          .attr("fill-opacity", 1.0);

})
          .on("mouseout", function(d) {
            toolTip.hide(d);
        d3.select(this)
          .attr("stroke", "none")

          .transition()
          .duration(100)
          .attr("fill-opacity", 1.0);
      });




  var xAxis =d3.axisBottom(xScale).ticks(4)

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(60,460)')
    .attr('color',  'black')
    .call(xAxis);

    svg.append('text')
            .attr('class', 'x label')
             .attr("font-family", "Karla")
            .attr('transform', 'translate(560,500)')
            .attr('fill', 'black')
            .attr('font-weight', 'bold')
            .text('Year');





svg.selectAll('.line-plot')
    .data([dataset])
    .enter()
    .append('path')
    .attr('class', 'line-plot')
    .attr('d', lineInterpolate)
    .style('stroke', '#FF8509')

    .style('stroke-width', 2)
    .attr('fill', 'none');
 

var hAxis = d3.axisLeft(hScale).ticks(6);

svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(70,60)')
    .attr('color', '#A93F55')
    .attr('stroke-width', 2)
    .call(hAxis);


svg.append('text')
            .attr('class', 'y label')
            .attr('transform', 'translate(25,350)rotate(270)')
              .attr("font-family", "Karla")
             // .attr("font-size", "10")
             .attr("font-weight", 'bold')
    
            .attr('fill', 'black')
            .text('Total Female Cast Members');



var yAxis = d3.axisRight(averageScale).ticks(5);
 
 svg.append('g')
    .attr('class', 'average axis')
    .attr('stroke-width', 2)
    .attr('transform', 'translate(1120,60)')
    .attr('color', '#FF8509')
    .call(yAxis);


svg.append('text')
            .attr('class', 'average axis')
            .attr('transform', 'translate(1155,110)rotate(-270)')
              .attr("font-family", "Karla")
              .attr('font-weight', 'bold')
              .attr('fill', 'black')
            .text('Average Female Cast Members Per Movie'  );


svg.call(toolTip);

  });

}

buildFemaleCastBars();
