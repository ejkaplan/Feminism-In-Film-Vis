
function dataPreprocessor(row) {
    return {
        ranking: +row.ranking,
        percent_fem: +row.percent_fem,
        revenue: +row.revenue,
        title: row.title,
        poster_path: "https://image.tmdb.org/t/p/w92" + row.poster_path, 
        vote_average: row.vote_average,
        vote_count: row.vote_count,
        year: row.year,
        wave: row.wave
    }; 
}

d3.csv("../data/TopMoviesWave1.csv", dataPreprocessor).then (function(moviedata) {
    console.log(moviedata);

    // **** Your JavaScript code goes here ****
    var svg = d3.select('svg');

    // Get layout parameters
    var svgWidth = +svg.attr('width');
    var svgHeight = +svg.attr('height');

    var padding = {t: 60, r: 60, b: 60, l: 60};

    // Compute chart dimensions
    var chartWidth = svgWidth - padding.l - padding.r;
    var chartHeight = svgHeight - padding.t - padding.b;
    console.log(chartWidth); // = 980

    //Axes
    var xScale = d3.scaleLinear()
        .domain([1,10])
        .range([0,(chartWidth-98)]); //difference between x coordinates

    var yScalePercent = d3.scaleLinear()
        .domain([0, 100])
        .range([138,0]);

    let xTickLabels = ['#1','#2','#3','#4','#5','#6', '#7', '#8', '#9', '#10'];
    var xAxis = d3.axisBottom(xScale)
        .tickFormat((d,i) => xTickLabels[i]);

    let yTickLabels = ['0%', '20%', '40%', '60%', '80%', '100%'];
    var yAxisPercent = d3.axisLeft(yScalePercent)
        .tickSize(-(chartWidth+5))
        .ticks(6)
        .tickFormat((d,i) => yTickLabels[i]);

    var maxRev = d3.max(moviedata, function(d) {
        return d["revenue"];
    });
    console.log(maxRev);

    var yScaleRevenue = d3.scaleLinear()
        .domain([0, maxRev])
        .range([200,0]);

    var yAxisRevenue = d3.axisLeft(yScaleRevenue)
        .tickSize(-(chartWidth+5))
        .ticks(8);

    // // Code for bar labels
    // svg.selectAll("text")
    //     .data(moviedata)
    //     .enter()
    //     .append("text")
    //     .text(function(d) {
    //         return (Number(d['percent_fem'])) + "%";
    //     })
    //     .attr("x", function (d, i) {
    //         return 60 + 3 + 45 + (i * (chartWidth/10)); //3 is half padding, 45 is half bar
    //     })
    //     .attr("text-anchor", "middle")
    //     .attr("y", function (d) {
    //         return (chartHeight - 300 - Number(d['percent_fem']))-5;
    //     })
    //     .attr("font-family", "sans-serif")
    //     .attr("font-weight", "bold")
    //     .attr("font-size", "13px")
    //     .attr("fill", "black");

    // Draw Axes
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(105,218)') //200 xaxis = 90 y axis for y coord.
        .transition().duration(800)
        .call(xAxis)
        .attr("font-size", "11px");

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(50,80)')
        .transition().duration(800)
        .call(yAxisPercent)
        .attr("font-size", "11px")
        .selectAll('.tick line')
        .attr("stroke", "black")
        .attr('opacity', 0.2);
        //.select(".domain").remove();

    //Axes Labels
    svg.append('text')
        .attr('class', 'x label')
        .attr('transform', 'translate (10, 300)')
        .transition().duration(800)
        .text('Revenue of Top 10 Ranked Movies in Wave 1')
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .attr("fill", "black");

    svg.append('text')
        .attr('class', 'y label')
        .attr('transform', 'translate (15, 50)')
        .transition().duration(800)
        .text('Percentage of Female Cast and Crew in Top 10 Ranked Movies in Wave 1')
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .attr("fill", "black");

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-12, 0])
        .html(function(d, i) {
            console.log(d);
            console.log(i);
            return "<h5>"+d['title']+"</h5><table><thead><tr><td>Year</td><td>Percent Female</td></tr></thead>"
             + "<tbody><tr><td>"+d['year']+"</td><td>"+d['percent_fem']+"%</td></tr></tbody>"
             + "<thead><tr><td>Vote Average</td><td colspan='2'>Vote Count</td></tr></thead>"
             + "<tbody><tr><td>"+d['vote_average']+"</td><td colspan='2'>"+d['vote_count']+"</td></tr></tbody></table>";
        });


    svg.call(toolTip);

    // Creates array of posters using ForLoop
    var imgLinks = [];
    for (let i = 0; i < 10; i++) {
        imgLinks.push(moviedata[i]["poster_path"]);
    };
    console.log(imgLinks);

    var imgs = svg.selectAll("image")
        .data(imgLinks)
        .enter()
        .append("svg:image")
        .attr("x", function (d, i) {
            return  60 + (i * (chartWidth/10)); //98 padding is 6 between each bar
        })
        .attr("y", function (d) {
            return  (chartHeight - 300);
        })
        .attr("width", "92")
        .attr("height", "138")
        .attr("xlink:href", function (d, i){ 
            return imgLinks[i];
        });

    // Code for bars
    var bar = d3.select('svg').selectAll("rect")
        .data(moviedata)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d, i) {
            return  60 + (i * (chartWidth/10)); //98 padding is 6 between each bar
        })
        .attr("y", function (d) {
            return  (chartHeight - 162 - 5 - Number(d['percent_fem']));
        })
        .attr("width", 92)
        .attr("height", function (d) {
            return (5+ Number(d['percent_fem']));
        })
        .attr('fill', 'white')
        .attr('fill-opacity', 0.9)
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);

    // Draw Axes
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(105,418)') //200 xaxis = 90 y axis for y coord.
        .transition().duration(800)
        .call(xAxis)
        .attr("font-size", "11px");

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(50,280)')
        .transition().duration(800)
        .call(yAxisRevenue)
        .attr("font-size", "12px")
        .selectAll('.tick line')
        .attr("stroke", "black")
        .attr('opacity', 0.2);

     // // Code for circles //

    var circles = svg.selectAll("circle")
        .data(moviedata)
        .enter()
        .append("circle");

    circles
        .attr("cx", function (d, i) {
            return  60 + (i * (chartWidth/10)); //98 padding is 6 between each bar
        })
        .attr("cy", 400)
        .attr("r", 5)
        .style ("fill", "teal");


        // .filter (function (d) {
        //     return d.rank == "1" || d.rank =="2" || d.rank =="3";
        // })
        // .style ("fill", "orange")
        // .style ("stroke", "black")
        // .style ("stroke-width", 0.2)
        // .style("opacity", 0.5);


});

   
