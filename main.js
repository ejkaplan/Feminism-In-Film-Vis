// var coffeeData = [
//     { month: "May", sales: 6900 },
//     { month: "June", sales: 14240 },
//     { month: "July", sales: 37500 },
//     { month: "August", sales: 17500 }
// ];

// Data fields: adult, budget, genres, title, poster_path, release_date, revenue, vote_average, year, wave
// vote_count, keywords, male_cast, female_cast, ungendered_cast, male_crew, female_crew, ungendered_crew

// var waveDictionary = {
//     "first": ["Between the First and Second Waves", 1920, 1959],

// }

// var waveTimePeriods = [
//     { name: "Between the First and Second Waves", id: "first", start: 1920, end: 1959},
//     { name: "The Second Wave", id: "second", start: 1960, end: 1980},
//     { name: "The Third Wave", id: "third", start: 1981, end: 2010},
//     { name: "The Fourth Wave", id: "fourth", start: 2011, end: 2017},
// ];

var era = "first";
var start = 1920;
var end = 1959;
var yearsDomain = [];

for (var y = start; y <= end; y++) {
    yearsDomain.push(y);
}



svg = d3.selectAll('svg');
var maleGraph = svg.append('g')
    .attr('id', '.maleGraph')
    .attr('x', 20)
    .attr('y', 50);
var femaleGraph = svg.append('g')
    .attr('id', '.femaleGraph')
    .attr('x', 420)
    .attr('y', 50);
var yearsLabels = svg.append('g')
    .attr('x', 385)
    .attr('y', 50);


d3.csv('../data/movies.csv').then(function(dataset) {

    var waveMovies = dataset.filter(function (d) {
        return d['wave'] == "1";
    })

    var maleDict = {};
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
        yearsDict.push({'year': y, 
            'maleCount': 100 * (maleDict[y]/(maleDict[y] + femaleDict[y])), 
            'femaleCount': 100 * (femaleDict[y]/(maleDict[y] + femaleDict[y]))});
    }



    var yScale = d3.scaleBand()
        .domain(yearsDomain)
        .rangeRound([0,600])
        .padding(0.5);
    var male_wScale = d3.scaleLinear()
        .domain([0,100])
        .range([20,380]);
    var female_wScale = d3.scaleLinear()
        .domain([0,100])
        .range([20,380]);

    
    maleGraph.selectAll('rect')
        .data(yearsDict)
        .enter()
        .append('rect')
        .attr('id', function(d) {return d.year;})
        .attr('x', function(d) {return 380 - male_wScale(d.maleCount);})
        .attr('y', function(d){
            return yScale(d.year);
        })
        .attr('height', yScale.bandwidth())
        .attr('width', function(d){
            return male_wScale(d.maleCount);
        })
        .style('fill', '#2E86C1')
        .exit();


    femaleGraph.selectAll('rect')
        .data(yearsDict)
        .enter()
        .append('rect')
        .attr('id', function(d) {return d.year;})
        .attr('x', 420)
        .attr('y', function(d){
            return yScale(d.year);
        })
        .attr('height', yScale.bandwidth())
        .attr('width', function(d){
            return female_wScale(d.femaleCount);
        })
        .style('fill', '#F1948A');

    yearsLabels.selectAll('text')
        .data(yearsDomain)
        .enter()
        .append('text')



  


// var yAxis =d3.axisLeft(yScale).ticks(4)
// svg.append('g')
//     .attr('class', 'y axis')
//     .attr('transform', 'translate(70,0)')
//     .call(yAxis);
//     svg.append('text')
//             .attr('class', 'y label')
//             .attr('transform', 'translate(20,160)rotate(270)')
// //             .text('Months');
// // var wAxis = d3.axisBottom(wScale).ticks(6);
// svg.append('g')
//     .attr('class', 'x axis')
//     .attr('transform', 'translate(80,250)')
//     .call(wAxis);
//     svg.append('text')
//             .attr('class', 'x label')
//             .attr('transform', 'translate(150,290)')
//             .text('sales');

})
