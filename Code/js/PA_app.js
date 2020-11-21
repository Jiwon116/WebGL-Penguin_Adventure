"use strict";
import * as THREE from "../../node_modules/three/build/three.module.js";
import { OBJLoader } from "../../node_modules/three/examples/jsm/loaders/OBJLoader.js";

Physijs.scripts.worker = "../../Resources/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "../../Resources/Physijs/ammo.js";

var initScene, renderer, scene, camera, box;

// var velocity = new THREE.Vector3();
// var prevTime = performance.now();
// var moveForward = false;

var de2ra = function (degree) {
    return degree * (Math.PI / 180.0);
};

var penguin;
var moveLeft = false;
var moveRight = false;
var speed = 30.0;

initScene = async function () {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 30, window.innerHeight - 30);
    document.getElementById("viewport").appendChild(renderer.domElement);

    scene = new Physijs.Scene();
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    scene.add(light);

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        5000
    );
    camera.position.set(0, 200, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    //  좌표계 추가, X: 빨간색, Y: 녹색, Z: 파란색
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    // Load Penguin
    const loader = new OBJLoader();
    var material = new THREE.MeshStandardMaterial();
    const texture = new THREE.TextureLoader().load(
        "../../Resources/obj/penguin/Tex_Penguin.png"
    );

    material.map = texture;
    var penguin;

    objLoadToPhysijs("../../Resources/obj/penguin/Mesh_Penguin.obj", material);
    // Add plane
    const plane = new Physijs.BoxMesh(
        new THREE.PlaneGeometry(200, 1000),
        new THREE.MeshLambertMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
        })
    );

    var material_plane = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
    });
    const texture_plane = new THREE.TextureLoader().load(
        "../../Resources/obj/checker.png"
    );

    material_plane.map = texture_plane;
    plane.material = material_plane;
    plane.rotation.x = de2ra(90);
    plane.position.z = -200;
    plane.position.y = -10;
    scene.add(plane);

    // TEST
    var box = new Physijs.BoxMesh(
        new THREE.BoxGeometry(50, 30, 100),
        // new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}),
        new THREE.MeshBasicMaterial({ wireframe: true, opacity: 1 }) 
    );
    box.position.set(-40, 10, 0);
    scene.add(box);
    // TEST

    requestAnimationFrame(render);
};

var render = function () {
    scene.simulate(); // run physics
    requestAnimationFrame(render);
    renderer.render(scene, camera); // render the scene

    // //lets make sure we can move camera smoothly based on user's performance.
    // var time = performance.now();
    // var delta = (time - prevTime) / 1000;

    // //reset z velocity to be 0 always. But override it if user presses up or w. See next line...
    // velocity.z -= velocity.z * 10.0 * delta;
    // //if the user pressed 'up' or 'w', set velocity.z to a value > 0.
    // if (moveForward) velocity.z -= 400.0 * delta;

    // //pass velocity as an argument to translateZ and call it on camera.
    // camera.translateZ(velocity.z * delta);

    // prevTime = time;

    penguinMovement();
};

function penguinMovement() {
    var oldVector = penguin.getLinearVelocity(); // Vector of velocity the player already has
    var penguinVec = new THREE.Vector3(0, oldVector.y, oldVector.z);
    if (moveLeft) {
        var penguinVec = new THREE.Vector3(
            -1 * speed,
            oldVector.y,
            oldVector.z
        );
    } 
    if (moveRight) {
        var penguinVec = new THREE.Vector3(1 * speed, oldVector.y, oldVector.z);
    } 
    penguin.setLinearVelocity(penguinVec); // We use an updated vector to redefine its velocity
}

function objLoadToPhysijs(src, material) {
    const loader = new OBJLoader();
    loader.load(src, function (object) {
        var child = object.children[0];

        child.material = material;

        const physGeom = new THREE.BoxGeometry(100, 100, 100);
        const physMaterial = new Physijs.createMaterial({
            transparent: true,
            opacity: 0.0,
        });
        physMaterial.visible = false;

        var obj = new Physijs.BoxMesh(
            physGeom,
            new THREE.MeshBasicMaterial({ wireframe: true, opacity: 1 })
        );
        child.position.set(0, 0, 0);
        obj.add(child);
        obj.name = "penguin";
        obj.scale.set(0.3, 0.3, 0.3);
        obj.rotation.x = de2ra(-25);
        obj.rotation.y = de2ra(180);
        obj.position.set(0, 10, 0);
        penguin = obj;
        penguin.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
            console.log("collision!!");
            // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        });
        scene.add(obj);
        setupKeyControls();
    });
}

window.onload = initScene();

function setupKeyControls() {
    var movement = new THREE.Vector3(0.0);
    var forceAmount = 20;
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 37: //좌
                moveLeft = true;
                break;
            case 39: //우
                moveRight = true;
                break;
        }
        penguin.__dirtyPosition = true;
        penguin.__dirtyRotation = true;
    };
    console.log(penguin);

    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 37: //좌
                moveLeft = false;
                break;
            case 39: //우
                moveRight = false;
                break;
        }
    };
}

//TODO: 충돌 처리