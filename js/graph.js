var begin = moment().subtract("days",90).format('X');
var end = moment().format('X');
var url = "http://api.artsat.jp/invader/sensor_data_range.js";
url += ("?begin=" + begin + "&end=" + end);

d3.jsonp(url, function(cb) {

});

function artsat_invader_sensor_data_cb(data){
    for(var i = 0; i <data.results.length; i++){
        console.log(data.results[i].sensors);
    }
}