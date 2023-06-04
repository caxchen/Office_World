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

  const fov = 50;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 1; //forward will be from - looking at +
  camera.position.y = 0;

  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  const composer = new EffectComposer( renderer );
  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.target = new THREE.Vector3(0,0,-2);
  //const glitchPass = new GlitchPass();
  //composer.addPass( glitchPass );

  const loader = new THREE.TextureLoader();

  const test_mat = new THREE.MeshPhongMaterial({
    //color: 0x7d7d7d,
    map: loader.load("resources/awkward_cat.jpg")
  });

  createSkybox(scene);
  createLayout(scene);


  addTestLighting(scene);

  renderer.render(scene, camera);

  function render(time) {
    //renderer.render(scene, camera);
    composer.render();
    controls.update();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);


} //main() brace
main();


function rad(deg) {
  return deg * (Math.PI/180);
}

function addTestLighting(scene) {
  const ambient = new THREE.AmbientLight( 0x383838 );
  scene.add(ambient);
  const testLight = new THREE.PointLight( 0xededed );
  //testLight.position.y = 1

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

  let skyboxSize = 50;
  const sky_geom = new THREE.BoxGeometry(skyboxSize,skyboxSize,skyboxSize);
  const skybox = new THREE.Mesh(sky_geom, matArray);
  skybox.rotation.y = rad(90)
  scene.add(skybox);
}


function createLayout(scene) {
  const white_mat = new THREE.MeshStandardMaterial({
    color:0xffffff,
    roughness: 0.45,
  })
  const darkerWhite_mat = new THREE.MeshPhongMaterial({
    color:0xf0f0f0
  })
  const metal_mat = new THREE.MeshStandardMaterial({
    color:0x8a8888,
    metalness: 1.0,
    roughness: 0.6,
  })
  let roomx = 6.5;
  let roomz = 5;
  let roomy = 2;
  let thickness = 0.1;
  const floor_geom = new THREE.BoxGeometry(roomx,thickness,roomz);
  const floor = new THREE.Mesh(floor_geom, white_mat);
  floor.position.y = -roomy / 2;
  scene.add(floor);
  const roof = new THREE.Mesh(floor_geom, white_mat);
  roof.position.y = roomy / 2;
  scene.add(roof);

  const sideWallGeom = new THREE.BoxGeometry(thickness,roomy,roomz);
  const leftWall = new THREE.Mesh(sideWallGeom, white_mat);
  leftWall.position.x = roomx / 2;
  scene.add(leftWall);
  const rightWall = new THREE.Mesh(sideWallGeom, white_mat);
  rightWall.position.x = -roomx / 2;
  scene.add(rightWall);

  let fsx = (roomx/2) * 0.87;//front side x
  const frontSideGeom = new THREE.BoxGeometry(fsx,roomy,thickness);
  const frontSideLeft = new THREE.Mesh(frontSideGeom, white_mat);
  frontSideLeft.position.z = - roomz/2;
  frontSideLeft.position.x = - (roomx/2 - fsx/2);
  scene.add(frontSideLeft);
  const frontSideRight = new THREE.Mesh(frontSideGeom, white_mat);
  frontSideRight.position.z = -roomz/2;
  frontSideRight.position.x = (roomx/2 - fsx/2);
  scene.add(frontSideRight);
  let doorHeight = roomy * 0.66;
  let doorWidth = (roomx - fsx*2) * 2;
  const frontTopGeom = new THREE.BoxGeometry(doorWidth,roomy-doorHeight,thickness);
  const frontTop = new THREE.Mesh(frontTopGeom, white_mat);
  frontTop.position.z = -roomz/2;
  frontTop.position.y = doorHeight/2;
  scene.add(frontTop);
  const doorGeom = new THREE.BoxGeometry(doorWidth, doorHeight, thickness*0.7);
  const door = new THREE.Mesh(doorGeom, darkerWhite_mat);
  door.position.z = -roomz/2;
  door.position.y = -((roomy-doorHeight)/2)
  scene.add(door);
  //DOOR KNOB
  //radiusTop radiusBottom height radialSegments
  const doorKnob_geom = new THREE.CylinderGeometry( 1,1, 10, 7 );
  doorKnob_geom.scale = 0.1;
  const doorKnob = new THREE.Mesh(doorKnob_geom, metal_mat);
  let doorKnobScale = 0.016;
  doorKnob.scale.set(doorKnobScale,doorKnobScale,doorKnobScale);
  doorKnob.rotation.z = rad(90);
  doorKnob.position.z = -2.43;
  doorKnob.position.y = -doorHeight * 0.25;
  doorKnob.position.x = doorWidth * 0.15;
  scene.add(doorKnob);
}


