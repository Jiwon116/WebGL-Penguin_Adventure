"use strict";
import * as THREE from "../../node_modules/three/build/three.module.js";
import { OBJLoader } from "../../node_modules/three/examples/jsm/loaders/OBJLoader.js";

Physijs.scripts.worker = "../../Resources/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "../../Resources/Physijs/ammo.js";

var initScene, renderer, scene, camera, box;

var de2ra = function (degree) {
    return degree * (Math.PI / 180.0);
};

initScene = function () {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("viewport").appendChild(renderer.domElement);

    scene = new Physijs.Scene();
    const light = new THREE.AmbientLight(0xffffff, 1);
    light.castShadow = true;
    scene.add(light);

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.set(0, 20, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    
    var box = new Physijs.BoxMesh(
        new THREE.BoxGeometry(1, 1, 1),
        // new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}),
        new THREE.MeshBasicMaterial({ wireframe: true, opacity: 1 }) 
    );
    scene.add(box);


    requestAnimationFrame(render);
};

var render = function () {
    // scene.simulate(); // run physics
    renderer.render(scene, camera); // render the scene
    requestAnimationFrame(render);
};

window.onload = initScene();
