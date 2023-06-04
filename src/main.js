import '../style.css'
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let mouse = {
  mousedown: false,
  firstDrag: false, 
  currentxy: [0,0],
  lastxy: [0,0],


}

function main() {
  const canvas = document.querySelector('#c');
  const scene = new THREE.Scene();

  //setFullscreen();
  //window.addEventListener('resize', ()=>{setFullscreen()})

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
  const controls = new OrbitControls( camera, renderer.domElement );
  //const glitchPass = new GlitchPass();
  //composer.addPass( glitchPass );

  const loader = new THREE.TextureLoader();

  const test_mat = new THREE.MeshPhongMaterial({
    //color: 0x7d7d7d,
    map: loader.load("resources/awkward_cat.jpg")
  });

  createSkybox(scene);
  createLayout(scene);

  renderer.render(scene, camera);

  //camera.rotation.y += rad(30);
  //let axis = new THREE.Vector3(1,0,0);
  //let up = new THREE.Vector3(0,1,0);
  //axis.applyAxisAngle(up, camera.rotation.y);
  //camera.rotateOnAxis(axis, rad(10))
  //console.log(axis)

  //camera.rotation.y = rad(30);
  //camera.rotation.z = rad(20)

  
  function render(time) {
    //renderer.render(scene, camera);
    composer.render();
    //moveCamera(camera);
    controls.update();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);


} //main() brace
main();


function rad(deg) {
  return deg * (Math.PI/180);
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
function moveCamera(camera) {
  if (!mouse.mousedown) return;
  let horizontal = mouse.currentxy[0] - mouse.lastxy[0];
  let vertical = mouse.currentxy[1] - mouse.lastxy[1];
  if (horizontal == 0 && vertical == 0) return;
  //IMPLEMENT CAMERA ROTATION HERE
  
  let sensitivity = 0.3;
  //camera.rotation.y += rad(horizontal) * sensitivity;
  //let savedy = camera.rotation.y;
  //camera.rotation.y = 0;
  //camera.rotation.x += rad(vertical) * sensitivity;
  //camera.rotation.y = savedy + (rad(horizontal) * sensitivity);

  //camera.rotateY(rad(horizontal) * sensitivity);
  //camera.rotateX(rad(vertical) * sensitivity);
  
  //camera.rotation.y += rad(horizontal) * sensitivity;
  //let axis = new THREE.Vector3(1,0,0);
  //let up = new THREE.Vector3(0,1,0);
  //axis.applyAxisAngle(up, camera.rotation.y);
  //camera.rotateOnAxis(axis, rad(vertical) * sensitivity)
  //console.log(axis)

  //camera.rotation.y += rad(horizontal) * sensitivity;
  let axis = new THREE.Vector3(1,0,0);
  let up = new THREE.Vector3(0,1,0);
  axis.applyAxisAngle(up, camera.rotation.y);
  //camera.rotateOnAxis(axis, rad(vertical) * sensitivity)
  console.log(axis)

  mouse.lastxy = mouse.currentxy;
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


function createLayout(scene) {
  const floor_geom = new THREE.BoxGeometry(1,0.1,1);
  const white_mat = new THREE.MeshBasicMaterial({
    color:0xffffff,
    //map: loader.load("resources/red.png")
  }) 
  const floor = new THREE.Mesh(floor_geom, white_mat);
  floor.position.y = -0.5;
  scene.add(floor);
}

