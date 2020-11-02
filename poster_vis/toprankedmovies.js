
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

    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([138,0]);

    let xTickLabels = ['#1','#2','#3','#4','#5','#6', '#7', '#8', '#9', '#10'];
    var xAxis = d3.axisBottom(xScale)
        .tickFormat((d,i) => xTickLabels[i]);

    let yTickLabels = ['0%', '20%', '40%', '60%', '80%', '100%'];
    var yAxis = d3.axisLeft(yScale)
        .tickSize(-(chartWidth+20))
        .ticks(6)
        .tickFormat((d,i) => yTickLabels[i]);

    // Code for bars
    var overlay = d3.select('svg').selectAll("rect")
        .data(moviedata)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return  60 + (i * (chartWidth/10)); //98 padding is 6 between each bar
        })
        .attr("y", function (d) {
            return  (chartHeight - 300 - Number(d['percent_fem']));
        })
        .attr("width", 92)
        .attr("height", function (d) {
            return (Number(d['percent_fem']));
        })
        .attr('fill', '#5f3e36')
        .attr('fill-opacity', 0.4);

    // Code for bar labels
    svg.selectAll("text")
        .data(moviedata)
        .enter()
        .append("text")
        .text(function(d) {
            return (Number(d['percent_fem'])) + "%";
        })
        .attr("x", function (d, i) {
            return 60 + 3 + 45 + (i * (chartWidth/10)); //3 is half padding, 45 is half bar
        })
        .attr("text-anchor", "middle")
        .attr("y", function (d) {
            return (chartHeight - 300 - Number(d['percent_fem']))-5;
        })
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", "13px")
        .attr("fill", "black");

    // Creates array of posters using ForLoop
    var imgLinks = [];
    for (let i = 0; i < 10; i++) {
        imgLinks.push(moviedata[i]["poster_path"]);
    };
    console.log(imgLinks);

    // Add a group to hold the posters
    var posterGroup = svg.append("g")
        .attr("transform", "translate(60,180)")
        .attr("height", 100);

    // Add posters to the group
    var posters = posterGroup.selectAll("img")
        .data(imgLinks)
        .enter()
        .append("img");

    var imgs = svg.selectAll("image")
        .data(imgLinks)
        .enter()
        .append("svg:image")
        .attr("x", function (d, i) {
            return  60 + (i * (chartWidth/10)); //98 padding is 6 between each bar
        })
        .attr("y", function (d) {
            return  (chartHeight - 300 - Number(d['percent_fem']));
        })
        .attr("width", "92")
        .attr("height", "138")
        .attr("xlink:href", function (d, i){ 
            return imgLinks[i];
        });


    // var img = document.createElement("img");
    //     img.src = imgLinks[1];
    // var src = document.getElementById("g")
    //     .appendChild(img);



    // var img = document.createElement("img");
    //     img.src = imgLinks[2];
    // var src = document.getElementById("x")
    //     .appendChild(img);



    // var main = document.getElementById("x");

    // function __makeSVG(tag, attrs)
    // {
    //     var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    //     for (var k in attrs)
    //         el.setAttribute(k, attrs[k]);
    //     return el;
    // }

    // function createImageXY(x, y, url) {
    //     var style = {};
    //     style["x"] = x;
    //     style["y"] = y;
    //     style["width"] = "300";
    //     style["height"] = "100";
    //     style["visibility"] = "visible";
    //     var svgItem = __makeSVG('image', style);
    //     svgItem.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
    //     main.appendChild(svgItem);
    // }

    // createImageXY(2, 2, "https://placekitten.com/400/200");


    // Draw Axes
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(105,180)') //200 xaxis = 90 y axis for y coord.
        .transition().duration(800)
        .call(xAxis)
        .attr("font-size", "11px");

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(50,80)')
        .transition().duration(800)
        .call(yAxis)
        .attr("font-size", "11px")
        .selectAll('.tick line')
        .attr("stroke", "white")
        .attr('opacity', 0.5)
        .select(".domain").remove();

    //Axes Labels
    svg.append('text')
        .attr('class', 'x label')
        .attr('transform', 'translate (10, 300)')
        .transition().duration(800)
        .text('Ranking')
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .attr("fill", "black");

    svg.append('text')
        .attr('class', 'y label')
        .attr('transform', 'translate (15, 50)')
        .transition().duration(800)
        .text('Percentage of Female Cast and Crew in Top 10 Ranked Movies by Wave')
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .attr("fill", "black");


    // var image = new Array();
    
    // for(int i=0;i<20;i++){
    //     image[i] = new Image();
    //     image[i].src = "images/names" + i + ".jpg";
    // }

    // var img = new Image();
    // img.src = 'image.png';
    // img.onclick = function() {
    // window.location.href = 'https://image.tmdb.org/t/p/w92/ppd84D2i9W8jXmsyInGyihiSyqz.jpg';
    // };
    // document.body.appendChild(img);

        // function show_image(src, width, height) {
    //     var img = document.createElement("img");
    //     img.src = "https://image.tmdb.org/t/p/w92/ppd84D2i9W8jXmsyInGyihiSyqz.jpg";
    //     img.width = 92;
    //     img.height = 138;
    //     document.body.appendChild(img);
    // }


});

    // // Code for circles //

    // var circles = svg.selectAll("circle")
    //     .data(baseballdata)
    //     .enter()
    //     .append("circle");

    // circles
    //     .attr("cx", function (d) {
    //         return scaleYear(d.year);
    //     })
    //     .attr("cy",function (d) {
    //         return hrScale(d.homeruns);
    //     })
    //     .attr("r", 2)
    //     .style("opacity", 0.3)
    //     .style ("fill", "teal")


    //     .filter (function (d) {
    //         return d.rank == "1" || d.rank =="2" || d.rank =="3";
    //     })
    //     .style ("fill", "orange")
    //     .style ("stroke", "black")
    //     .style ("stroke-width", 0.2)
    //     .style("opacity", 0.5);

