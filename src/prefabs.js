import * as THREE from 'three';

function rad(deg) {
    return deg * (Math.PI/180);
}

class Prefab {
    constructor(scene) {
        this.shapes = [];
        //add shapes here
    }

    addToScene(scene=this.scene) {
        for (let i=0; i<this.shapes.length; i++) {
            scene.add(this.shapes[i])
        }
    }

    translate(x=0,y=0,z=0) {
        for (let i=0; i<this.shapes.length; i++) {
            this.shapes[i].position.x += x;
            this.shapes[i].position.y += y;
            this.shapes[i].position.z += z;
        }
    }
}

const white_mat = new THREE.MeshPhysicalMaterial({
    color:0xffffff,
    clearcoat: 0.5,
  })

export class TestPrefab extends Prefab {
    constructor(scene) {
        super(scene);
        const white_mat = new THREE.MeshPhongMaterial({
            color:0xffffff,
        })
        const cube_geom = new THREE.BoxGeometry(1,1,1);
        const cube1 = new THREE.Mesh(cube_geom, white_mat);
        cube1.position.x -= 0.6;
        this.shapes.push(cube1);
        const cube2 = new THREE.Mesh(cube_geom, white_mat);
        cube2.position.x += 0.6;
        this.shapes.push(cube2);
    }
}

function getJoint(heightIn=13) {
    //radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength;
    let scale = 0.075;
    let rTop = 1*scale;
    let rBottom = rTop;
    let height = heightIn*scale;
    let rSegments = 10;
    let hSegments = 1;
    let openEnded = false;
    let tStart = 0;
    let tLength = rad(90);
    return new THREE.CylinderGeometry(rTop, rBottom, height, rSegments, hSegments, openEnded, tStart, tLength);
}

//left and right is from Heron's perspective
export class Desk extends Prefab {
    constructor(scene) {
        super(scene);
        let deskWidth = 2.5;
        let deskHeight = 0.8;
        let deskLength = 0.9;
        let shelfWidth = deskWidth/4;
        //  L1-----------R1
        //  |   |    |   |
        //  L2--l3   R3  R2
        // 1 Joints
        const joint_geom = getJoint(deskLength*13);
        const jointL1 = new THREE.Mesh(joint_geom, white_mat);
        jointL1.rotateZ(rad(180));
        jointL1.rotateX(rad(90));
        jointL1.position.x = -deskWidth/2;
        jointL1.position.y = deskHeight;
        this.shapes.push(jointL1);
        const jointR1 = new THREE.Mesh(joint_geom, white_mat);
        jointR1.rotateZ(rad(90));
        jointR1.rotateX(rad(90));
        jointR1.position.x = deskWidth/2;
        jointR1.position.y = deskHeight;
        this.shapes.push(jointR1);
        //2 Joints
        const jointL2 = new THREE.Mesh(joint_geom, white_mat);
        jointL2.rotateZ(rad(270));
        jointL2.rotateX(rad(90));
        jointL2.position.x = -deskWidth/2;
        this.shapes.push(jointL2);
        const jointR2 = new THREE.Mesh(joint_geom, white_mat);
        //jointR2.rotateZ(rad(90))
        jointR2.rotateX(rad(90));
        jointR2.position.x = deskWidth/2;
        this.shapes.push(jointR2);
        //3 Joints
        let betweenShelves = (deskWidth-(2*shelfWidth));
        const jointL3 = new THREE.Mesh(joint_geom, white_mat);
        //jointL3.rotateZ(rad(0))
        jointL3.rotateX(rad(90));
        jointL3.position.x = -betweenShelves/2;
        this.shapes.push(jointL3);
        const jointR3 = new THREE.Mesh(joint_geom, white_mat);
        jointR3.rotateZ(rad(270))
        jointR3.rotateX(rad(90));
        jointR3.position.x = betweenShelves/2;
        this.shapes.push(jointR3);

        //NOW ADD THE FLAT PIECES
        let thickness = 0.075;
        //First, z axis aligned panels.
        //top panel
        let adjustedDeskWidth = deskWidth*1.01;
        let adjustedDeskLength = deskLength*0.975;
        const top_geom = new THREE.BoxGeometry(deskWidth*1.01, thickness, deskLength*0.975);
        const top = new THREE.Mesh(top_geom, white_mat);
        top.position.y = deskHeight + thickness/2;
        this.shapes.push(top);
        const side_geom = new THREE.BoxGeometry(thickness, deskHeight*1.01, deskLength*0.975);
        //side panels
        const sidePanelL = new THREE.Mesh(side_geom, white_mat);
        sidePanelL.position.x = -((deskWidth/2) + thickness/2);
        sidePanelL.position.y = deskHeight/2;
        this.shapes.push(sidePanelL);
        const sidePanelR = new THREE.Mesh(side_geom, white_mat);
        sidePanelR.position.x = ((deskWidth/2) + thickness/2);
        sidePanelR.position.y = deskHeight/2;
        this.shapes.push(sidePanelR);
        //bottom panels
        let bottomPanelX = (betweenShelves/2) + (shelfWidth/2)
        const bottomPanel_geom = new THREE.BoxGeometry(shelfWidth, thickness, adjustedDeskLength);
        const bottomPanelL = new THREE.Mesh(bottomPanel_geom, white_mat);
        //bottomPanelL
        bottomPanelL.position.x = -bottomPanelX;
        bottomPanelL.position.y = -thickness/2;
        this.shapes.push(bottomPanelL);
        const bottomPanelR = new THREE.Mesh(bottomPanel_geom, white_mat);
        //bottomPanelL
        bottomPanelR.position.x = bottomPanelX;
        bottomPanelR.position.y = -thickness/2;
        this.shapes.push(bottomPanelR);
        //inner panels
        const innerPanelL = new THREE.Mesh(side_geom, white_mat);
        innerPanelL.position.x = -((betweenShelves/2) - (thickness/2));
        innerPanelL.position.y = deskHeight/2;
        this.shapes.push(innerPanelL);
        const innerPanelR = new THREE.Mesh(side_geom, white_mat);
        innerPanelR.position.x = ((betweenShelves/2) - (thickness/2));
        innerPanelR.position.y = deskHeight/2;
        this.shapes.push(innerPanelR);
        
        
    }
}