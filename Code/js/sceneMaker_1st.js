//------------------------------------------------------------------------
//------------------------------ Timer -----------------------------------
//------------------------------------------------------------------------
var display = document.getElementById('timer');
var display2 = document.getElementById('score');
var secs = 0;
var mins = 0;
var hrs  = 0;
var h = "";
var m = "";
var s = "";
var timer;

var score = 0;

function countTimer(){
    // count seconds and scores
    secs++;
    score++;

    // change seconds to minute and hour
	if(secs >= 60){
		secs = 0;
		mins++;
		if(mins >= 60){
			mins = 0;
			hrs++;
		}
	}

	h = hrs ? hrs > 9 ? hrs : "0" + hrs : "00";
	m = mins ? mins > 9 ? mins : "0" + mins : "00";
	s = secs > 9 ? secs : "0" + secs;

    // display time and score
    display.innerHTML = h+":"+m+":"+s+"s";
    display2.innerHTML = "Score : " + score;

	timerDuration();
}

function timerDuration(){
	if(hrs != 99){
		timer = setTimeout(countTimer, 100);
	}

}

function startTimer(btn){
    started = true; // Start the game when the button is pressed
    btn.setAttribute('disabled', 'disabled');
    timerDuration();
 }


Physijs.scripts.worker = "../../Resources/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "../../Resources/Physijs/ammo.js";

var scene, camera, renderer;
var meshFloor, ambientLight, light;

var cameraCenter = new THREE.Vector3();

var keyboard = {};
var USE_WIREFRAME = false;

// An object to hold all the things needed for our loading screen
var loadingManager = null;
var RESOURCES_LOADED = true;

//Obstacle creation time
var timeSleep = 10000;

// Meshes and physical index
var meshes = {};
var phy_boxes = [];

var timerId;

var obstacleSpeed = 10;
var tmp = new THREE.Box3();
var size = tmp.size();
var tmpPosition = new THREE.Vector3();

var animation;

var penguin_box;
var moveLeft = false;
var moveRight = false;
var moving = false;
var speed = -10.0;

var backgroundSpeed = 0.1;
var backgrounds = [];
var backgroundsOrigin = [];

var loaded = false;
var started = false;

