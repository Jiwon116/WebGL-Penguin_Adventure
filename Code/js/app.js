import { OBJLoader } from "../../node_modules/three/examples/jsm/loaders/OBJLoader.js";
var de2ra = function (degree) {
  return degree * (Math.PI / 180);
};

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.set(0, 100, -300);
camera.lookAt(new THREE.Vector3(0, 0, 0));
// camera.position.y = 300
// camera.position.x = 100
// camera.position.z = -180

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 50, window.innerHeight - 50);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

//  좌표계 추가, X: 빨간색, Y: 녹색, Z: 파란색
const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

//  add plane
const geometry = new THREE.PlaneGeometry(1000, 1000);
var material = new THREE.MeshBasicMaterial({
  color: 0xffff30,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material);
// plane.rotation.z = de2ra(90)
// plane.rotation.y = de2ra(45)
plane.rotation.x = de2ra(90);
plane.position.y = -100;
scene.add(plane);

//  Load 3d obj
let loader = new OBJLoader();
material = new THREE.MeshStandardMaterial();
const texture = new THREE.TextureLoader().load(
  "../../Resources/obj/penguin/Tex_Penguin.png"
);

material.map = texture;
var penguin;

//  obj 파일 호출
loader.load("../../Resources/obj/penguin/Mesh_Penguin.obj", function (object) {
  object.traverse(function (body) {
    body.material = material;
    penguin = body;
    scene.add(penguin);
    console.log(penguin.geometry);
    console.log(penguin.material);
  });
});

// var controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.rotateSpeed = 1.0; // 마우스로 카메라를 회전시킬 속도입니다. 기본값(Float)은 1입니다.
// controls.zoomSpeed = 1.2; // 마우스 휠로 카메라를 줌 시키는 속도 입니다. 기본값(Float)은 1입니다.
// controls.panSpeed = 0.8; // 패닝 속도 입니다. 기본값(Float)은 1입니다.
// controls.minDistance = 5; // 마우스 휠로 카메라 거리 조작시 최소 값. 기본값(Float)은 0 입니다.
// controls.maxDistance = 1000; // 마우스 휠로 카메라 거리 조작시 최대 값. 기본값(Float)은 무제한 입니다.

function animate() {
  requestAnimationFrame(animate);
  // controls.update()
  renderer.render(scene, camera);
}
animate();
setupKeyControls();
function setupKeyControls() {
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37: //좌
        penguin.position.x += 10.0;
        break;
      case 38: //상
        penguin.position.z += 10.0;
        break;
      case 39: //우
        penguin.position.x -= 10.0;
        break;
      case 40: //하
        penguin.position.z -= 10.0;
        break;
    }
  };
}
