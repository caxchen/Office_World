/**
 * This file will populate the office space with furniture prefabs
 * defined in prefabs.js.
 */
import * as Prefabs from './prefabs.js';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


function rad(deg) {
    return deg * (Math.PI/180);
}


let officeDimensions = {
  x:5,
  y:2,
  z:5,
}
export function createLayout(scene) {
  const white_mat = new THREE.MeshPhysicalMaterial({
    color:0xffffff,
    //roughness: 0.45,
    clearcoat: 0.5,
  })
  const darkerWhite_mat = new THREE.MeshPhongMaterial({
    color:0xf0f0f0
  })
  const metal_mat = new THREE.MeshStandardMaterial({
    color:0x8a8888,
    metalness: 1.0,
    roughness: 0.6,
  })
  const glass_mat = new THREE.MeshStandardMaterial({
    color: 0x617987,
    roughness: 0.2,
    transparent: true,
    opacity: 0.13,
  })
  const blackLining_mat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.8,
  })
  let roomx = 6.5;
  let roomz = 6;
  let roomy = 2;
  officeDimensions.x = roomx;
  officeDimensions.y = roomy;
  officeDimensions.z = roomz;
  let thickness = 0.1;
  const floor_geom = new THREE.BoxGeometry(roomx,thickness,roomz);
  const floor = new THREE.Mesh(floor_geom, white_mat);
  floor.position.y = -roomy / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const roof = new THREE.Mesh(floor_geom, white_mat);
  roof.position.y = roomy / 2;
  roof.castShadow = true;
  roof.receiveShadow = true;
  scene.add(roof);

  const sideWallGeom = new THREE.BoxGeometry(thickness,roomy,roomz);
  const leftWall = new THREE.Mesh(sideWallGeom, white_mat);
  leftWall.position.x = roomx / 2;
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  scene.add(leftWall);
  const rightWall = new THREE.Mesh(sideWallGeom, white_mat);
  rightWall.position.x = -roomx / 2;
  rightWall.castShadow = true;
  rightWall.receiveShadow = true;
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
  doorKnob.position.z = -roomz*0.5 + thickness*0.8;
  doorKnob.position.y = -doorHeight * 0.25;
  doorKnob.position.x = doorWidth * 0.15;
  scene.add(doorKnob);
  //now add glass
  let glassThickness = 0.04
  const glass_geom = new THREE.BoxGeometry(roomx, roomy, 0.04);
  const glass = new THREE.Mesh(glass_geom, glass_mat);
  glass.position.z = roomz/2;
  scene.add(glass);
  //now add black window struts
  let strutThickness = glassThickness * 1.1;
  let strutWidth = roomy * 0.01;
  let strutInwardOffset = 0.03;
  //horizontal struts
  const horizontalLining_geom = new THREE.BoxGeometry(roomx-thickness, strutWidth, strutThickness);
  const horizontalLiningBottom = new THREE.Mesh(horizontalLining_geom, blackLining_mat);
  horizontalLiningBottom.position.y = - (roomy/2) + strutWidth;
  horizontalLiningBottom.position.z = roomz/2;
  horizontalLiningBottom.position.y += strutInwardOffset;
  //horizontalLiningBottom.castShadow = true;
  scene.add(horizontalLiningBottom);
  const horizontalLiningTop = new THREE.Mesh(horizontalLining_geom, blackLining_mat);
  horizontalLiningTop.position.y = (roomy/2) - strutWidth;
  horizontalLiningTop.position.z = roomz/2;
  horizontalLiningTop.position.y -= strutInwardOffset;
  //horizontalLiningTop.castShadow = true;
  scene.add(horizontalLiningTop);
  //vertical struts
  //counting from sides:  L1 L2 R2 R1
  const verticalStrut_geom = new THREE.BoxGeometry(strutWidth*1, (roomy-thickness), strutThickness);
  const verticalStrutL1 = new THREE.Mesh(verticalStrut_geom, blackLining_mat);
  verticalStrutL1.position.x = roomx/2 - strutWidth;
  verticalStrutL1.position.z = roomz/2;
  verticalStrutL1.position.x -= strutInwardOffset;
  scene.add(verticalStrutL1);
  const verticalStrutR1 = new THREE.Mesh(verticalStrut_geom, blackLining_mat);
  verticalStrutR1.position.x = -roomx/2 + strutWidth;
  verticalStrutR1.position.z = roomz/2;
  verticalStrutR1.position.x += strutInwardOffset;
  scene.add(verticalStrutR1);
  const verticalStrutL2 = new THREE.Mesh(verticalStrut_geom, blackLining_mat);
  verticalStrutL2.position.x = (roomx/3) /2;
  verticalStrutL2.position.z = roomz/2;
  verticalStrutL2.castShadow = true;
  scene.add(verticalStrutL2);
  const verticalStrutR2 = new THREE.Mesh(verticalStrut_geom, blackLining_mat);
  verticalStrutR2.position.x = -(roomx/3) /2;
  verticalStrutR2.position.z = roomz/2;
  verticalStrutR2.castShadow = true;
  scene.add(verticalStrutR2);
}


