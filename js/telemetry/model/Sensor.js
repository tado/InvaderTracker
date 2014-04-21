/*
  Sensor.js
  2014.4.20 Author : Koichiro Mori http://moxus.org
*/

var Sensor = Backbone.Model.extend({
  defaults: {
    time:         "",
    alt:          "",
    bt:           "",
    bv:           "",
    gx:           "",
    gy:           "",
    gz:           "",
    lat:          "",
    lon:          "",
    mx:           "",
    my:           "",
    mz:           "",
    sca:          "",
    scmx:         "",
    scmy:         "",
    scmz:         "",
    scpx:         "",
    scpy:         "",
    scpz:         "",
    stmx:         "",
    stmy:         "",
    stmz:         "",
    stpx:         "",
    stpy:         "",
    stpz:         "",
    coordinates:  [0, 0]
  },
  parse: function(resp) {
    var r_resp = resp;
    if (resp.error) {
        console.log(resp.error.message);
    }
    resp = resp.sensors;
    resp.time = r_resp.time;
    resp.coordinates = [resp.lon, resp.lat];
    return resp;
  }
});