// Create obstacles
function ObstacleMaker() {
    var ob_x = [-10, -5, 0, 5, 10];
    var ob_z = 17;
    var mod = (Math.random() * 10).toFixed(0);
    var pos = (Math.random() * 10).toFixed(0);
    var x_pos = (Math.random() * 10).toFixed(0);
    var z_pos = (Math.random() * 100).toFixed(0);

    if (mod % 6 == 0) {
        meshes[i] = models.stone.mesh.clone();
        meshes[i].scale.set(3, 3, 3);
        tmp = new THREE.Box3().setFromObject(meshes[i]);
        size = tmp.getSize();
        meshes[i].position.y = -size.y / 2.0;
        tmpPosition.setFromMatrixPosition(meshes[i].matrixWorld);
        phy_boxes[i] = new Physijs.BoxMesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0, transparent: true })
        );
        phy_boxes[i].position.set(
            tmpPosition.x,
            tmpPosition.y + size.y / 2.0,
            tmpPosition.z
        );
    } else if (mod % 6 == 1) {
        meshes[i] = models.obstacle2.mesh.clone();
        meshes[i].scale.set(3, 3, 3);
        tmp = new THREE.Box3().setFromObject(meshes[i]);
        size = tmp.getSize();
        meshes[i].position.y = -size.y / 2.0;
        tmpPosition.setFromMatrixPosition(meshes[i].matrixWorld);
        phy_boxes[i] = new Physijs.BoxMesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0, transparent: true })
        );
        phy_boxes[i].position.set(
            tmpPosition.x,
            tmpPosition.y + size.y / 2.0,
            tmpPosition.z
        );
    } else if (mod % 6 == 2) {
        meshes[i] = models.obstacle3.mesh.clone();
        meshes[i].scale.set(3, 3, 3);
        tmp = new THREE.Box3().setFromObject(meshes[i]);
        size = tmp.getSize();
        meshes[i].position.y = -size.y / 2.0;
        tmpPosition.setFromMatrixPosition(meshes[i].matrixWorld);
        phy_boxes[i] = new Physijs.BoxMesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0, transparent: true })
        );
        phy_boxes[i].position.set(
            tmpPosition.x,
            tmpPosition.y + size.y / 2.0,
            tmpPosition.z
        );
    } else if (mod % 6 == 3) {
        meshes[i] = models.obstacle4.mesh.clone();
        meshes[i].scale.set(3, 3, 3);
        tmp = new THREE.Box3().setFromObject(meshes[i]);
        size = tmp.getSize();
        meshes[i].position.y = -size.y / 2.0;
        tmpPosition.setFromMatrixPosition(meshes[i].matrixWorld);
        phy_boxes[i] = new Physijs.BoxMesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0, transparent: true })
        );
        phy_boxes[i].position.set(
            tmpPosition.x,
            tmpPosition.y + size.y / 2.0,
            tmpPosition.z
        );
    } else if (mod % 6 == 4) {
        meshes[i] = models.obstacle5.mesh.clone();
        meshes[i].scale.set(3, 3, 3);
        tmp = new THREE.Box3().setFromObject(meshes[i]);
        size = tmp.getSize();
        meshes[i].position.y = -size.y / 2.0;
        tmpPosition.setFromMatrixPosition(meshes[i].matrixWorld);
        phy_boxes[i] = new Physijs.BoxMesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0, transparent: true })
        );
        phy_boxes[i].position.set(
            tmpPosition.x,
            tmpPosition.y + size.y / 2.0,
            tmpPosition.z
        );
    } else if (mod % 6 == 5) {
        meshes[i] = models.ice_sheet.mesh.clone();
        tmp = new THREE.Box3().setFromObject(meshes[i]);
        size = tmp.getSize();
        meshes[i].position.y = -size.y / 2.0;
        tmpPosition.setFromMatrixPosition(meshes[i].matrixWorld);
        phy_boxes[i] = new Physijs.BoxMesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0, transparent: true })
        );
        phy_boxes[i].position.set(
            tmpPosition.x,
            tmpPosition.y + size.y / 2.0,
            tmpPosition.z
        );
    }

    //at ob_z
    if (pos % 2 == 0) {
        phy_boxes[i].position.x = -ob_x[x_pos % 5];
        phy_boxes[i].position.z = ob_z;
    } else {
        phy_boxes[i].position.x = ob_x[x_pos % 5];
        phy_boxes[i].position.z = ob_z;
    }
    meshes[i].rotation.set(0, 10, 0);

    phy_boxes[i].add(meshes[i]);
    phy_boxes[i].name = "obstacle";
    scene.add(phy_boxes[i]);
    moveObstacle(phy_boxes[i]);
    i++;
    
    // Increase creation speed
    // i -> Number of obstacle
    if (i == 10) {
        timeSleep = 7000;
        timerId = setInterval(ObstacleMaker, timeSleep);
    } else if (i == 30) {
        timeSleep = 5000;
        timerId = setInterval(ObstacleMaker, timeSleep);
    } else if (i == 70) {
        timeSleep = 3000;
        timerId = setInterval(ObstacleMaker, timeSleep);
    } else if (i == 120) {
        timeSleep = 1000;
        timerId = setInterval(ObstacleMaker, timeSleep);
    } else if (i == 150) {
        timeSleep = 700;
        timerId = setInterval(ObstacleMaker, timeSleep);
    }
}

var floorCollision = function (
    other_object,
    relative_velocity,
    relative_rotation,
    contact_normal
) {
    if (other_object.name === "floor") {
        moveObstacle(this);
        this.removeEventListener("collision", floorCollision);
    }
};

function moveObstacle(object) {
    const curVec = object.getLinearVelocity();
    object.setLinearVelocity(
        new THREE.Vector3(curVec.x, curVec.y, -obstacleSpeed)
    );
    object.__dirtyPosition = true;
    object.__dirtyRotation = true;
}

function obstaclePositionCheck() {
    phy_boxes.forEach(function (ob) {
        if (ob.position.z <= -10.0) {
            scene.remove(ob);
            phy_boxes.splice(phy_boxes.indexOf(ob), 1);
        }
    });
}