export function addFurniture(scene) {
  let desk = new Prefabs.Desk(scene, 0.77);
  desk.translate(0, -0.88, 1.25);
  //desk.rotateY(rad(20));
  desk.addToScene(scene);
  let executiveChair = new Prefabs.ExecutiveChair(scene, 0.7);
  executiveChair.translate(0, -0.47, 1.8);
  executiveChair.addToScene(scene);

  let animatedObjects = [];
  let dataReading = new Prefabs.DataReading(scene);
  dataReading.addToScene(scene);
  animatedObjects.push(dataReading);

  return animatedObjects;
}

//requestAnimationFrame(()=>{testAnimate(desk)});
function testAnimate(prefab) {
    prefab.rotateY(rad(0.1));
    requestAnimationFrame(()=>{testAnimate(prefab)});
}

export function addHeronLissus(scene) {
  const mtlLoader = new MTLLoader();
  //const objLoader = new OBJLoader();
  mtlLoader.setPath( './resources/Heron_Lissus/obj&mtl_pose2/' );
  mtlLoader.load(
    'Heron_Lissus.mtl',
    function(materials) {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        '../resources/Heron_Lissus/obj&mtl_pose2/Heron_Lissus.obj',
        function(object) {
          //fix the emissive not showing
          object.children[0].material.emissive = new THREE.Color(0xffffff);
          //now position and scale Heron
          let scale = 0.53;
          object.scale.set(scale,scale,scale);
          object.rotation.y = rad(180);
          object.position.z = 1.75;
          object.position.y = -0.9;
          object.castShadow = true;
          object.receiveShadow = true;
          scene.add(object)
        }
      )
    },
    //function() { console.log("inprogress") },
    //function() { console.log("error")}
  )
  /* DELETED LINE SEGMENTS AT END
  l 5426 9421
  l 10893 10915
  l 5438 1382
  l 5437 1383
  l 1383 5438
  l 95528 95532
  l 12280 12302
  l 1384 5437
  */
}


export function addLights(scene) {
  //ambient light
  const ambient = new THREE.AmbientLight( 0x383838 );
  scene.add(ambient);

  //ceiling lights
  let x = (officeDimensions.x/2) * 0.6;
  let y = (officeDimensions.y/2) * 0.95;
  let z = (officeDimensions.z/2) * 0.7;
  //left (from Heron's perspective)
  const lightL1 = new Prefabs.CeilingLight(scene, false);
  lightL1.translate(-x, y, z);
  lightL1.addToScene(scene);
  const lightL2 = new Prefabs.CeilingLight(scene, false);
  lightL2.translate(-x, y, 0);
  lightL2.addToScene(scene);
  const lightL3 = new Prefabs.CeilingLight(scene, true);
  lightL3.translate(-x, y, -z);
  lightL3.addToScene(scene);
  //right (from Heron's perspective)
  const lightR1 = new Prefabs.CeilingLight(scene, false);
  lightR1.translate(x, y, z);
  lightR1.addToScene(scene);
  const lightR2 = new Prefabs.CeilingLight(scene, false);
  lightR2.translate(x, y, 0);
  lightR2.addToScene(scene);
  const lightR3 = new Prefabs.CeilingLight(scene, true);
  lightR3.translate(x, y, -z);
  lightR3.addToScene(scene);

  let sunx = 0.2;
  let suny = 2;
  let sunz = 1.5;
  const sunlight = new THREE.DirectionalLight( 0xfffffa, 0.3 );
  sunlight.castShadow = true;
  //OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
  //sunlight.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.5, 1000 )
  //console.log(sunlight.shadow.camera);
  const d = 10
  sunlight.shadow.camera = new THREE.OrthographicCamera( -d, d, d, -d, 0.5, 1000 )
  sunlight.position.set(sunx,suny,sunz);
  scene.add( sunlight );
  const sphere_geom = new THREE.SphereGeometry(0.5);
  const red_mat = new THREE.MeshBasicMaterial({color:0xff0000});
  const targeter = new THREE.Mesh(sphere_geom, red_mat);
  targeter.position.set(sunx,suny,sunz);
  //scene.add(targeter);
  const origin = new THREE.Mesh(sphere_geom, red_mat);
  //scene.add(origin);
}
