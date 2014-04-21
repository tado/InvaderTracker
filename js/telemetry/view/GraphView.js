/*
  GraphView.js
  2014.4.17 Author : Koichiro Mori http://moxus.org
*/

var GraphView = Backbone.View.extend({
  defaults:{
    graphSvg: undefined,
    tagName: 'svg',
  },
  width:  800,
  height: 250,
  initialize: function() {
    this.graphSvg = d3.select("#graphView").append("svg:svg").attr("width", '1000px').attr("height", '980px');
  },
  render: function() {
    var self = this;
    if (0 < this.collection.length && this.collection != null) {

      var dataArray = self.collection.pluck('alt');

      var ymin = d3.min(dataArray);
      var ymax = d3.max(dataArray);
      
      var scaleX = d3.scale.linear()
        .domain([0, dataArray.length])
        .range([0, self.width]);
      var scaleY = d3.scale.linear()
        .domain([ymin, ymax])
        .range([0, self.height]);

      var line = d3.svg.line()
        .x(function(d,i) { return scaleX(i) })
        .y(function(d,i) { return scaleY(d);})
        .interpolate("linear");//点の繋ぎ方の指定
      self.graphSvg.append("path")
        .attr("d", line(dataArray))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    }
  }
})