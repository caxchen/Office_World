import './style.css'
import * as THREE from 'three';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  const loader = new THREE.TextureLoader();

  let skyboxSize = 10;
  const sky_geom = new THREE.BoxGeometry(skyboxSize,skyboxSize,skyboxSize);
  const test_mat = new THREE.MeshBasicMaterial({
    //color: 0x7d7d7d,
    map: loader.load("resources/awkward_cat.jpg")
  });
  const sky_mats = createSkyboxMaterials();
  const skybox = new THREE.Mesh(sky_geom, sky_mats);

  scene.add(skybox);

  renderer.render(scene, camera);

  //skybox.rotation.x = rad(-90);

  
  function render(time) {
    //time *= 0.001;  // convert time to seconds
    //skybox.rotation.x = time;
    //skybox.rotation.y = time;
  
    renderer.render(scene, camera);
  
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);


} //main() brace
main();


function createSkyboxMaterials() {
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

  return matArray;
}

function rad(deg) {
  return deg * (Math.PI/180);
}

