
//  Three js Scene => 오브젝트들을 놓을 공간, 카메라의 방향, 광원의 위치, 어떤 물체가 있는지 등의 정보를 가지고 있다.
const scene = new THREE.Scene();

//  Scene에 오브젝트를 그리기 위한 도구
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

/*
    피사체:
    기하학적 형태, 뼈대를 담당하는 Geometry, 특정한 질감, 색, 반샤율 등을 갖는 물체의 표현 Material
    오브젝트 Mesh = Geometry + Material
*/
//  Geometry 오브젝트 생성
const geometry = new THREE.Geometry();

//  삼각형을 이룰 vertices 추가
geometry.vertices.push(
    new THREE.Vector3(-10, 10, 0),
    new THREE.Vector3(-10, -10, 0),
    new THREE.Vector3(10, -10, 0));

//  0, 1, 2번째 vertices를 이용한 면을 추가
geometry.faces.push(new THREE.Face3(0, 1, 2));

//  three.js 에서 제공하는 Geometry 를 사용하여 팔면체 생성
const RADIUS = 40;
const geometry2 = new THREE.OctahedronGeometry(RADIUS, 0)

//  Material 생성
const material = new THREE.MeshBasicMaterial({color: '#ff3030'});

//  만들어둔 Geometry 와 material 로 Mesh 생성
const mesh = new THREE.Mesh(geometry2, material);
mesh.position.z = -RADIUS * 10

//  Scene 에 Object 추가
scene.add(mesh);

const WIDTH = 200;
const HEIGHT = 200;

const FIELD_OF_VIEW = 20;  //  카메라의 시야각
const ASPECT = WIDTH / HEIGHT;  //  시야의 가로세로 비
const NEAR = 0.1;  //  렌더링 할 물체 거리의 하한값, 너무 가까이 있는 물체를 렌더하는 것을 막기위해
const FAR = 10000;  //  렌더링 할 물체 거리의 상한값

const camera = new THREE.PerspectiveCamera(
    FIELD_OF_VIEW,
    ASPECT,
    NEAR,
    FAR
);

console.log(camera)

renderer.setSize(WIDTH, HEIGHT);

const container = document.querySelector("#three");

container.appendChild(renderer.domElement);

renderer.render(scene, camera);
