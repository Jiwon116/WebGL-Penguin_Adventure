var scene, camera, renderer, mesh;
var crate, crateTexture, crateNormalMap, crateBumpMap;
var keyboard = {};
var player = {height : 1.0, speed:0.2, turnSpeed:Math.PI * 0.02}; // 물체 높이. 숫자가 낮을수록 높다.
var meshFloor;
var USE_WIREFRAME = false;

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90,1200/720,0.1,1000);

  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),  // cube만들기(가로,세로,높이)
    new THREE.MeshPhongMaterial({color:0xff0099, wireframe:USE_WIREFRAME}) // Mesh meterial
    //false로 설정하면 선이 사라지고 면이 칠해진다.
    );
  mesh.position.y += 1; // 물체를 위로 옮김
  //shadow설정
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);

  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(10,10,10,10),  // 평평한 바닥(n,m)이 기본.
    //거기에 숫자를 더 추가하면(n,m,10,10)처럼 몇개의 segments를 geometry가 가지는지 지정할 수 있다.
    //이렇게 하면 처음 그 사각형이 10*10개로 나누어져서 바닥을 이룬다.
    new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME}) // 색 지정, 선을 보이게 할 것인가.
    //false(선이 안보임)하고, ratation을 -=로 주면 바닥이 하얀색판으로 나옴.
    );
  meshFloor.rotation.x -= Math.PI / 2;  // 바닥으로 만들기(판을 눕히는 작업)
  //+=와 -=로 하면 대각선 방향이 바뀜
  //shadow설정
  meshFloor.receiveShadow = true;
  scene.add(meshFloor); // scene에 추가

  // 빛 설정(되게 어두워짐..default가 1인거 같다. 그보다 낮아질수록 어두워짐.)
  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  //point light
  light = new THREE.PointLight(0xffffff, 0.8, 18); // 빛의 색, 밝기, 18은 뭘까...
  light.position.set(-3,6,-3); //위치
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  scene.add(light);

  var textureLoader = new THREE.TextureLoader();
  crateTexture = textureLoader.load("crate0/crate0_diffuse.png");
  crateBumpMap = textureLoader.load("crate0/crate0_bump.png");
  crateNormalMap = textureLoader.load("crate0/crate0_normal.png");

  crate = new THREE.Mesh(
      new THREE.BoxGeometry(3,3,3),
      new THREE.MeshPhongMaterial({
        color:0xffffff,
        map:crateTexture,
        bumpMap:crateBumpMap,
        normalMap:crateNormalMap
      })
  );
  scene.add(crate);
  crate.position.set(2.5, 3/2, 2.5);
  crate.receiveShadow = true;
  crate.castShadow = true;

  camera.position.set(0,player.height,-5);
  camera.lookAt(new THREE.Vector3(0,player.height,0));

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(1200,720);

  // 그림자 생성
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  document.body.appendChild(renderer.domElement);

  animate();
}
function animate(){
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  crate.rotation.y += 0.01; // 나무 상자 돌리기

  //WSAD는 camera의 이동
  if(keyboard[87]){ // W key
     camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
     camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if(keyboard[83]){ // S key
     camera.position.x += Math.sin(camera.rotation.y) * player.speed;
     camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if(keyboard[65]){ // A key
     camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
     camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
  }
  if(keyboard[68]){ // D key
     camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
     camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
  }

  //좌우 방향키는 카메라의 rotation
  if(keyboard[37]){ // left arrow key
     camera.rotation.y -= player.turnSpeed;
  }
  if(keyboard[39]){ // left arrow key
     camera.rotation.y += player.turnSpeed;
  }

  renderer.render(scene, camera);
}
function keyDown(event){
  keyboard[event.keyCode] = true;
}
function keyUp(event){
  keyboard[event.keyCode] = false;
}
window.addEventListener('keydown',keyDown);
window.addEventListener('keyup',keyUp);

window.onload = init;
