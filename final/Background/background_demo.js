var scene, camera, renderer, mesh, clock;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height:2, speed:0.4, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;

// An object to hold all the things needed for our loading screen
var loadingScreen = {
   scene: new THREE.Scene(),
   camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
   box: new THREE.Mesh(
      new THREE.BoxGeometry(0.5,0.5,0.5),
      new THREE.MeshBasicMaterial({ color:0x4444ff })
   )
};
var loadingManager = null;
var RESOURCES_LOADED = true;


// Models index
var models = {
  carrot: {
    obj:"OBJformat/grass.obj",
    mtl:"OBJformat/grass.mtl",
    mesh: null
  },
  gate: {
    obj:"OBJformat/flower_redA.obj",
    mtl:"OBJformat/flower_redA.mtl",

    mesh: null
  },
  stone: {
    obj:"OBJformat/flower_purpleB.obj",
    mtl:"OBJformat/flower_purpleB.mtl",
    mesh: null
  },
  flower: {
    obj:"OBJformat/flower_yellowB.obj",
    mtl:"OBJformat/flower_yellowB.mtl",
    mesh: null
  },
  uzi: {
    obj:"OBJformat/PenguinBaseMesh.obj",
      mtl:"OBJformat/PenguinBaseMesh.mtl",
      mesh: null,
      castShadow:false
  },
  background: {
      obj:"OBJformat/lowpolymountains.obj",
      mtl:"OBJformat/lowpolymountains.mtl",
      mesh: null,
      castShadow:false
  }


};


// Meshes index
var meshes = {};


function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90,1200/720,0.1,1000);
  clock = new THREE.Clock();

  // Set up the loading screen's scene.
   // It can be treated just like our main scene.
   loadingScreen.box.position.set(0,0,5);
   loadingScreen.camera.lookAt(loadingScreen.box.position);
   loadingScreen.scene.add(loadingScreen.box);

   // Create a loading manager to set RESOURCES_LOADED when appropriate.
   // Pass loadingManager to all resource loaders.
   loadingManager = new THREE.LoadingManager();

   loadingManager.onProgress = function(item, loaded, total){
      console.log(item, loaded, total);
   };

   loadingManager.onLoad = function(){
      console.log("loaded all resources");
      RESOURCES_LOADED = true;
    onResourcesLoaded();
   };

  //-----------------------------------------------------------
  //------------------------------Cube------------------------
  //-----------------------------------------------------------

  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),  // cube만들기(가로,세로,높이)
    new THREE.MeshPhongMaterial({color:0xff0099, wireframe:USE_WIREFRAME}) // Mesh meterial
    //false로 설정하면 선이 사라지고 면이 칠해진다.
    );
  mesh.position.y += 1; // 물체를 위로 옮김
  //shadow설정
  mesh.position.set(-5,-3,0);
  //   mesh.rotation.set(0,5,0);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  //scene.add(mesh);

  //-----------------------------------------------------------
  //------------------------------Floor------------------------
  //-----------------------------------------------------------

  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(200,100,0,0),  // 평평한 바닥(n,m)이 기본.
    //거기에 숫자를 더 추가하면(n,m,10,10)처럼 몇개의 segments를 geometry가 가지는지 지정할 수 있다.
    //이렇게 하면 처음 그 사각형이 10*10개로 나누어져서 바닥을 이룬다.
    new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME}) // 색 지정, 선을 보이게 할 것인가.
    //false(선이 안보임)하고, ratation을 -=로 주면 바닥이 하얀색판으로 나옴.
    );
  meshFloor.rotation.x -= Math.PI / 2;  // 바닥으로 만들기(판을 눕히는 작업)
  //+=와 -=로 하면 대각선 방향이 바뀜
  //shadow설정
  meshFloor.receiveShadow = true;
  //meshFloor.position.set(0,0,0);
  scene.add(meshFloor); // scene에 추가

  //-----------------------------------------------------------
  //------------------------------Light------------------------
  //-----------------------------------------------------------

  // 빛 설정(되게 어두워짐..default가 1인거 같다. 그보다 낮아질수록 어두워짐.)
  ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  //point light
  light = new THREE.PointLight(0xffd400, 8, 25); // 빛의 색, 밝기, 18은 뭘까...
  light.position.set(-5,-2,0); //위치
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  light.rotation.set(-5,-5,0);
  scene.add(light);

  //-----------------------------------------------------------
  //------------------------------Object------------------------
  //-----------------------------------------------------------

   // Load models
   // REMEMBER: Loading in Javascript is asynchronous, so you need
   // to wrap the code in a function and pass it the index. If you
   // don't, then the index '_key' can change while the model is being
   // downloaded, and so the wrong model will be matched with the wrong
   // index key.
   for( var _key in models ){
      (function(key){

         var mtlLoader = new THREE.MTLLoader(loadingManager);
         mtlLoader.load(models[key].mtl, function(materials){
            materials.preload();

            var objLoader = new THREE.OBJLoader(loadingManager);

            objLoader.setMaterials(materials);
            objLoader.load(models[key].obj, function(mesh){

               mesh.traverse(function(node){
                  if( node instanceof THREE.Mesh ){
                     if('castShadow' in models[key])
                        node.castShadow = models[key].castShadow;
                     else
                        node.castShadow = true;

                     if('receiveShadow' in models[key])
                        node.receiveShadow = models[key].receiveShadow;
                     else
                        node.receiveShadow = true;
                  }
               });
               models[key].mesh = mesh;

            });
         });

      })(_key);
   }

  //-----------------------------------------------------------
  //------------------------------Camera------------------------
  //-----------------------------------------------------------

  camera.position.set(0,player.height,-5);
  camera.lookAt(new THREE.Vector3(0,player.height,0));

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(1280,720);
  renderer.setClearColor(0xffffff, 1);

  camera.position.set(0,player.height,0);
  //camera.rotation.set(-3.1,0,-3.1);
  camera.rotation.y += 0.005;
  camera.rotation.x += 0.001;

  //-----------------------------------------------------------
  //---------------------------Shadow------------------------
  //-----------------------------------------------------------

  // 그림자 생성
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  document.body.appendChild(renderer.domElement);

  animate();
}

