const tride = {
	scene:0,
	camera:0,
	renderer:0,
	model:0,
	line:0
}

inisialisasi3D(470, 280, 25);

var rot = {
	x: Math.PI,
	y: Math.PI,
	z: Math.PI
}

rotateModel();

function rotateModel() {
	/**

		z
		^
		|
		y - -> x

	*/
	tride.model.rotation.x = tride.line.rotation.x = rot.x;
	tride.model.rotation.y = tride.line.rotation.y = rot.y;
	tride.model.rotation.z = tride.line.rotation.z = rot.z;
}
function inisialisasi3D(width, height, jarak = 50) {
	tride.scene = new THREE.Scene();
	tride.camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
	tride.renderer = new THREE.WebGLRenderer( { antialias: true } );
	tride.renderer.setSize( width, height);

	// document.body.appendChild( tride.renderer.domElement );
	// $( tride.renderer.domElement ).append( '#tride-model' );
	document.getElementById('tride-model').appendChild(tride.renderer.domElement);
	// var geometry = new THREE.TorusBufferGeometry( 10, 3, 16, 100 );
	var geometry = new THREE.CylinderGeometry( 15, 15, 1, 3 );
	var material = new THREE.MeshBasicMaterial( { color: 0x1080ff } );/*{ color: 0x00ff00 } */
	var wireframe = new THREE.WireframeGeometry( geometry );

	tride.line = new THREE.LineSegments( wireframe );
	tride.line.material.depthTest = false;
	tride.line.material.opacity = 0.25;
	tride.line.material.transparent = true;
	tride.scene.add( tride.line );

	tride.model = new THREE.Mesh( geometry, material );
	tride.scene.add( tride.model );

	tride.model.rotation.x = tride.line.rotation.x = Math.PI/2;
	tride.model.rotation.y = tride.line.rotation.y = Math.PI;
	tride.model.rotation.z = tride.line.rotation.z = Math.PI;
	tride.camera.position.z = jarak;

	var animate = function () {
		requestAnimationFrame( animate );
		tride.renderer.render( tride.scene, tride.camera );
	};

	animate();
}

function processAccelData() {
    gForce.x = acc.x/16384.0;
    gForce.y = acc.y/16384.0;
    gForce.z = acc.z/16384.0;
  }

function readAndProcessGyroData() {
    gyroPast.x = gyro.x;                                   // Assign Present gyro reaging to past gyro reading
    gyroPast.y = gyro.y;                                   // Assign Present gyro reaging to past gyro reading
    gyroPast.z = gyro.z;                                   // Assign Present gyro reaging to past gyro reading
    timePast = timePresent;                                     // Assign Present time to past time
    timePresent = Date.now();                                     // get the current time in milli seconds, it is the present time

    // getGyroValues();                                            // get gyro readings
    getAngularVelocity();                                       // get angular velocity
    calculateAngle();                                           // calculate the angle
}

function getAngularVelocity() {
    rot.x = gyro.x / 131.0;
    rot.y = gyro.y / 131.0;
    rot.z = gyro.z / 131.0;
}

function calculateAngle() {
    // same equation can be written as
    // angelZ = angelZ + ((timePresentZ - timePastZ)*(gyroZPresent + gyroZPast - 2*gyroZCalli)) / (2*1000*131);
    // 1/(1000*2*131) = 0.00000382
    // 1000 --> convert milli seconds into seconds
    // 2 --> comes when calculation area of trapezium
    // substacted the callibated result two times because there are two gyro readings
    angle.x += ((timePresent - timePast) * (gyro.x + gyroPast.x - 2 * gyroCalli.x)) * 0.00000382;
    angle.y += ((timePresent - timePast) * (gyro.y + gyroPast.y - 2 * gyroCalli.y)) * 0.00000382;
    angle.z += ((timePresent - timePast) * (gyro.z + gyroPast.z - 2 * gyroCalli.z)) * 0.00000382;
}

function callibrateGyroValues() {
	for (let i=0; i<5000; i++) {
		getGyroValues();
		gyroCalli.x += gyro.x;
		gyroCalli.y += gyro.y;
		gyroCalli.z += gyro.z;
	}
	gyroCalli.x /= 5000;
	gyroCalli.y /= 5000;
	gyroCalli.z /= 5000;
}