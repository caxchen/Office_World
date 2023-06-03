import './style.css'
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

function main() {
  const canvas = document.querySelector('#c');
  const scene = new THREE.Scene();

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const renderer = new THREE.WebGLRenderer({antialias: false, canvas});
  const composer = new EffectComposer( renderer );
  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );
  //const glitchPass = new GlitchPass();
  //composer.addPass( glitchPass );

  const loader = new THREE.TextureLoader();

  const test_mat = new THREE.MeshPhongMaterial({
    //color: 0x7d7d7d,
    map: loader.load("resources/awkward_cat.jpg")
  });

  createSkybox(scene);
  createOffice(scene);

  renderer.render(scene, camera);



  //skybox.rotation.x = rad(-90);
  
  function render(time) {
    //renderer.render(scene, camera);
    composer.render();
    moveCamera();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);


} //main() brace
main();


function rad(deg) {
  return deg * (Math.PI/180);
}

let mousedown = false;
let currentxy = [0,0];
let lastxy = [0,0];
document.addEventListener('mousedown', function() { 
  mousedown = true;
})
document.addEventListener('mouseup', function() {
  mousedown = false;
})
document.addEventListener('mousemove', function(ev) {
  if (mousedown) {
    currentxy = [ev.clientX, ev.clientY];
  }
})
function moveCamera(camera) {
  if (!mousedown) return;
  let xchange = currentxy[0] - lastxy[0];
  let ychange = currentxy[1] - lastxy[1];
  if (xchange == 0 && ychange == 0) return;
  console.log(xchange, ychange);
  //IMPLEMENT CAMERA ROTATION HERE

  lastxy = currentxy
}


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

  let skyboxSize = 10;
  const sky_geom = new THREE.BoxGeometry(skyboxSize,skyboxSize,skyboxSize);
  const skybox = new THREE.Mesh(sky_geom, matArray);
  scene.add(skybox);
}


function createOffice(scene) {
  const floor_geom = new THREE.BoxGeometry(1,0.1,1);
  const white_mat = new THREE.MeshBasicMaterial({
    color:0xffffff,
    //map: loader.load("resources/red.png")
  }) 
  const floor = new THREE.Mesh(floor_geom, white_mat);
  floor.position.y = -0.5;
  scene.add(floor);
}