//-----------------------------------------------------------
//---------------------- Resource Load ----------------------
//-----------------------------------------------------------

// Runs when all resources are loaded
function onResourcesLoaded(){

   // Clone models into meshes.
   meshes["carrot1"] = models.carrot.mesh.clone();
   meshes["carrot2"] = models.carrot.mesh.clone();
   meshes["carrot3"] = models.carrot.mesh.clone();
   meshes["carrot4"] = models.carrot.mesh.clone();
   meshes["carrot5"] = models.carrot.mesh.clone();
   meshes["carrot6"] = models.carrot.mesh.clone();

   meshes["gate1"] = models.gate.mesh.clone();
   meshes["gate2"] = models.gate.mesh.clone();
   meshes["gate3"] = models.gate.mesh.clone();
   meshes["gate4"] = models.gate.mesh.clone();


   meshes["stone1"] = models.stone.mesh.clone();
   meshes["stone2"] = models.stone.mesh.clone();
   meshes["stone3"] = models.stone.mesh.clone();
   meshes["stone4"] = models.stone.mesh.clone();

   meshes["flower1"] = models.flower.mesh.clone();
   meshes["flower2"] = models.flower.mesh.clone();
   meshes["flower3"] = models.flower.mesh.clone();
   meshes["flower4"] = models.flower.mesh.clone();


   meshes["background"] = models.background.mesh.clone();
   meshes["background2"] = models.background.mesh.clone();


   (Math.random() * 10).toFixed(0)
   // Reposition individual meshes, then add meshes to scene
   meshes["carrot1"].position.set((Math.random() * 100).toFixed(0)%15, 0, (Math.random() * 100).toFixed(0)%6+5);
   scene.add(meshes["carrot1"]);
   meshes["carrot2"].position.set(-(Math.random() * 100).toFixed(0)%15, 0, (Math.random() * 100).toFixed(0)%6+5);
   scene.add(meshes["carrot2"]);
   meshes["carrot3"].position.set(-(Math.random() * 100).toFixed(0)%15, 0,(Math.random() * 100).toFixed(0)%6+5);
   scene.add(meshes["carrot3"]);
   meshes["carrot4"].position.set((Math.random() * 100).toFixed(0)%15,0, (Math.random() * 100).toFixed(0)%6+5);
   scene.add(meshes["carrot4"]);
   meshes["carrot5"].position.set((Math.random() * 100).toFixed(0)%15,0, (Math.random() * 100).toFixed(0)%6+5);
   scene.add(meshes["carrot5"]);
   meshes["carrot6"].position.set((Math.random() * 100).toFixed(0)%15,0, (Math.random() * 100).toFixed(0)%6+5);
   scene.add(meshes["carrot6"]);

   meshes["gate1"].position.set((Math.random() * 100).toFixed(0)%15, 0, (Math.random() * 100).toFixed(0)%6+5);
   meshes["gate1"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["gate1"]);
   meshes["gate2"].position.set(-(Math.random() * 100).toFixed(0)%15, 0, (Math.random() * 100).toFixed(0)%6+5);
  meshes["gate2"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["gate2"]);
   meshes["gate3"].position.set(-(Math.random() * 100).toFixed(0)%15, 0,(Math.random() * 100).toFixed(0)%6+5);
  meshes["gate3"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["gate3"]);
   meshes["gate4"].position.set((Math.random() * 100).toFixed(0)%15,0, (Math.random() * 100).toFixed(0)%6+5);
  meshes["gate4"].scale.set(1.5,1.5,1.5);
   scene.add(meshes["gate4"]);

  meshes["stone1"].position.set((Math.random() * 100).toFixed(0)%15, 0, (Math.random() * 100).toFixed(0)%6+5);
  meshes["stone1"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["stone1"]);
   meshes["stone2"].position.set(-(Math.random() * 100).toFixed(0)%15, 0, (Math.random() * 100).toFixed(0)%6+5);
  meshes["stone2"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["stone2"]);
   meshes["stone3"].position.set(-(Math.random() * 100).toFixed(0)%15, 0,(Math.random() * 100).toFixed(0)%6+5);
    meshes["stone3"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["stone3"]);
   meshes["stone4"].position.set((Math.random() * 100).toFixed(0)%15,0, (Math.random() * 100).toFixed(0)%6+5);
  meshes["stone4"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["stone4"]);

  meshes["flower1"].position.set((Math.random() * 100).toFixed(0)%15, 0, (Math.random() * 100).toFixed(0)%6+5);
    meshes["flower1"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["flower1"]);
   meshes["flower2"].position.set(-(Math.random() * 100).toFixed(0)%15, 0, (Math.random() * 100).toFixed(0)%6+5);
    meshes["flower2"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["flower2"]);
   meshes["flower3"].position.set(-(Math.random() * 100).toFixed(0)%15, 0,(Math.random() * 100).toFixed(0)%6+5);
     meshes["flower3"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["flower3"]);
   meshes["flower4"].position.set((Math.random() * 100).toFixed(0)%15,0, (Math.random() * 100).toFixed(0)%6+5);
     meshes["flower4"].scale.set(1.5,1.5,1.5);
  scene.add(meshes["flower4"]);

   meshes["background"].position.set(15,-2,10);
   meshes["background"].scale.set(2,2,2);
   meshes["background"].rotation.set(0,5,0);
   scene.add(meshes["background"]);

   meshes["background2"].position.set(-15,-2,10);
   meshes["background2"].scale.set(2,2,2);
   meshes["background2"].rotation.set(0,-5.1,0);

   scene.add(meshes["background2"]);

  // penguin
   meshes["penguin"] = models.uzi.mesh.clone();
   meshes["penguin"].position.set(0,2,0);
   meshes["penguin"].scale.set(9,9,9);
   //scene.add(meshes["penguin"]);




}

