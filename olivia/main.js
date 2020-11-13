var coffeeData = [
    { month: "May", sales: 6900 },
    { month: "June", sales: 14240 },
    { month: "July", sales: 37500 },
    { month: "August", sales: 17500 }
];

var xScale = d3.scaleBand()
    .domain(['May', 'June', 'July', 'August'])
    .rangeRound([20,360])
    .padding(0.5);

var hScale = d3.scaleLinear()
    .domain([0, 37500])
    .range([0,200]);

var yScale = d3.scaleLinear
    .domain([0,5])
    .range()
var svg = d3.select('svg');

svg.selectAll('rect')
    .data(coffeeData)
    .enter()
    .append('rect')
    .attr('x', function(d){
        return xScale (d.month) +40;
    })
    .attr('y', function(d) {
        return 300 - (40 + hScale(d.sales)); }
    )

    .attr('width', xScale.bandwidth())
    .attr('height', function(d){
        return hScale(d.sales);
    })
    .style('fill', '#5f3e36');

  var xAxis =d3.axisBottom(xScale).ticks(4)

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(40,260)')
    .call(xAxis);

    svg.append('text')
            .attr('class', 'x label')
            .attr('transform', 'translate(200,290)')
            .text('Months');


var hAxis = d3.axisLeft(hScale).ticks(6);

var hAxis = d3.axisRight(yScale).ticks(5);

svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(70,60)')
    .call(hAxis);


svg.append('text')
            .attr('class', 'y label')
            .attr('transform', 'translate(20,160)rotate(270)')
            .text('Coffee Shop Sales ($)');

            
