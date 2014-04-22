/*
  GraphView.js
  2014.4.17 Author : Koichiro Mori http://moxus.org
*/

var GraphView = Backbone.View.extend({
  defaults:{
    graphSvg: undefined,
    tagName: 'svg',
  },
  width:      960,
  height:     250,
  marginX:    45,
  marginY:    45,
  graphPath:  undefined,
  line:       undefined,
  initialize: function() {
    // append svg to DOM
    this.graphSvg = d3.select("#graphView") 
      .append("svg:svg")
      .attr("width", this.width+ this.marginX)
      .attr("height", this.height + this.marginY);
  },
  scaleY: function(arr) {
    var scale = d3.scale.linear()
        .domain([d3.min(arr), d3.max(arr)])
        .range([this.height - 5, 0]);
    return scale;
  },
  scaleX: function(arr) {
    var scale = d3.time.scale()
        .domain([new Date(d3.min(arr) * 1000.0), new Date(d3.max(arr) * 1000.0)]) // For UnixTime, multiply 1000
        .range([0, this.width - 5]);
    return scale;
  },
  render: function() {
    var self = this;
    if (0 < this.collection.length && this.collection != null) {
      // declaration of dataset
      var timeArray = self.collection.pluck('time');
      var dataArray = self.collection.pluck('scpx');
      
      // generate d3 scale object
      var scaleX = self.scaleX(timeArray);
      var scaleY = self.scaleY(dataArray);

      // declaration of d3 line object
      self.line = d3.svg.line()
        .x(function(d, i) {return scaleX(new Date(timeArray[i]*1000)) + self.marginX})
        .y(function(d, i) {return scaleY(d);})
        .interpolate("liner");//点の繋ぎ方の指定

      // generate path and append to svg
      self.graphPath = self.graphSvg.append("path")
        .attr("d", self.line(dataArray))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("fill", "none");
    
      // axis-scale X
      self.graphSvg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(" + self.marginX + "," + self.height+ ")")
        .attr("stroke", "white")
        .attr("fill", "none")
        .call(d3.svg.axis()
          .scale(self.scaleX(dataArray))
          .ticks(5)
          .tickFormat(d3.time.format("%M/%d %H:%m %p"))
          //.tickSubdivide(true)
          .orient("bottom")
        );

      // axis-scale Y
      self.graphSvg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + self.marginX + " ,5)")
        .attr("stroke", "white")
        .attr("fill", "none")
        .call(d3.svg.axis()
          .scale(self.scaleY(dataArray))
          .ticks(5)
          //.tickSubdivide(true)
          .orient("left")
        );
    };

    // on click function
    $("#graphView").on("click", function() {
      var data = ["bv","bv","gx","gy","gz","mx","my","mz","scpx","scpy","scpz"];
      var index = Math.floor((Math.random()*10));
      
      self.transformDataTo(data[index]);
    });
  },
  transformDataTo: function(type) { // rerender function
    var self = this;
    var timeArray = self.collection.pluck('time');
    var dataArray = self.collection.pluck(type);

    var scaleX = self.scaleX(timeArray);
    var scaleY = self.scaleY(dataArray);

    var newline = d3.svg.line()
        .x(function(d, i) {return scaleX(new Date(timeArray[i] * 1000.0)) + self.marginX})
        .y(function(d, i) {return scaleY(d);})
        .interpolate("liner");//点の繋ぎ方の指定

    var targetAxisY = self.graphPath
      .transition()
      .duration(500);
      
    targetAxisY
      .attr("d", newline(dataArray));

    // rerender axis-scale Y
    d3.select(".yAxis")
    .call(d3.svg.axis()
      .scale(self.scaleY(dataArray))
          .ticks(5)
          .tickSubdivide(true)
          .orient("left")
    );

  },
  isNumber: function(x) { 
    if (typeof(x) != 'number' && typeof(x) != 'string') {
        return false;
    } else {
        return (x == parseFloat(x) && isFinite(x));
    };
  }
});
