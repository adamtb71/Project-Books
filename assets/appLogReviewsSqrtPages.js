// log reviews and sqrt_pages
var svgWidth = 1000;
var svgHeight = 800;
var margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 200
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// create the area for the graph

//add zoom function
// var zoom = d3.zoom()
// .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
// .extent([[0, 0], [width, height]])
// .on("zoom", updateChart);

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    // .call(zoom);//add zom

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("https://raw.githubusercontent.com/ablinn91/Project-Books/master/books%20for%20page%20count.csv").then(function (BookData) {
    console.log(BookData)
    //cast the data this is from homework 3.9
    //parses out the data
    BookData.forEach(function (data) {
        data.sqrt_pages = +data.sqrt_pages;
        data.average_rating = +data.average_rating;
        data.log_ratings = +data.log_ratings;
        data.text_reviews_count = +data.text_reviews_count;

    });
    console.log(BookData);

    var xLinearScale = d3.scaleLinear()
        .domain([(d3.min(BookData, d => d.average_rating)), d3.max(BookData, d => d.average_rating)])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([(d3.min(BookData, d => d.sqrt_pages)), d3.max(BookData, d => d.sqrt_pages)])
        .range([height, 0]);

    //create axis function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axis to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //putting an html tag for a group
    chartGroup.append("g")
        .call(leftAxis);

    //create circles
    var circleGroup = chartGroup.selectAll("circle")
        .data(BookData)
        .enter()//this tels d3 to put new elements inside the page
        .append("circle")
        .attr("cx", d => xLinearScale(d.average_rating))
        .attr("cy", d => yLinearScale(d.sqrt_pages))
        .attr("r", "4")
        .style("fill", "blue")
        .style("opacity", 0.4)
        .attr("class", d => "stateCircle " + d.abbr);

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 100)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Number of Pages");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("y", 0 - margin.bottom + 20)
        .attr("x", 0 - margin.bottom)
        .attr("dx", "1em")
        .attr("class", "axisText")
        .text("Average Rating");

    // Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.title}<br>Number of Pages: ${dsqrt_pages}<br>Average Rating: ${d.average_rating}`);
        });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circleGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

        

}).catch(function (error) {
    console.log(error);
}).then(d => {
    console.log("done");
    $("#scatter").fadeIn(3000);
})





