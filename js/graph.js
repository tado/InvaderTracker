/* Draw Telemetry Graph using D3.js */

var margin = {top:170, right: 20, bottom: 60, left: 150};
var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var color = d3.scale.category10();
var timeFormat = d3.time.format("%x");
var xAxis = d3.svg.axis().scale(x).tickFormat(timeFormat).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var data;
var sensorGroup = [
  ["alt"], //0
  ["bv"], //1
  ["bt"], //2
  ["sca","scpx","scmx","scpy","scmy","scpz","scmz"], //3
  ["stpx","stmx","stpy","stmy","stpz","stmz"], //4
  ["gx","gy","gz"], //5
  ["mx","my","mz"] //6
];

var begin = moment().subtract("days",360).format('X');
var end = moment().format('X');
var url = "http://api.artsat.jp/invader/sensor_data_range.js";
url += ("?begin=" + begin + "&end=" + end);

d3.jsonp(url, function(cb){
});

function artsat_invader_sensor_data_cb(callback_data){
  data = callback_data;
}

function selectGraph(num){
  d3.select("svg").remove();
  var svg = d3.select("#graph").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data.results, function(d) { return d.time * 1000;}));
  y.domain(d3.extent(data.results, function(d) { return eval("d.sensors." + sensorGroup[num][0])}));

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", 40)
  .style("text-anchor", "end")
  .text("Time");

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("class", "label")
  .attr("y", -20)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Value");

  for(var i = 0; i < sensorGroup[num].length; i++){
    svg.selectAll(".dot")
    .data(data.results)
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d) { return x(d.time * 1000); })
    .attr("cy", function(d) { return y(eval("d.sensors." + sensorGroup[num][i])); })
    .style("fill", function(d) { return color(i); });
  }
}

function removeGraph(){
  d3.select("svg").remove();
}
