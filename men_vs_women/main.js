
// Data fields: adult, budget, genres, title, poster_path, release_date, revenue, vote_average, year, wave
// vote_count, keywords, male_cast, female_cast, ungendered_cast, male_crew, female_crew, ungendered_crew

// var waveTimePeriods = [
//     { name: "Between the First and Second Waves", id: "first", start: 1920, end: 1959},
//     { name: "The Second Wave", id: "second", start: 1960, end: 1980},
//     { name: "The Third Wave", id: "third", start: 1981, end: 2010},
//     { name: "The Fourth Wave", id: "fourth", start: 2011, end: 2017},
// ];

//Assign these variables based on scrollytelling
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
    .attr('id', 'labels')
    .attr('x', 385)
    .attr('y', 50);


d3.csv('movies.csv').then(function(dataset) {

    //Add conditional logic for this to change based on wave
    var waveMovies = dataset.filter(function (d) {
        return d['wave'] == "1";
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
        yearsDict.push({'year': y, 
            'maleCount': 100 * (maleDict[y]/(maleDict[y] + femaleDict[y])), 
            'femaleCount': 100 * (femaleDict[y]/(maleDict[y] + femaleDict[y]))});
    }



    var yScale = d3.scaleBand()
        .domain(yearsDomain)
        .rangeRound([0,600])
        .padding(0.35);
    var wScale = d3.scaleLinear()
        .domain([0,100])
        .range([20,380]);

    var malewScale = d3.scaleLinear()
        .domain([100,0])
        .range([20,380]);

    var maleAxis = d3.axisTop(malewScale).ticks(2);
    var femaleAxis = d3.axisTop(wScale).ticks(2);
    
    maleGraph.selectAll('rect')
        .data(yearsDict)
        .enter()
        .append('rect')
        .attr('id', function(d) {return d.year;})
        .attr('x', function(d) {return 380 - wScale(d.maleCount);})
        .attr('y', function(d){
            return yScale(d.year);
        })
        .attr('height', yScale.bandwidth())
        .attr('width', function(d){
            return wScale(d.maleCount);
        })
        .style('fill', '#2E86C1');

    maleGraph.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,20)')
            .call(maleAxis);

    maleGraph.select(".x.axis")
        .select(".domain")
        .style('stroke', "#fff");


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
            return wScale(d.femaleCount);
        })
        .style('fill', '#F1948A');

    femaleGraph.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(400,20)')
            .call(femaleAxis);

    femaleGraph.select(".x.axis")
        .select(".domain")
        .style('stroke', "#fff");

    var labels = yearsLabels.selectAll('text')
        .data(yearsDict)
        .enter()
        .append('text')
        .attr('x', 387)
        .attr('y', function(d) {return 6+yScale(d.year);})
        .text(function(d) {return d.year;})
        .attr('font-size', 2+yScale.bandwidth())
        .attr('font-family', 'sans-serif');


})