// Models index
var models = {
    grass: {
        obj: "../../Resources/OBJformat/grass.obj",
        mtl: "../../Resources/OBJformat/grass.mtl",
        mesh: null,
    },
    flower_red: {
        obj: "../../Resources/OBJformat/flower_redA.obj",
        mtl: "../../Resources/OBJformat/flower_redA.mtl",
        mesh: null,
    },
    stone: {
        obj: "../../Resources/OBJformat/stone_tallF.obj",
        mtl: "../../Resources/OBJformat/stone_tallF.mtl",
        mesh: null,
        phy: null,
    },
    obstacle2: {
        obj: "../../Resources/OBJformat/snowman.obj",
        mtl: "../../Resources/OBJformat/snowman.mtl",
        mesh: null,
        phy: null,
    },
    obstacle3: {
        obj: "../../Resources/OBJformat/snowmanFancy.obj",
        mtl: "../../Resources/OBJformat/snowmanFancy.mtl",
        mesh: null,
        phy: null,
    },
    obstacle4: {
        obj: "../../Resources/OBJformat/stone_smallE.obj",
        mtl: "../../Resources/OBJformat/stone_smallE.mtl",
        mesh: null,
        phy: null,
    },
    obstacle5: {
        obj: "../../Resources/OBJformat/stone_smallG.obj",
        mtl: "../../Resources/OBJformat/stone_smallG.mtl",
        mesh: null,
        phy: null,
    },
    ice_sheet: {
        obj: "../../Resources/OBJformat/snowPatch.obj",
        mtl: "../../Resources/OBJformat/snowPatch.mtl",
        mesh: null,
        phy: null,
    },
    uzi: {
        obj: "../../Resources/obj/penguin/Mesh_Penguin.obj",
        mtl: "../../Resources/obj/penguin/Mesh_Penguin.mtl",
        mesh: null,
        castShadow: true,
    },
    background: {
        obj: "../../Resources/OBJformat/lowpolymountains.obj",
        mtl: "../../Resources/OBJformat/lowpolymountains.mtl",
        mesh: null,
        castShadow: false,
    },
};

function init() {
    scene = new Physijs.Scene();
    camera = new THREE.PerspectiveCamera(90, 1200 / 720, 0.1, 1000);

    // Create a loading manager to set RESOURCES_LOADED when appropriate.
    // Pass loadingManager to all resource loaders.
    loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = function (item, loaded, total) {
        // console.log(item, loaded, total);
    };

    loadingManager.onLoad = function () {
        console.log("loaded all resources");
         RESOURCES_LOADED = true;
        onResourcesLoaded();
        timerId = setInterval(ObstacleMaker, timeSleep);
    };

    //-----------------------------------------------------------
    //------------------------------Floor------------------------
    //-----------------------------------------------------------

    meshFloor = new Physijs.BoxMesh(
        new THREE.PlaneGeometry(200, 100, 0, 0), // Make plane(n,m) base
        Physijs.createMaterial(
            new THREE.MeshPhongMaterial({
                color: 0xffffff,          // Plane Color
                wireframe: USE_WIREFRAME, // Make visible line -> false(invisible)
            }),
            0,
            1
        )
    );
    meshFloor.name = "floor";
    meshFloor.rotation.x -= Math.PI / 2; // To make a floor by laying down a plate
    meshFloor.receiveShadow = true; // Setting shadow
    scene.add(meshFloor);

    //-----------------------------------------------------------
    //------------------------------Light------------------------
    //-----------------------------------------------------------

    // Setting light
    ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    //point light
    light = new THREE.PointLight(0xffd400, 0.3, 50); // Light color, Brightness
    light.position.set(-5, -2, 0); // Light position
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    light.rotation.set(-5, -5, 0);
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
    for (var _key in models) {
        (function (key) {
            if (key === "uzi") {
                console.log("1")
                var material = new THREE.MeshStandardMaterial();
                const texture = new THREE.TextureLoader().load(
                    "../../Resources/obj/penguin/Tex_Penguin.png"
                );
                material.map = texture;

                var objLoader = new THREE.OBJLoader(loadingManager);
                // objLoader.setMaterials(material);
                objLoader.load(models[key].obj, function (mesh) {
                    mesh.traverse(function (node) {
                        if (node instanceof THREE.Mesh) {
                            node.material = material;
                            if ("castShadow" in models[key])
                                node.castShadow = models[key].castShadow;
                            else node.castShadow = true;
                            if ("receiveShadow" in models[key])
                                node.receiveShadow = models[key].receiveShadow;
                            else node.receiveShadow = true;
                        }
                    });
                    models[key].mesh = mesh;
                })
            } else {
                var mtlLoader = new THREE.MTLLoader(loadingManager);
                mtlLoader.load(models[key].mtl, function (materials) {
                materials.preload();

                var objLoader = new THREE.OBJLoader(loadingManager);

                objLoader.setMaterials(materials);
                objLoader.load(models[key].obj, function (mesh) {
                    mesh.traverse(function (node) {
                        if (node instanceof THREE.Mesh) {
                            if ("castShadow" in models[key])
                                node.castShadow = models[key].castShadow;
                            else node.castShadow = true;
                            if ("receiveShadow" in models[key])
                                node.receiveShadow = models[key].receiveShadow;
                            else node.receiveShadow = true;
                        }
                    });
                    models[key].mesh = mesh;
                });
            });
            }
        })(_key);
    }

    //-----------------------------------------------------------
    //------------------------------Camera------------------------
    //-----------------------------------------------------------

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);
    renderer.setClearColor(0xffffff, 1);

    camera.position.set(0, 3, -10);
    camera.rotation.y += 0.005;
    camera.rotation.x += 0.001;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // Switch Position to Vector Value
    cameraCenter.x = camera.position.x;
    cameraCenter.y = camera.position.y;
    cameraCenter.z = camera.position.z;

    //-----------------------------------------------------------
    //---------------------------Shadow------------------------
    //-----------------------------------------------------------

    // Create shadow
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();
}

