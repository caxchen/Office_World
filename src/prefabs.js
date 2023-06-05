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

    rotateY(rad, pointCoords=[0,0,0]) {
        let yAxis = new THREE.Vector3(0,1,0);
        let point = new THREE.Vector3(pointCoords[0],pointCoords[1],pointCoords[2]);
        for (let i=0; i<this.shapes.length; i++) {
            this.shapes[i].position.sub(point); // remove the offset
            this.shapes[i].position.applyAxisAngle(yAxis, rad); // rotate the POSITION
            this.shapes[i].rotateOnWorldAxis(yAxis, rad);
            this.shapes[i].position.add(point); // re-add the offset
        }
    }
}

const white_mat = new THREE.MeshPhysicalMaterial({
    color:0xffffff,
    clearcoat: 0.5,
})
const blackFabric_mat = new THREE.MeshPhysicalMaterial({
    color:0x323233,
    sheen: 1,
    //sheenRoughness:0.1
})
const metal_mat = new THREE.MeshStandardMaterial({
    color:0xa1a1a1,
    //metalness: 0.3,
    roughness: 0,
    //side: THREE.DoubleSide,
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
        const top_geom = new THREE.BoxGeometry(adjustedDeskWidth, thickness, adjustedDeskLength);
        const top = new THREE.Mesh(top_geom, white_mat);
        top.position.y = deskHeight + thickness/2;
        this.shapes.push(top);
        const side_geom = new THREE.BoxGeometry(thickness, deskHeight, adjustedDeskLength);
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
        //Next x axis aligned panels LR: Left Right. FB: Front Back
        const xPanel_geom = new THREE.BoxGeometry(shelfWidth, deskHeight, thickness);
        //Left Front
        const xPanelLF = new THREE.Mesh(xPanel_geom, white_mat);
        xPanelLF.position.z = -(deskLength/2 - thickness*0.65);
        xPanelLF.position.y = deskHeight/2;
        xPanelLF.position.x = -bottomPanelX;
        this.shapes.push(xPanelLF);
        //Right Front
        const xPanelRF = new THREE.Mesh(xPanel_geom, white_mat);
        xPanelRF.position.z = -(deskLength/2 - thickness*0.65);
        xPanelRF.position.y = deskHeight/2;
        xPanelRF.position.x = bottomPanelX;
        this.shapes.push(xPanelRF);
        //Left Back
        const xPanelLB = new THREE.Mesh(xPanel_geom, white_mat);
        xPanelLB.position.z = (deskLength/2 - thickness*0.65);
        xPanelLB.position.y = deskHeight/2;
        xPanelLB.position.x = -bottomPanelX;
        this.shapes.push(xPanelLB);
        //Right Back
        const xPanelRB = new THREE.Mesh(xPanel_geom, white_mat);
        xPanelRB.position.z = (deskLength/2 - thickness*0.65);
        xPanelRB.position.y = deskHeight/2;
        xPanelRB.position.x = bottomPanelX;
        this.shapes.push(xPanelRB);
    }

}

