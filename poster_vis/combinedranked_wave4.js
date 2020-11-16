function buildTopRanked() {
	// console.log("inTopRanked");


	function dataPreprocessor(row) {
	    return {
		    ranking: +row.ranking,
		    percent_fem: +row.percent_fem,
		    revenue: +row.revenue,
		    title: row.title,
		    poster_path: "https://image.tmdb.org/t/p/w185" + row.poster_path,
		    vote_average: row.vote_average,
		    vote_count: row.vote_count,
		    year: row.year,
		    wave: row.wave,
		    alt_revenue: +row.alt_revenue,
		    alt_title: row.alt_title,
	    };
	}

	// **** Your JavaScript code goes here ****
	var svg = d3.select('#hannah_div5');

	svg.append("rect")
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("fill", "#FFF4E9");

	  // Get layout parameters
	var svgWidth = +svg.attr('width');
	var svgHeight = +svg.attr('height');

	var padding = {
	    t: 80,
	    r: 80,
	    b: 80,
	    l: 80
	};

	  //Compute chart dimensions
	var chartWidth = svgWidth - padding.l - padding.r;
	var chartHeight = svgHeight - padding.t - padding.b;
	  // console.log(chartWidth);

	var imageWidth = 110;
	var imageHeight = 165.3;

	// var allButtons = svg.append("div")
	//  	.attr("transform", "translate (10,20)")
	//    	.attr("id", "option")

	// var button1 = allButtons.append("g")
	// 	.attr("class", "filter selected")
	// 	.attr("value", "all-letters")

	// 	button1.append("rect")
	// 		.attr("height", 20)
	// 		.attr("width", 65)
	// 		.attr("rx", 3)
	// 		.attr("ry", 3)

	// 	button1.append("text")
	// 		.text("All Letters")
	// 		.attr("x", 4)
	// 		.attr("dy", "1.3em")

	// var button2 = allButtons.append("g")
	// 	.attr("class", "filter")
	// 	.attr("value", "all-letters")
	// 	.attr("transform", "translate (100,0)")

	// 	button2.append("rect")
	// 		.attr("height", 20)
	// 		.attr("width", 98)
	// 		.attr("rx", 3)
	// 		.attr("ry", 3)

	// 	button2.append("text")
	// 		.text("Only Consontants")
	// 		.attr("x", 4)
	// 		.attr("dy", "1.3em")


	d3.csv("../data/CombinedMoviesWave4.csv", dataPreprocessor).then(function(moviedata) {
	    console.log(moviedata);

	    // X SCALE
	    var xAxisLabels = [];
	    for (let i = 0; i < 10; i++) {
	      xAxisLabels.push("#" + (moviedata[i]["ranking"]));
	    };
	    // console.log(xAxisLabels);

	    var xScaleCustom = d3.scalePoint()
	      .domain(xAxisLabels, function(d, i) {
	        return d.xAxisLabels;
	      })
	      .range([0, chartWidth])
	      .padding(0.75);

	    var xAxisCustom = d3.axisBottom(xScaleCustom);

	    // Y SCALE, TOP GRAPH
	    var yScalePercent = d3.scaleLinear()
	      .domain([0, 100])
	      .range([imageHeight, 0]);

	    let yTickLabels = ['0%', '20%', '40%', '60%', '80%', '100%'];

	    var yAxisPercent = d3.axisLeft(yScalePercent)
	      .tickSize(-(chartWidth + 0))
	      .ticks(6)
	      .tickFormat((d, i) => yTickLabels[i]);

	    //Y SCALES, BOTTOM GRAPH

	    //Grabs highest array from both data sets
	    var maxArray = [];
	    var max1 = d3.max(moviedata, function(d) {
	    	return d["revenue"];
	    });
	    maxArray.push(max1);
	   	var max2 = d3.max(moviedata, function(d) {
	    	return d["alt_revenue"];
	    });
	    maxArray.push(max2);
	    console.log(maxArray);

	    var maxRev = d3.max(maxArray);
	    console.log(maxRev);
	    // var maxRev = d3.max(moviedata, function(d) {
	    //   return d["revenue"];
	    // });

	    var yScaleRevenue = d3.scaleLinear()
	      .domain([0, (maxRev + (maxRev / 6))])
	      .range([(imageHeight * 1.3), 0]);

	    var yAxisRevenue = d3.axisLeft(yScaleRevenue)
	      .tickSize(-(chartWidth + 0)) //(padding.r/2)
	      .ticks(5)
	      .tickFormat(d3.formatPrefix("$0.1", 1e6));

	    //DRAW AXES
	    svg.append('g')
	      .attr('class', 'y axis')
	      .attr('transform', 'translate(100,80)')
	      //.transition().duration(800)
	      .call(yAxisPercent)
	      .call(g => g.select(".domain").remove())
	      .call(g => g.selectAll(".tick line")
	        .attr("stroke", "black")
	        .attr("stroke-opacity", 0.5)
	        .attr("stroke-dasharray", "3,3"))
	      .call(g => g.selectAll(".tick text")
	      	.style("text-anchor", "start")
	        .attr("x", 1)
	        .attr("y", -8));

	    svg.append('g')
	      .attr('class', 'x axis')
	      .attr('transform', 'translate(130, 505)') //200 xaxis = 90 y axis for y coord.
	      // .transition().duration(800)
	      .call(xAxisCustom)
	      .call(g => g.select(".domain").remove());

	    svg.append('g')
	      .attr('class', 'y axis')
	      .attr('transform', 'translate(100,290)')
	      //.transition().duration(100)
	      .call(yAxisRevenue)
	      // .attr("stroke", "white")
	      .call(g => g.select(".domain").remove())
	      .call(g => g.selectAll(".tick:not(:first-of-type) line")
	        .attr("stroke", "black")
	        .attr("stroke-opacity", 0.5)
	        .attr("stroke-dasharray", "3,3"))
	      .call(g => g.selectAll(".tick text")
	      	.style("text-anchor", "start")
	        .attr("x", 1)
	        .attr("y", -8));

	    // DRAW AXIS TEXT
	    svg.append('text')
	      .attr('class', 'axis-label')
	      .text('Percent Female Cast & Crew')
	      .attr('transform', 'translate (70, 240), rotate (-90)')
	      .transition().duration(800)
	      .attr("fill", "black");

	    svg.append('text')
	      .attr('class', 'axis-label')
	      .text('Film Revenue (in USD)')
	      .attr('transform', 'translate (70, 450), rotate (-90)')
	      .transition().duration(800)
	      .attr("fill", "black");

	    svg.append('text')
	      .attr('class', 'axis-label')
	      .text('Top 10 Ranked Films in the Wave')
	      .attr('transform', 'translate (645, 545)')
	      .transition().duration(800)
	      .attr("fill", "black")

	    // Creates array of posters using ForLoop
	    var imgLinks = [];
	    for (let i = 0; i < 10; i++) {
	      imgLinks.push(moviedata[i]["poster_path"]);
	    };
	    // .log(imgLinks);

	    // DRAWS POSTERS
	    var imgs = svg.selectAll("image")
	      .data(imgLinks)
	      .enter()
	      .append("svg:image")
	      .attr("x", function(d, i) {
	        return 125 + 40 + (0.95 * i * (chartWidth / 10)); //98 padding is 6 between each bar
	      })
	      .attr("y", function(d) {
	        return (chartHeight - 360);
	      })
	      .attr("width", imageWidth)
	      .attr("height", imageHeight) //need to cite height to cut off images taller
	      .attr("xlink:href", function(d, i) {
	        return imgLinks[i];
	      });

	    //POSTER TOOL TIP
	    var toolTipPoster = d3.tip()
	      .attr("class", "d3-tip")
	      .offset([-12, 0])
	      .html(function(d, i) {
	        //console.log(d);
	        //console.log(i);
	        return "<h5>" + "#" + d['ranking'] + ". " + d['title'] + " (" + d['year'] + ")" + "</h5> <table><thead><tr><td>Vote Average</td><td colspan='2'>Vote Count</td></tr></thead>" +
	          "<tbody><tr><td>" + d['vote_average'] + "</td><td colspan='2'>" + d['vote_count'] + " Votes" + "</td></tr></tbody> </table>";
	      });
	    // <td>"+d['vote_average']+" Rating, " + d['vote_count'] + " Votes" + "</td><td>Votes</td></tr></thead>"
	    //      + "<tbody><tr><td>"+d['year']+"</td><td>"+d['percent_fem']+"%</td></tr></tbody>"
	    //      + "<thead><tr>
	    svg.call(toolTipPoster);

	    // GROUP FOR BARS
	    var barGroup = svg.selectAll("bars")
	      .data(moviedata)
	      .enter()
	      .append("g");

	    barGroup.append("rect")
	      .attr("class", "posterBar")
	      .attr("x", function(d, i) {
	        return 125 + 40 + (0.95 * i * (chartWidth / 10)); //98 padding is 6 between each bar
	      })
	      .attr("y", function(d) {
	        return (chartHeight - 360);
	      })
	      .attr("width", imageWidth)
	      .attr("height", imageHeight)
	      .attr('fill', 'white')
	      .attr('fill-opacity', 0.8)
	      .on('mouseover', function(d, i) {
	        toolTipPoster.show(d);
	        d3.select(this)
	          .transition()
	          .duration('200')
	          .attr('opacity', '0.0');
	      })
	      .on('mouseout', function(d, i) {
	        toolTipPoster.hide(d);
	        d3.select(this)
	          .transition()
	          .duration('200')
	          .attr('opacity', '1.0');
	      })

	    barGroup.append("rect")
	      .attr("class", "percentageBar")
	      .attr("x", function(d, i) {
	        return 125 + 40 + (0.95 * i * (chartWidth / 10));
	      })
	      .attr("y", function(d) {
	        return (chartHeight - 199 - Number(d['percent_fem']));
	      })
	      .attr("width", imageWidth)
	      .attr("height", function(d) {
	        return (5 + Number(d['percent_fem']));
	      })
	      .attr('fill', '#A93F55')
	      .attr("stroke", "#A93F55")
	      .attr('fill-opacity', 0.8)
	      .on("mouseover", function(d) {
	        d3.select(this)
	          .attr("stroke-width", 4)
	          .transition()
	          .duration(100)
	          .attr("fill-opacity", 1.0);
	        // d3.selectAll("circle")
	        //     .attr("fill", function () {
	        //         if
	        //     })
	        // do similar thing on mouseout
	      })
	      .on("mouseout", function(d) {
	        d3.select(this)
	          .attr("stroke-width", 0)
	          .transition()
	          .duration(100)
	          .attr("fill-opacity", 0.8);
	      });

	    //Code for bar labels
	    barGroup
	      .append("text")
	      .text(function(d) {
	        return (Number(d['percent_fem'])) + "%";
	      })
	      .attr("x", function(d, i) {
	        return 125 + 40 + (imageWidth / 2) + (0.95 * i * (chartWidth / 10));
	      })
	      .attr("y", function(d) {
	        return (chartHeight - 188 - Number(d['percent_fem']));
	      })
	      .attr("text-anchor", "middle")
	      .attr("font-family", "sans-serif")
	      .attr("font-size", "10px")
	      .attr("font-weight", 100)
	      .attr("fill", "white");

	    var toolTipCircle = d3.select("body")
	      .append("div")
	      .attr("class", "tooltip-circle")
	      .style("opacity", 0);

	    // Code for circles //
	    var circles = svg.selectAll("circle")
	      .data(moviedata)
	      .enter()
	      .append("circle")
	      .attr("cx", function(d, i) {
	        return 124 + 40 + (imageWidth / 2) + (0.95 * i * (chartWidth / 10)); //98 padding is 6 between each bar
	      })
	      .attr("cy", function(d) {
	        return (yScaleRevenue(d["revenue"])) + 285;
	      })
	      .attr("r", 7)
	      .attr("fill", "#A93F55")
	      .attr("stroke", "#A93F55")
	      .on("mouseover", function(d) {
	        d3.select(this)
	          .attr("stroke-width", 4);
	        toolTipCircle
	          .transition()
	          .duration(100)
	          .style("opacity", 1.0);
	        let formattednum = function(d) {
	          return d["title"] + "<br>" + "$" + d3.format(",.2f")(d["revenue"]);
	        }
	        toolTipCircle
	          .html(formattednum(d))
	          .style("left", (d3.event.pageX + 10) + "px")
	          .style("top", (d3.event.pageY - 28) + "px");
	      })
	      .on("mouseout", function(d) {
	        d3.select(this)
	          .attr("stroke-width", 0);
	        toolTipCircle
	          .transition()
	          .duration(100)
	          .style("opacity", 0);
	      });

	    // Code for alternative circles //
	    var other_circles = svg.selectAll("other_circle")
	      .data(moviedata)
	      .enter()
	      .append("circle")
	      .attr("cx", function(d, i) {
	        return 124 + 40 + (imageWidth / 2) + (0.95 * i * (chartWidth / 10)); //98 padding is 6 between each bar
	      })
	      .attr("cy", function(d) {
	        return (yScaleRevenue(d["alt_revenue"])) + 285;
	      })
	      .attr("r", 7)
	      .attr("fill", "#366C81")
	      .attr("stroke", "#366C81")
	      .attr("opacity", 0.6);
	      // .on("mouseover", function(d) {
	      //   d3.select(this)
	      //     .attr("stroke-width", 4);
	      //   toolTipCircle
	      //     .transition()
	      //     .duration(100)
	      //     .style("opacity", 1.0);
	      //   let formattednum2 = function(d) {
	      //     return d["alt_title"] + "<br>" + "$" + d3.format(",.2f")(d["revenue"]);
	      //   }
	      //   toolTipCircle
	      //     .html(formattednum2(d))
	      //     .style("left", (d3.event.pageX + 10) + "px")
	      //     .style("top", (d3.event.pageY - 28) + "px");
	      // })
	      // .on("mouseout", function(d) {
	      //   d3.select(this)
	      //     .attr("stroke-width", 0);
	      //   toolTipCircle
	      //     .transition()
	      //     .duration(100)
	      //     .style("opacity", 0);
	      // });

	});

	

}

buildTopRanked();

