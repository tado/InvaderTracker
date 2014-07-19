/* Draw Telemetry Graph using D3.js */
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
  
  var sensorTitle = [
  "Altitude",
  "Battery Voltage",
  "Battery Temperature",
  "Solar Battery Current",
  "Solar Battery Temperature",
  "Gyrometer",
  "Magnetometer"
  ];

  var sensorSubTitle = [
  "衛星の高度",
  "内蔵電池容量",
  "内蔵電池の温度",
  "太陽電池の発電量 - 全体, x(表裏), y(表裏), z(表裏)",
  "太陽電池の温度 - x(表裏), y(表裏), z(表裏)",
  "回転速度- x軸, y軸, z軸",
  "地磁気 - x, y, z"
  ]


  var begin = moment().subtract("days",360).format('X');
  var end = moment().format('X');
  var url = "http://api.artsat.jp/invader/sensor_data_range.js";
  url += ("?begin=" + begin + "&end=" + end);

  /* Get telemetry data JSONP from Artsat API */
  d3.jsonp(url, function(cb){ });

  function artsat_invader_sensor_data_cb(callback_data){
    data = callback_data;
  }

  var margin = {top:220, right: 40, bottom: 150, left: 240};
  var width = window.innerWidth - margin.left - margin.right;
  var height = window.innerHeight - margin.top - margin.bottom;
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);
  var timeFormat = d3.time.format("%x");
  var xAxis = d3.svg.axis().scale(x).tickFormat(timeFormat).orient("bottom").ticks(5);
  var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

  var svg = d3.select("#graph").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function selectGraph(num){
    var color = d3.scale.category10();

    svg.selectAll("circle").remove();
    svg.selectAll("g").remove();

    x.domain(d3.extent(data.results, function(d) { return d.time * 1000;}));
    y.domain(d3.extent(data.results, function(d) { return eval("d.sensors." + sensorGroup[num][0])}));
    if(num == 6){
      y.domain(d3.extent(data.results, function(d) { return eval("d.sensors." + sensorGroup[num][sensorGroup[num].length-1])}));
    }

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", 30)
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
      .enter()
      .append("circle")
      .attr("r", 2)
      .attr("cx", function(d) { return x(d.time * 1000); })
      .attr("cy", function(d) { return y(eval("d.sensors." + sensorGroup[num][i])); })
      .style("fill", function(d) { return color(i); });
    }

    var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 15 + ")"; });

    legend.append("rect")
    .attr("x", width - 14)
    .attr("y", 0)
    .attr("width", 14)
    .attr("height", 14)
    .style("fill", color);

    legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .attr("fill", "rgba(255,255,255,0.75)")
    .style("text-anchor", "end")
    .text(function(d,i) { return sensorGroup[num][i]; });

    $("div#graphtitle").empty();
    $("div#graphtitle").append('<h1>' + sensorTitle[num] + '</h1>').hide().fadeIn();
    $("div#graphtitle").append('<p>' + sensorSubTitle[num] + '</p>').hide().fadeIn();
    $("div#graph").hide().fadeIn("fast");
  }
