class Tride {
    constructor (elemId, acc, gyro) {
        this._tride = {
            scene : 0,
            camera : 0,
            renderer : 0,
            model : 0,
            line : 0
        }
        this._rot = { x: Math.PI, y: Math.PI, z: Math.PI };
        this._acc = acc;
        this._gyro = gyro;
        this._gForce = { x: 0, y:0, z:0 };
        this._gyroPast = { x: 0, y: 0, z: 0 };
        this._gyroCalli = { x: 0, y: 0, z: 0 };
        this._angle = { x: 0, y:0, z:0 };

        this._timePast = Date.now();
        this._timePresent = Date.now();

        this._inisialisasi3D(elemId, 470, 280, 25);
    }

    _inisialisasi3D(elemId, width, height, jarak) {
        this._tride.scene = new THREE.Scene();
        this._tride.camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
        this._tride.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this._tride.renderer.setSize(width, height);
        console.log(this._tride.renderer);
        document.getElementById(elemId).appendChild(this._tride.renderer.domElement);
        // var geometry = new THREE.TorusBufferGeometry( 10, 3, 16, 100 );
        var geometry = new THREE.CylinderGeometry( 15, 15, 1, 3 );
        var material = new THREE.MeshBasicMaterial( { color: 0x1080ff } );/*{ color: 0x00ff00 } */
        var wireframe = new THREE.WireframeGeometry( geometry );

        this._tride.line = new THREE.LineSegments( wireframe );
        this._tride.line.material.depthTest = false;
        this._tride.line.material.opacity = 0.25;
        this._tride.line.material.transparent = true;
        this._tride.scene.add( this._tride.line );

        this._tride.model = new THREE.Mesh( geometry, material );
        this._tride.scene.add( this._tride.model );

        this._tride.model.rotation.x = this._tride.line.rotation.x = Math.PI/2;
        this._tride.model.rotation.y = this._tride.line.rotation.y = Math.PI;
        this._tride.model.rotation.z = this._tride.line.rotation.z = Math.PI;
        this._tride.camera.position.z = jarak;

        doAnimation(this._tride);
    }


    rotateModel() {
        /**
            z
            ^
            |
            y - -> x
        */
        this._tride.model.rotation.x = this._tride.line.rotation.x = this._rot.x;
        this._tride.model.rotation.y = this._tride.line.rotation.y = this._rot.y;
        this._tride.model.rotation.z = this._tride.line.rotation.z = this._rot.z;
    }

    processAccelData() {
        this._gForce.x = this._acc.x/16384.0;
        this._gForce.y = this._acc.y/16384.0;
        this._gForce.z = this._acc.z/16384.0;
    }

    backupGyroData() {
        this._gyroPast.x = this._gyro.x;                                   // Assign Present gyro reaging to past gyro reading
        this._gyroPast.y = this._gyro.y;                                   // Assign Present gyro reaging to past gyro reading
        this._gyroPast.z = this._gyro.z;                                   // Assign Present gyro reaging to past gyro reading
        this._timePast = this._timePresent;                                     // Assign Present time to past time
        this._timePresent = Date.now();                                     // get the current time in milli seconds, it is the present time
    }

    processGyroData() {
        this._getAngularVelocity();                                       // get angular velocity
        this._calculateAngle();                                           // calculate the angle
    }

    _getAngularVelocity() {
        this._rot.x = this._gyro.x / 131.0;
        this._rot.y = this._gyro.y / 131.0;
        this._rot.z = this._gyro.z / 131.0;
    }

    _calculateAngle() {
        // same equation can be written as
        // angelZ = angelZ + ((timePresentZ - timePastZ)*(gyroZPresent + gyroZPast - 2*gyroZCalli)) / (2*1000*131);
        // 1/(1000*2*131) = 0.00000382
        // 1000 --> convert milli seconds into seconds
        // 2 --> comes when calculation area of trapezium
        // substacted the callibated result two times because there are two gyro readings
        const delta = this._timePresent - this._timePast;
        this._angle.x += (delta * (this._gyro.x + this._gyroPast.x - 2 * this._gyroCalli.x)) * 0.00000382;
        this._angle.y += (delta * (this._gyro.y + this._gyroPast.y - 2 * this._gyroCalli.y)) * 0.00000382;
        this._angle.z += (delta * (this._gyro.z + this._gyroPast.z - 2 * this._gyroCalli.z)) * 0.00000382;
    }

    _callibrateGyroValues() {
        for (let i = 0; i<5000; i++) {
            this._getGyroValues();
            this._gyroCalli.x += this._gyro.x;
            this._gyroCalli.y += this._gyro.y;
            this._gyroCalli.z += this._gyro.z;
        }
        this._gyroCalli.x /= 5000;
        this._gyroCalli.y /= 5000;
        this._gyroCalli.z /= 5000;
    }
}

function doAnimation (tride) {
    let animate = () => {
        requestAnimationFrame( animate );
        tride.renderer.render( tride.scene, tride.camera );
    }
    animate();
}

