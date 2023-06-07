import '../style.css'
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Prefabs from './prefabs.js';
import * as Layout from './layout.js';



let mouse = {
  mousedown: false,
  firstDrag: false, 
  currentxy: [0,0],
  lastxy: [0,0],
}

let allHeight = 10;
let activeCamera = null;
let cameras = [];

function main() {
  const canvas = document.querySelector('#c');
  const scene = new THREE.Scene();

  //setFullscreen();
  //window.addEventListener('resize', ()=>{setFullscreen()})

  const fov = 60;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = -1.3; //forward will be from - looking at +
  camera.position.y = 0.1;
  cameras.push(camera);

  const camera2 = new THREE.PerspectiveCamera(82, 2, 0.3, 50);
  camera2.position.z = 1.9;
  camera2.position.y = 0.3;
  camera2.rotation.x = rad(-12);
  cameras.push(camera2);

  activeCamera = camera;

  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  console.log(renderer.getRenderTarget());
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //const composer = new EffectComposer( renderer );
  //const renderPass = new RenderPass( scene, camera );
  //composer.addPass( renderPass );
  let controls = new OrbitControls( camera, renderer.domElement );
  controls.target = new THREE.Vector3(0,0.1,0);
  //const glitchPass = new GlitchPass();
  //composer.addPass( glitchPass );

  //controls = new OrbitControls(camera2, renderer.domElement);


  /*const loader = new THREE.TextureLoader();

  const test_mat = new THREE.MeshPhongMaterial({
    //color: 0x7d7d7d,
    map: loader.load("resources/awkward_cat.jpg")
  });*/

  //Hook up html
  let button = document.getElementById("switchPerspectives");
  button.onclick = switchPerspectives;

  createSkybox(scene);
  Layout.createLayout(scene);
  const animatedObjects = Layout.addFurniture(scene);
  Layout.addHeronLissus(scene);
  Layout.addLights(scene);
  //addTestLighting(scene);


  renderer.render(scene, camera);

  let lastTick = performance.now();
  let thisTick = performance.now();
  let accumulated = 0;
  let fps = 60;

  function tick(time) {
    thisTick = performance.now()
    let elapsed = (thisTick-lastTick);
    accumulated += elapsed;
    if (accumulated >= 1000/fps) {
      accumulated = 0;

      //Main tick code here!
      for (let i=0; i<animatedObjects.length; i++) {
        animatedObjects[i].animate(renderer);
      }
      renderer.setRenderTarget(null);
      renderer.render(scene, activeCamera);
      //composer.render();
      controls.update();

    }
    lastTick = performance.now()
    requestAnimationFrame(tick);

  } //tick brace



  requestAnimationFrame(tick);


} //main() brace
main();


export function switchPerspectives() {
  if (activeCamera == cameras[0]) activeCamera = cameras[1];
  else activeCamera = cameras[0];
}

function rad(deg) {
  return deg * (Math.PI/180);
}

function addTestLighting(scene) {
  const ambient = new THREE.AmbientLight( 0x383838 );
  scene.add(ambient);
  const testLight = new THREE.PointLight( 0xededed );
  testLight.position.y = 1.7
  testLight.position.z = 1

  scene.add(testLight);
}

function setFullscreen() {
  const canvas = document.querySelector('#c');
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}

document.addEventListener('mousedown', function() { 
  mouse.mousedown = true;
  mouse.firstDrag = true;


})
document.addEventListener('mouseup', function() {
  mouse.mousedown = false;
})
document.addEventListener('mousemove', function(ev) {
  if (mouse.mousedown) {
    mouse.currentxy = [ev.clientX, ev.clientY];
    if (mouse.firstDrag) {
      mouse.firstDrag = false;
      mouse.lastxy = mouse.currentxy;
    }
  } 
});

function createSkybox(scene) {
  //order: front,back, up,down, right,left
  let matArray = [];
  const loader = new THREE.TextureLoader();
  const color = null;//0xededed;
  const right = new THREE.MeshBasicMaterial({
    map: loader.load("resources/Daylight_Box/right.png"),
    side: THREE.DoubleSide,
    color: color
  });
  const left = new THREE.MeshBasicMaterial({
    map: loader.load("resources/Daylight_Box/left.png"),
    side: THREE.DoubleSide,
    color: color
  });
  const top = new THREE.MeshBasicMaterial({
    map: loader.load("resources/Daylight_Box/top.png"),
    side: THREE.DoubleSide,
    color: color
  });
  const bottom = new THREE.MeshBasicMaterial({
    map: loader.load("resources/Daylight_Box/bottom.png"),
    side: THREE.DoubleSide,
    color: color
  });
  const front = new THREE.MeshBasicMaterial({
    map: loader.load("resources/Daylight_Box/front.png"),
    side: THREE.DoubleSide,
    color: color
  });
  const back = new THREE.MeshBasicMaterial({
    map: loader.load("resources/Daylight_Box/back.png"),
    side: THREE.DoubleSide,
    color: color
  });
  matArray.push(right); //done
  matArray.push(left); //done
  matArray.push(top); //done
  matArray.push(bottom); //done
  matArray.push(front); //done
  matArray.push(back); //done

  let skyboxSize = 60;
  const sky_geom = new THREE.BoxGeometry(skyboxSize,skyboxSize,skyboxSize);
  const skybox = new THREE.Mesh(sky_geom, matArray);
  skybox.rotation.y = rad(90)
  skybox.position.y -= allHeight;
  scene.add(skybox);
}

