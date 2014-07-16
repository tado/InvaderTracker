var container, stats;
var camera, scene, renderer, controls;
var group;
/* var mouseX = 0, mouseY = 0;*/

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var date;
var time;

var satellite;
var geo;
var rect;
var tle;
var satellite_geometry;
var satellite_material;
var satellite_mesh;
var radius = 6371;
var loadedTle = new Array(100);
var tmpTle;
var orbitLine;
var pointMesh = new Array(100);
var projector;
var overlayView;

loadData();

function loadData(){
  tle = {name:"", first_line:"", second_line:""};
  /* load TLE data from local textfile */
  jQuery.ajax({
    url : "data/cubesat.txt",
    /* url : "http://www.celestrak.com/NORAD/elements/cubesat.txt", */
    type : "get",
    success : function(data){
      loadedTle = data.split("\n");
      for(var i = 0; i < loadedTle.length; i++){
        var myRe = /^......./;
        tmpTle = myRe.exec(loadedTle[i]);

        if(tmpTle[0] === "INVADER"){
          tle.name = loadedTle[i];
          tle.first_line = loadedTle[i + 1];
          tle.second_line = loadedTle[i + 2];

          init();
          animate();
          break;
        }
      }
    }
  });
}

function drawOrbit(){
  var current = new Date();

  /* draw orbit line */
  var orbit = new THREE.Geometry();
  var step = 1;
  for (var i = 0; i < 60 * 6 / step; i++) {
    time = new Orb.Time(current);
    geo = satellite.position.geographic(time);
    var pos = {x:0, y:0, z:0};
    pos = addPoint(geo.latitude, geo.longitude, geo.altitude);
    orbit.vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z));
    current.setMinutes(current.getMinutes() + step);
  }

  orbitLine = new THREE.Line(orbit, new THREE.LineBasicMaterial({color: 0xcc0000}));
  group.add(orbitLine);
}

function init() {
  /* scene */
  container = document.getElementById( 'container' );
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 50000 );
  camera.position.z = -18000;
  scene = new THREE.Scene();
  group = new THREE.Object3D();
  projector = new THREE.Projector(window.innerWidth, window.innerHeight);
  overlayView = new OverlayView(window.innerWidth, window.innerHeight);
  scene.add( group );

  /* earth */
  var loader = new THREE.TextureLoader();
  loader.load( 'textures/real_earth.jpg', function ( texture ) {
    var geometry = new THREE.SphereGeometry(6371, 32, 32);
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );
    var mesh = new THREE.Mesh( geometry, material );
    group.add( mesh );

  } );

  /* renderer */
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor( 0x000000 );
  renderer.setSize( window.innerWidth, window.innerHeight);
  container.appendChild( renderer.domElement );

  /* controls - rotate object */
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  /* stats */
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.right = '0px';
  container.appendChild( stats.domElement );

  /* document.addEventListener( 'mousemove', onDocumentMouseMove, false ); */
  window.addEventListener( 'resize', onWindowResize, false );

  /* init satellite */
  date = new Date();
  time = new Orb.Time(date);

  satellite = new Orb.Satellite(tle);
  geo = satellite.position.geographic(time);

  rect = {x:0, y:0, z:0};
  rect = addPoint(geo.latitude, geo.longitude, geo.altitude);

  satellite_geometry = new THREE.SphereGeometry(120, 12, 12);
  satellite_material = new THREE.MeshBasicMaterial({color: 0xff0000, overdraw: true});
  satellite_mesh = new THREE.Mesh(satellite_geometry, satellite_material);
  satellite_mesh.position = {x:rect.x, y:rect.y, z:rect.z};
  group.add(satellite_mesh);

  /* draw orbit */
  drawOrbit();

  $("div#graph").hide();
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  overlayView.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  /* update time */
  var dd = new Date();
  time = new Orb.Time(dd);

  /* update satellite */
  geo = satellite.position.geographic(time);
  rect = addPoint(geo.latitude, geo.longitude, geo.altitude);
  satellite_mesh.position = {x:rect.x, y:rect.y, z:rect.z};

  /* draw orbit (every 10 sec) */
  if(dd.getSeconds() % 1 == 0){
    group.remove(orbitLine);
    drawOrbit();
  }

  /* show log */
  $("div#info").empty();
  $("div#info").append(
    "<p>"
    + tle.name + "<br/>"
    + dd
    + "<br/>latitude = " + geo.latitude.toFixed(8)
    + "<br/>longitude = " + geo.longitude.toFixed(8)
    + "<br/>altitude = " + geo.altitude.toFixed(8) + "</p>");
  
  /*
    $("div#tle").empty();
    $("div#tle").append("<p>"
    + tle.name + "<br/>"
    + tle.first_line + "<br/>"
    + tle.second_line
    + "</p>");
  */

  /* set projected position to CSS2DRenderer */
  var target = satellite_mesh;
  var projectedPosition = getProjection(target);
  overlayView.setBillboardPosition(projectedPosition);
  overlayView.update();

  /* animate */
  requestAnimationFrame(animate);
  render();
  stats.update();
  controls.update();
}

function render() {
  renderer.render( scene, camera );
}

/* Convert (lat, lon, alt) to (x, y, z) */
function addPoint(lat, lng, alt) {
  var phi = (90 - lat) * Math.PI / 180;
  var theta = (-lng) * Math.PI / 180;
  var pos = {x:0, y:0, z:0};
  pos.x = (radius + alt) * Math.sin(phi) * Math.cos(theta);
  pos.y = (radius + alt) * Math.cos(phi);
  pos.z = (radius + alt) * Math.sin(phi) * Math.sin(theta);

  return pos;
}

function getProjection(target) {
  var vector = projector.projectVector( new THREE.Vector3(target.position.x, target.position.y, target.position.z), camera );
  vector.x = vector.x * window.innerWidth * 0.5;
  vector.y = -( vector.y * window.innerHeight * 0.5 );
  return vector;
}

function showGraph(num){
  selectGraph(num);
  $("div#graph").show();
  $("div#overlay").fadeOut();
}

function hideGraph(){
  removeGraph();
  $("div#graph").hide();
  $("div#overlay").fadeIn();
}
