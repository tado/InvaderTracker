/*
  GraphView.js
  2014.4.17 Author : Koichiro Mori http://moxus.org
*/

var GraphView = Backbone.View.extend({
  defaults:{
    graphSvg: undefined,
    tagName: 'svg',
  },
  width:  900,
  height: 250,
  graphPath: undefined,
  line: undefined,
  initialize: function() {
    this.graphSvg = d3.select("#graphView").append("svg:svg").attr("width", '1000px').attr("height", '980px');
  },
  scaleY: function(arr) {
    var scale = d3.scale.linear()
        .domain([d3.min(arr), d3.max(arr)])
        .range([0, this.height - 5]);
    return scale;
  },
  scaleX: function(arr) {
    var scale = d3.scale.linear()
        .domain([0, arr.length])
        .range([0, this.width]);
    return scale;
  },
  render: function() {
    var self = this;
    if (0 < this.collection.length && this.collection != null) {
      var dataArray = self.collection.pluck('alt');

      var scaleX = self.scaleX(dataArray);
      var scaleY = self.scaleY(dataArray);

      self.line = d3.svg.line()
        .x(function(d,i) { return scaleX(i) })
        .y(function(d,i) { return self.height - scaleY(d);})
        .interpolate("monotone")//点の繋ぎ方の指定

      self.graphPath = self.graphSvg.append("path")
        .attr("d", self.line(dataArray))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("fill", "none");
    }

    $("#graphView").on("click", function() {
      var data = ["bv","bv","gx","gy","gz","mx","my","mz","scpx","scpy","scpz"];
      var index = Math.floor((Math.random()*10));
      console.log("clicked",index);
      self.transformDataTo(data[index]);
    });
  },
  transformDataTo: function(type) {
    var self = this;
    
    var dataArray = self.collection.pluck(type);

    var scaleX = self.scaleX(dataArray);
    var scaleY = self.scaleY(dataArray);

    var newline = d3.svg.line()
        .x(function(d,i) { return scaleX(i) })
        .y(function(d,i) { return self.height - scaleY(d);})
        .interpolate("monotone")//点の繋ぎ方の指定

    self.graphPath
      .transition()
      .duration(300)
      .attr("d", newline(dataArray))
  },
  isNumber: function(x) { 
    if (typeof(x) != 'number' && typeof(x) != 'string') {
        return false;
    } else {
        return (x == parseFloat(x) && isFinite(x));
    }
  }
})