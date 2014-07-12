/*
  OverlayView.js
*/
function OverlayView(_w, _h) {
  this.canvas;
  this.scene;
  this.camera;
  this.renderer;
  this.WIDTH = _w;
  this.HEIGHT = _h;
  this.init();
  this.billBoard;
  this.overlay;
};

OverlayView.prototype.init = function() {
  var self = this;
  $('document').ready(function() {
    var continerDOM = $("#container");
    self.camera = new THREE.OrthographicCamera(-self.WIDTH / 2, self.WIDTH / 2, -self.HEIGHT / 2, self.HEIGHT / 2, 0.001, 8000);
    self.renderer = new THREE.CSS2DRenderer();
    self.renderer.setSize(self.WIDTH, self.HEIGHT);
    self.renderer.domElement.style.position = 'absolute';
    self.scene = new THREE.Scene();
    self.overlay = document.getElementById('overlay')
    self.overlay.appendChild(self.renderer.domElement);
    self.billBoard = new THREE.CSS2DObject($("#info")[0]);
    $("#info")[0].style.position = 'absolute';

    self.scene.add(self.billBoard);
  });
};

OverlayView.prototype.setBillboardPosition = function (vec) {
  this.billBoard.position.x = vec.x;
  this.billBoard.position.y = vec.y;
};

OverlayView.prototype.update = function () {
  var self = this;
  self.renderer.render(self.scene, self.camera);
};

OverlayView.prototype.setSize = function (_w, _h) {
    this.WIDTH = _w;
    this.HEIGHT = _h;
    this.camera.left = -_w / 2;
    this.camera.right = _w / 2;
    this.camera.top = -_h / 2;
    this.camera.bottom = _h / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( _w, _h );
};
