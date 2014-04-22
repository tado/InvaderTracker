/*
  Sensors.js
  2014.4.20 Author : Koichiro Mori http://moxus.org
*/

var Sensors = Backbone.Collection.extend({
  acquisitionTime: moment().format('X'),
  subtractHour:     280,
  model:            Sensor,
  url:              'http://api.artsat.jp/invader/sensor_data_range.js',
  comparator:       'time',
  begin: function() {
    var begin = moment().subtract(this.subtractHour, "hours").format('X');
    return begin;
  },
  end: function() {
    var end = this.acquisitionTime;
    return end;
  },
  initialize: function() {
    this.url += ("?begin=" + this.begin() + "&end=" + this.end());
  },
  parse: function(resp) {
    if (resp.error) {
        console.log (resp.error.message);
    };
    return resp.results;
  }
});