var tmp;
// Create random grass and flower
function setGrasses() {
    var i = 0;
    for (; i < 30; i++) {
        backgroundsOrigin[i] = getRandom(20, 40);
        backgrounds.push(models.grass.mesh.clone());
        backgrounds.push(models.flower_red.mesh.clone());
        backgrounds[i].position.set(
            getRandom(-15, 15),
            0,
            backgroundsOrigin[i]
        );
        backgroundsOrigin[i + 1] = getRandom(20, 40);
        backgrounds[i + 1].position.set(
            getRandom(-15, 15),
            0,
            getRandom(20, 40)
        );
        scene.add(backgrounds[i]);
        scene.add(backgrounds[i + 1]);
    }
    console.log(i);
    setMountains(i);
}

// Create random mountain
function setMountains(num) {
    backgrounds[num] = models.background.mesh.clone();
    backgrounds[num + 1] = models.background.mesh.clone();
    backgrounds[num + 2] = models.background.mesh.clone();
    backgrounds[num + 3] = models.background.mesh.clone();
    backgrounds[num + 4] = models.background.mesh.clone();
    backgrounds[num + 5] = models.background.mesh.clone();

    backgrounds[num].position.set(15, -2, 20);
    backgroundsOrigin[num] = 20;
    backgrounds[num].scale.set(2, 2, 2);
    backgrounds[num].rotation.set(0, 5, 0);

    backgrounds[num + 1].position.set(-15, -2, 15);
    backgroundsOrigin[num + 1] = 15;
    backgrounds[num + 1].scale.set(2, 2, 2);
    backgrounds[num + 1].rotation.set(0, -5.1, 0);

    backgrounds[num + 2].position.set(15, -2, 50);
    backgroundsOrigin[num + 2] = 50;
    backgrounds[num + 2].scale.set(2, 3, 2);
    backgrounds[num + 2].rotation.set(0, 5, 0);

    backgrounds[num + 3].position.set(-15, -2, 55);
    backgroundsOrigin[num + 3] = 55;
    backgrounds[num + 3].scale.set(2, 2, 2);
    backgrounds[num + 3].rotation.set(0, -5.1, 0);

    backgrounds[num + 4].position.set(15, -2, 30);
    backgroundsOrigin[num + 4] = 30;
    backgrounds[num + 4].scale.set(2, 3, 2);
    backgrounds[num + 4].rotation.set(0, 5, 0);

    backgrounds[num + 5].position.set(-15, -2, 30);
    backgroundsOrigin[num + 5] = 30;
    backgrounds[num + 5].scale.set(2, 2, 2);
    backgrounds[num + 5].rotation.set(0, -5.1, 0);

    scene.add(backgrounds[num]);
    scene.add(backgrounds[num + 1]);
    scene.add(backgrounds[num + 2]);
    scene.add(backgrounds[num + 3]);
    scene.add(backgrounds[num + 4]);
    scene.add(backgrounds[num + 5]);
}

function setBackground() {
    setGrasses();
}

// Move Background
function moveBackground() {
    for (var i = 0; i < backgrounds.length; i++) {
        backgrounds[i].position.z -= backgroundSpeed;
        if (backgroundsOrigin[i] - backgrounds[i].position.z > getRandom(40, 50)) {
            backgrounds[i].position.z = getRandom(
                backgroundsOrigin[i] + 5,
                backgroundsOrigin[i] + 12
            );
        }
    }
}

//-----------------------------------------------------------
//---------------------- Resource Load ----------------------
//-----------------------------------------------------------