//-----------------------------------------------------------
//---------------------------Animation-----------------------
//-----------------------------------------------------------

function animate(){

  // This block runs while resources are loading.
   if( RESOURCES_LOADED == false ){
      requestAnimationFrame(animate);

      loadingScreen.box.position.x -= 0.05;
      if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
      loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

      renderer.render(loadingScreen.scene, loadingScreen.camera);
      return; // Stop the function here.
   }

  requestAnimationFrame(animate);

  var time = Date.now() * 0.0005;
   var delta = clock.getDelta();

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
//  crate.rotation.y += 0.01; // 나무 상자 돌리기

  //-----------------------------------------------------------
  //----------------------Keyboard setting---------------------
  //-----------------------------------------------------------

  //WSAD는 camera의 이동
/*   if(keyboard[87]){ // W key
     camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
     camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if(keyboard[83]){ // S key
     camera.position.x += Math.sin(camera.rotation.y) * player.speed;
     camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  } */
  if(keyboard[65]){ // A keyd
   if(camera.position.x < 13 ) {
      camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
      camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
   }

  }
  if(keyboard[68]){ // D key
    if(camera.position.x > -14){
      camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
      camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }

  }

  //좌우 방향키는 카메라의 rotation
  if(keyboard[37]){ // left arrow key
     camera.rotation.y -= player.turnSpeed;
  }
  if(keyboard[39]){ // left arrow key
     camera.rotation.y += player.turnSpeed;
  }
  if(keyboard[38]){ // left arrow key
     camera.rotation.x -= player.turnSpeed;
  }
  if(keyboard[40]){ // left arrow key
     camera.rotation.x += player.turnSpeed;
  }


  // position the penguin in front of the camera
   meshes["penguin"].position.set(
      camera.position.x + 0.75 - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
      camera.position.y - 12 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
      camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
   );
   meshes["penguin"].rotation.set(
      camera.rotation.x,
      camera.rotation.y - Math.PI,
      camera.rotation.z
   );

 light.position.x -= Math.sin(light.rotation.y + Math.PI/2) * 0.05;
 light.position.y -= Math.cos(light.rotation.y + Math.PI/2) * 0.05;

 light.rotation.y += 0.005;
 light.rotation.x += 0.005;


  //-----------------------------------------------------------
  //-------------------Check camera position/rotation----------------
  //-----------------------------------------------------------

  renderer.render(scene, camera);
  document.getElementById('monitor').innerText =	"Camera position : "
  + camera.position.x.toFixed(1)
  + ", " + camera.position.y.toFixed(1)
  + ", " + camera.position.z.toFixed(1);
  document.getElementById('rotation').innerText =	"Camera rotation : "
  + camera.rotation.x.toFixed(1)
  + ", " + camera.rotation.y.toFixed(1)
  + ", " + camera.rotation.z.toFixed(1);
}

//-----------------------------------------------------------
//-------------------Keyboard up/down setting----------------
//-----------------------------------------------------------

function keyDown(event){
  keyboard[event.keyCode] = true;
}
function keyUp(event){
  keyboard[event.keyCode] = false;
}
window.addEventListener('keydown',keyDown);
window.addEventListener('keyup',keyUp);

window.onload = init;