export class Chair extends Prefab {
    constructor(scene) {
        super(scene);

        //seat cushion
        let cushionWidth = 0.5;
        let cushionLength = cushionWidth;
        let thickness = cushionWidth*0.2;
        const seatCushion_geom = new THREE.BoxGeometry(cushionWidth, thickness, cushionLength);
        const seatCushion = new THREE.Mesh(seatCushion_geom, blackFabric_mat);
        this.shapes.push(seatCushion);
        //back cushion
        let backWidth = cushionWidth * 0.9;
        let backHeight = cushionWidth * 0.5;
        const backCushion_geom = new THREE.BoxGeometry(backWidth, backHeight, thickness)
        const backCushion = new THREE.Mesh(backCushion_geom, blackFabric_mat);
        let backZ = cushionWidth * 0.7;
        backCushion.position.z = backZ;
        backCushion.position.y = cushionWidth;
        this.shapes.push(backCushion);
        //NOW THE METAL STRUTS
        let strutWidth = thickness;
        let strutHeight = thickness * 0.5;
        //strut Back Z-aligned
        const strutBZ_geom = new THREE.BoxGeometry(strutWidth, strutHeight, backZ+thickness);
        const strutBZ = new THREE.Mesh(strutBZ_geom, metal_mat);
        let strutBZ_Z = (cushionLength/2) - thickness/2;
        strutBZ.position.z = strutBZ_Z;
        strutBZ.position.y = -thickness;
        this.shapes.push(strutBZ);
        const strutBY_geom = new THREE.BoxGeometry(strutWidth, cushionWidth*1.4, strutHeight);
        const strutBY = new THREE.Mesh(strutBY_geom, metal_mat);
        strutBY.position.z = (strutBZ_Z*2) + (thickness/2) - 0.01;
        strutBY.position.y = cushionWidth*0.45;
        this.shapes.push(strutBY);
        //Now bottom pole
        const bottomPole_geom = new THREE.CylinderGeometry(strutWidth*0.4, strutWidth*0.4, cushionWidth, 8, 1, false);
        const bottomPole = new THREE.Mesh(bottomPole_geom, metal_mat);
        bottomPole.position.y = -cushionWidth * 0.6;
        this.shapes.push(bottomPole);
        //Now bottom cross struts
        const bottomStrut_geom = new THREE.BoxGeometry(strutWidth*0.6, strutHeight, cushionWidth*1.3);
        const bottomStrutZ = new THREE.Mesh(bottomStrut_geom, metal_mat);
        bottomStrutZ.position.y = -cushionWidth * 1.2;
        this.shapes.push(bottomStrutZ);
        const bottomStrutX = new THREE.Mesh(bottomStrut_geom, metal_mat);
        bottomStrutX.rotation.y = rad(90);
        bottomStrutX.position.y = bottomStrutZ.position.y;
        this.shapes.push(bottomStrutX);
        //now the four wheels
        let wheelRadius = 0.044;
        const wheelGeom = new THREE.SphereGeometry(wheelRadius);
        let wheelY = bottomStrutZ.position.y - wheelRadius*1.3;
        let wheelSideOffset = ((cushionWidth*1.3) /2) - wheelRadius;
        //front
        const wheelFront = new THREE.Mesh(wheelGeom, blackFabric_mat);
        wheelFront.position.y = wheelY;
        wheelFront.position.z = -wheelSideOffset;
        this.shapes.push(wheelFront);
        //back
        const wheelBack = new THREE.Mesh(wheelGeom, blackFabric_mat);
        wheelBack.position.y = wheelY;
        wheelBack.position.z = wheelSideOffset;
        this.shapes.push(wheelBack);
        //left
        const wheelLeft = new THREE.Mesh(wheelGeom, blackFabric_mat);
        wheelLeft.position.y = wheelY;
        wheelLeft.position.x = -wheelSideOffset;
        this.shapes.push(wheelLeft);
        //right
        const wheelRight = new THREE.Mesh(wheelGeom, blackFabric_mat);
        wheelRight.position.y = wheelY;
        wheelRight.position.x = wheelSideOffset;
        this.shapes.push(wheelRight);

    }
}

export class ExecutiveChair extends Chair {
    constructor(scene) {
        super(scene);
        let cushionWidth = 0.5;
        let cushionLength = cushionWidth;
        let thickness = cushionWidth*0.2;
        let strutWidth = thickness;
        let strutHeight = thickness * 0.5;
        let sideBarXLength = cushionWidth * 1.5;
        const sideBarX_geom = new THREE.BoxGeometry(sideBarXLength, strutHeight, strutWidth);
        const sideBarX = new THREE.Mesh(sideBarX_geom, metal_mat);
        sideBarX.position.y = -thickness;
        this.shapes.push(sideBarX);
        //left and right sidebars
        let sideBarYLength = cushionWidth*0.7;
        const sideBarY_geom = new THREE.BoxGeometry(strutHeight, sideBarYLength, strutWidth);
        //left
        const sideBarYL = new THREE.Mesh(sideBarY_geom, metal_mat);
        sideBarYL.position.x = -sideBarXLength/2;
        sideBarYL.position.y = thickness * 0.5;
        this.shapes.push(sideBarYL);
        //right
        const sideBarYR = new THREE.Mesh(sideBarY_geom, metal_mat);
        sideBarYR.position.x = sideBarXLength/2;
        sideBarYR.position.y = thickness * 0.5;
        this.shapes.push(sideBarYR);
        //Now the armrests
        const armRest_geom = new THREE.BoxGeometry(cushionWidth * 0.2, thickness*0.7, cushionLength*0.8);
        //left
        const armRestL = new THREE.Mesh(armRest_geom, blackFabric_mat);
        armRestL.position.x = -(sideBarXLength/2);
        armRestL.position.y = sideBarYLength * 0.6;
        this.shapes.push(armRestL);
        //right
        const armRestR = new THREE.Mesh(armRest_geom, blackFabric_mat);
        armRestR.position.x = (sideBarXLength/2);
        armRestR.position.y = sideBarYLength * 0.6;
        this.shapes.push(armRestR);

    }
}