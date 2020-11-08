const scene = new THREE.Scene()

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)

var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);
camera.position.z = 300

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff)
document.body.appendChild(renderer.domElement)

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0; // 마우스로 카메라를 회전시킬 속도입니다. 기본값(Float)은 1입니다.
controls.zoomSpeed = 1.2; // 마우스 휠로 카메라를 줌 시키는 속도 입니다. 기본값(Float)은 1입니다.
controls.panSpeed = 0.8; // 패닝 속도 입니다. 기본값(Float)은 1입니다.
controls.minDistance = 5; // 마우스 휠로 카메라 거리 조작시 최소 값. 기본값(Float)은 0 입니다.
controls.maxDistance = 1000; // 마우스 휠로 카메라 거리 조작시 최대 값. 기본값(Float)은 무제한 입니다.

//  Load 3d obj
const loader = new THREE.OBJLoader
const material = new THREE.MeshStandardMaterial
const texture = new THREE.TextureLoader().load("../../Resources/obj/penguin/Tex_Penguin.png")

material.map = texture

//  obj 파일 호출
loader.load("../../Resources/obj/penguin/Mesh_Penguin.obj", function (object) {
    object.traverse(function (body) {
        if (body instanceof THREE.Mesh) {
            body.material = material
            scene.add(body)
        }
    })
})

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}
animate()
