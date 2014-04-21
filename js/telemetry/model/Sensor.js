/*
  Sensor.js
  2014.4.20 Author : Koichiro Mori http://moxus.org
*/

var Sensor = Backbone.Model.extend({
  defaults: {
    time:         "",
    alt:          0,
    bt:           0,
    bv:           0,
    gx:           0,
    gy:           0,
    gz:           0,
    lat:          0,
    lon:          0,
    mx:           0,
    my:           0,
    mz:           0,
    sca:          0,
    scmx:         0,
    scmy:         0,
    scmz:         0,
    scpx:         0,
    scpy:         0,
    scpz:         0,
    stmx:         0,
    stmy:         0,
    stmz:         0,
    stpx:         0,
    stpy:         0,
    stpz:         0,
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
