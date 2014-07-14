

var margin = {top:250, right: 20, bottom: 40, left: 40},
width = window.innerWidth - margin.left - margin.right,
height = window.innerHeight - margin.top - margin.bottom;

var timeFormat = d3.time.format("%x");

var x = d3.time.scale()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
.scale(x)
.tickFormat(timeFormat)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var svg = d3.select("#graph").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var begin = moment().subtract("days",360).format('X');
var end = moment().format('X');
var url = "http://api.artsat.jp/invader/sensor_data_range.js";
url += ("?begin=" + begin + "&end=" + end);
d3.jsonp(url, function(cb){});

function artsat_invader_sensor_data_cb(data){
    x.domain(d3.extent(data.results, function(d) { return d.time * 1000;})).nice();
    y.domain(d3.extent(data.results, function(d) { return d.sensors.sca;})).nice();

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", 20)
    .style("text-anchor", "end")
    .text("Time");

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    //.attr("transform", "rotate(-90)")
    .attr("y", -20)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Value")

    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.sca); })
    .style("fill", function(d, i) { return color(0); })
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.scmx); })
    .style("fill", function(d, i) { return color(1); })
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.scpx); })
    .style("fill", function(d, i) { return color(2); })
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.scmy); })
    .style("fill", function(d, i) { return color(3); })
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.scpy); })
    .style("fill", function(d, i) { return color(0); })
    .style("fill", function(d, i) { return color(4); })
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.scmz); })
    .style("fill", function(d, i) { return color(5); })
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.scpz); })
    .style("fill", function(d, i) { return color(6); })
    ;

    /*
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.stpx); })
    .style("fill", color(0))
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.stmx); })
    .style("fill", color(1))
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.stpy); })
    .style("fill", color(2))
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.stmy); })
    .style("fill", color(3))
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.stpz); })
    .style("fill", color(4))
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.stmz); })
    .style("fill", color(5))
    ;
    */
    /*
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.mx); })
    .style("fill", color(0))
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.my); })
    .style("fill", color(1))
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.mz); })
    .style("fill", color(2))
    ;
    */

    /*
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.gx); })
    .style("fill", color(0))
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.gy); })
    .style("fill", color(1))
    ;
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(d.sensors.gz); })
    .style("fill", color(2))
    ;
    */
}


