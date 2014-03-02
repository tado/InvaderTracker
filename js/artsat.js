var tle = {
  "first_line":  "1 39577U 14009F   14060.23023881  .00121747  00000-0  14523-2 0   139",
  "second_line": "2 39577  65.0140  54.8801 0006543 321.2940  38.7744 15.60417039   227"
}
 
// jsのDateからOrb.jsのTimeオブジェクトを作って
var date = new Date();
var time = new Orb.Time(date);
 
var satellite = new Orb.Satellite(tle);
var geo = satellite.position.geographic(time);
var rect = satellite.position.rectangular(time);

alert(
	"tle = " + tle.first_line + "\n"
	+ tle.first_line + "\n"
	+ "longitude = " + geo.longitude + "\n"
	+ "latitude = " + geo.latitude + "\n"
	+ "altitude = " + geo.altitude + "\n"
	+ "x = " + rect.x + "\n"
	+ "y = " + rect.y + "\n"
	+ "z = " + rect.z + "\n"
	);
