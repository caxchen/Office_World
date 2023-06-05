/**
 * This file will populate the office space with furniture prefabs
 * defined in prefabs.js.
 */
import * as Prefabs from './prefabs.js';
import * as THREE from 'three';


function rad(deg) {
    return deg * (Math.PI/180);
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
  let thickness = 0.1;
  const floor_geom = new THREE.BoxGeometry(roomx,thickness,roomz);
  const floor = new THREE.Mesh(floor_geom, white_mat);
  floor.position.y = -roomy / 2;
  scene.add(floor);
  const roof = new THREE.Mesh(floor_geom, white_mat);
  roof.position.y = roomy / 2;
  //scene.add(roof);

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
  scene.add(horizontalLiningBottom);
  const horizontalLiningTop = new THREE.Mesh(horizontalLining_geom, blackLining_mat);
  horizontalLiningTop.position.y = (roomy/2) - strutWidth;
  horizontalLiningTop.position.z = roomz/2;
  horizontalLiningTop.position.y -= strutInwardOffset;
  scene.add(horizontalLiningTop);
  //vertical struts
  //counting from sides:  L1 L2 R2 R1
  const verticalStrut_geom = new THREE.BoxGeometry(strutWidth, roomy-thickness, strutThickness);
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
  scene.add(verticalStrutL2);
  const verticalStrutR2 = new THREE.Mesh(verticalStrut_geom, blackLining_mat);
  verticalStrutR2.position.x = -(roomx/3) /2;
  verticalStrutR2.position.z = roomz/2;
  scene.add(verticalStrutR2);
}


export function addFurniture(scene) {
    //let testPrefab = new 
    //let testPrefab = new Prefabs.TestPrefab(scene);
    //testPrefab.translate(0,0,0);
    //testPrefab.addToScene(scene);
    let desk = new Prefabs.Desk(scene);
    desk.translate(0, -0.88, 1.25);
    //desk.rotateY(rad(20))
    requestAnimationFrame(()=>{testAnimate(desk)});
    desk.addToScene(scene);
}

function testAnimate(prefab) {
    prefab.rotateY(rad(0.1));
    requestAnimationFrame(()=>{testAnimate(prefab)});
}
