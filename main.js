import './style.css'
import * as THREE from 'three';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  const loader = new THREE.TextureLoader();

  const sky_geom = new THREE.BoxGeometry(1,1,1);
  const test_mat = new THREE.MeshBasicMaterial({
    //color: 0x7d7d7d,
    map: loader.load("resources/awkward_cat.jpg")
  });
  const sky_mats = [
    test_mat,
    test_mat,
    test_mat,
    test_mat,
    test_mat,
    test_mat,
  ]
  const cube = new THREE.Mesh(sky_geom, test_mat);

  scene.add(cube);

  renderer.render(scene, camera);
  
  function render(time) {
    time *= 0.001;  // convert time to seconds
    cube.rotation.x = time;
    cube.rotation.y = time;
  
    renderer.render(scene, camera);
  
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);




} //main() brace
main();