// Runs when all resources are loaded
function onResourcesLoaded() {
    setBackground(); // Create Background elements

    // penguin
    meshes["penguin"] = models.uzi.mesh.clone();
    meshes["penguin"].position.set(0, 0, 0);
    meshes["penguin"].scale.set(0.015, 0.015, 0.015);
    var tmp = new THREE.Box3().setFromObject(meshes["penguin"]);
    var size = tmp.getSize();
    var tmpPosition = new THREE.Vector3();
    tmpPosition.setFromMatrixPosition(meshes["penguin"].matrixWorld);
    penguin_box = new Physijs.BoxMesh(
        new THREE.BoxGeometry(size.x, size.y / 2, size.z),
        new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0, transparent: true })
    );
    penguin_box.position.set(
        tmpPosition.x,
        tmpPosition.y + size.y / 4.0,
        tmpPosition.z
    );
    var box = new THREE.Box3().setFromObject(penguin_box);
    size = box.size();
    meshes["penguin"].position.y = size.y / 2.0;
    penguin_box.add(meshes["penguin"]);
    scene.add(penguin_box);
    penguin_box.addEventListener(
        "collision",
        function (
            other_object,
            relative_velocity,
            relative_rotation,
            contact_normal
        ) {
            console.log(other_object.name);
            if (other_object.name === "obstacle") {
                obstacleCollistion(other_object);
                cancelAnimationFrame(animation);
            }
            // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        }
    );
    loaded = true;
    setupKeyControls();
}

// In the event of a collision with an obstacle
function obstacleCollistion(collisionObject) {
    console.log(collisionObject.name);
    var returnValue = confirm('Game Over :( \n your score is : '+score+'\n\n Try again?')
      if(returnValue){ // confirm
        location.reload();
      }else{ // cancle
        location.replace("home.html");
      }

}

//-----------------------------------------------------------
//---------------------------Animation-----------------------
//-----------------------------------------------------------
var i = 0;

function animate() {
    console.log("animate");
    scene.simulate(); // run physics

    animation = requestAnimationFrame(animate);

    //-----------------------------------------------------------
    //----------------------Keyboard setting---------------------
    //-----------------------------------------------------------

    penguinMovement();

    light.position.x -= Math.sin(light.rotation.y + Math.PI / 2) * 0.05;
    light.position.y -= Math.cos(light.rotation.y + Math.PI / 2) * 0.05;

    light.rotation.y += 0.005;
    light.rotation.x += 0.005;

    //-----------------------------------------------------------
    //-------------------Check camera position/rotation----------------
    //-----------------------------------------------------------

    if (started) {
        renderer.render(scene, camera);
    } 


    obstaclePositionCheck();
    moveBackground();
}

//-----------------------------------------------------------
//-------------------Keyboard up/down setting----------------
//-----------------------------------------------------------

function keyDown(event) {
    keyboard[event.keyCode] = true;
}
function keyUp(event) {
    keyboard[event.keyCode] = false;
}


function penguinMovement() {
    if (!loaded) {
      return;
    }
    var oldVector = penguin_box.getLinearVelocity(); // Vector of velocity the player already has
    var penguinVec = new THREE.Vector3(0, oldVector.y, oldVector.z); // penguin's Vector

    // When move left
    if (moveLeft) {
        if(penguin_box.position.x< 10){
            // Force x-values of vectors by -1*speed
            var penguinVec = new THREE.Vector3(-1 * speed, oldVector.y,oldVector.z);
        }
        // Camera position equal to penguin position
        camera.position.x = penguin_box.position.x;
        camera.position.y = penguin_box.position.y;
        camera.position.z = penguin_box.position.z + 0.5;
    }
    // When move right
    if (moveRight) {
      if( penguin_box.position.x>- 10){
          //Force x-values of vectors by 1*speed
        var penguinVec = new THREE.Vector3(1 * speed, oldVector.y, oldVector.z);
      }
      // Camera position equal to penguin position
      camera.position.x = penguin_box.position.x;
      camera.position.y = penguin_box.position.y;
      camera.position.z = penguin_box.position.z + 0.5;

    }
    penguin_box.setLinearVelocity(penguinVec); // We use an updated vector to redefine its velocity
  }

  function setFalse(){moving = false;}

  function setupKeyControls() {
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 37: //left
                moveLeft = true;
                break;
            case 39: //right
                moveRight = true;
                break;
            case 32: //Space
                moveUp = true;
                break;
        }
        penguin_box.__dirtyPosition = true;
        penguin_box.__dirtyRotation = true;
    };

    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 37: //left
                moveLeft = false;
                break;
            case 39: //right
                moveRight = false;
                break;
            case 32: //Space
                moveUp = false;
                break;

        }
    };
  }

const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.onload = init;
