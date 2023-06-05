
import * as THREE from 'three';

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


export class Desk extends Prefab {
    constructor(scene) {
        super(scene);
        //radiusTop, radiusBottom, height, radialSegments
        const joint_geom = new THREE.CylinderGeometry( 1, 1, 2, );
        const jointL1 = new THREE.Mesh(joint_geom, white_mat);
        this.shapes.push(jointL1);
    }
}