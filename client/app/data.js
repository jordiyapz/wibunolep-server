var tride = {
	scene:0,
	camera:0,
	renderer:0,
	model:0,
	line:0
}
inisialisasi3D(470, 280, 25);

var latitude = 0;
var longitude = 0;
var temperature = 0;
var humidity = 0;
var acc = {
	x: 0, y: 0, z: 0
};
var gyro = {
	x: 0, y: 0, z: 0
};
var gyroPast = {
	x: 0, y: 0, z: 0
};
var gyroCalli = {
	x: 0, y: 0, z: 0
};
var gForce = {
	x: 0, y:0, z:0
}
var angle = {
	x: 0, y:0, z:0
}

var timePast, timePresent = Date.now();


var rot = {
	x: Math.PI,
	y: Math.PI,
	z: Math.PI
}

const labAPTRG = {
	lintang: -6.976508,
	bujur: 107.630290
}
const Bandung = {
	lintang 	: -6.9147439 , //Bandung
	bujur 		: 107.609809875, //Bandung
}
var param = {
	lintang: labAPTRG.lintang,
	bujur: labAPTRG.bujur,
	setLintang : function(data){
		this.lintang = parseFloat(data);
	},
	setBujur : function(data){
		this.bujur = parseFloat(data);
	},
	getLintang : function(){
		return this.lintang;
	},
	getBujur : function(){
		return this.bujur  ;
	}
};

var lineCoordinatesArray = [];

var gaugetemp = new LinearGauge({
    renderTo: 'gaugeTemp',
    width: 100,
    height: 300,
    units: "°C",
    minValue: 0,
    startAngle: 90,
    ticksAngle: 180,
    valueBox: false,
    maxValue: 220,
    majorTicks: [
        "0",
        "20",
        "40",
        "60",
        "80",
        "100",
        "120",
        "140",
        "160",
        "180",
        "200",
        "220"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 100,
            "to": 220,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear",
    barWidth: 10,
    value: 35
}).draw();

var gauge = new RadialGauge({
    renderTo: 'gaugeHumid',
    width: 200,
    height: 200,
    units: "%",
    minValue: 0,
    maxValue: 220,
    majorTicks: [
        "0",
        "20",
        "40",
        "60",
        "80",
        "100",
        "120",
        "140",
        "160",
        "180",
        "200",
        "220"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 160,
            "to": 220,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
}).draw();

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

setInterval(() => {

}, 200);

function update(){
	const socket = io.connect();

	socket.on('server-broadcast', (data)=>{
		// [<latitude>, <longitude>, <humidity>, <temperature>, <acc_x>, <acc_x>, <acc_x>, <gyro_x>, <gyro_y>, <gyro_z>]
		const dataHasil = data.dataHasil;
		// console.log(data.dataHasil);

		latitude = parseFloat(dataHasil[0]);
		longitude = parseFloat(dataHasil[1]);
		humidity = (dataHasil[2] == '-999.00')? humidity : parseFloat(dataHasil[2]);
		temperature = (dataHasil[3] == '-999.00')? temperature : parseFloat(dataHasil[3]);
		acc.x = parseFloat(dataHasil[4]);
		acc.y = parseFloat(dataHasil[5]);
		acc.z = parseFloat(dataHasil[6]);

		readAndProcessGyroData();

		gyro.x = parseFloat(dataHasil[7]);
		gyro.y = parseFloat(dataHasil[8]);
		gyro.z = parseFloat(dataHasil[9]);

		processAccelData();
		rotateModel();

		param.lintang = latitude;
		param.bujur = longitude;

		gauge.value = humidity;
		gaugetemp.value = temperature;

		$('#Latitude').html(latitude);
		$('#Longitude').html(longitude);
		$('#Humidity').html(humidity);
		$('#Temperature').html(temperature);
		$('#Acc_x').html(acc.x);
		$('#Acc_y').html(acc.y);
		$('#Acc_z').html(acc.z);
		$('#Gyro_x').html(gyro.x);
		$('#Gyro_y').html(gyro.y);
		$('#Gyro_z').html(gyro.z);
		$('#rawData').html(data.dataMentah)

		 //redraw maps
		redraw(param.getLintang(), param.getBujur());
	});
}

// Grafik
$(function() {
	Highcharts.setOptions({
		global: {
				useUTC: false
		}
	});

	/** Acc x */
	Highcharts.chart('grafik-acc-x', {
		chart: {
			type: 'spline',
			animation: Highcharts.svg, // don't animate in old IE
			marginRight: 10,
			events: {
				load: function () {
				// set up the updating of the chart each second
					var series = this.series[0];
					setInterval(function () {
							var x = (new Date()).getTime(), // current time
									y = acc.x;
							series.addPoint([x, y], true, true);
					}, 1000);
				}
			}
		},
		title: {
			text: 'Grafik Acc X'
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 150
		},
		yAxis: {
			title: {
				text: 'm/s^2'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function () {
				return '<b>' + this.series.name + '</b><br/>' +
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
					Highcharts.numberFormat(this.y, 2);
			}
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: 'Acc data',
			data: (function () {
				// generate an array of random data
				var data = [],
					time = (new Date()).getTime(),
					i;

				for (i = -19; i <= 0; i += 1) {
					data.push({
						x: time + i * 1000,
						y: acc.x
					});
				}
				return data;
			}())
		}]
	});

	/** Acc y */
	Highcharts.chart('grafik-acc-y', {
		chart: {
			type: 'spline',
			animation: Highcharts.svg, // don't animate in old IE
			marginRight: 10,
			events: {
				load: function () {
				// set up the updating of the chart each second
					var series = this.series[0];
					setInterval(function () {
							var x = (new Date()).getTime(), // current time
									y = acc.y;
							series.addPoint([x, y], true, true);
					}, 1000);
				}
			}
		},
		title: {
			text: 'Grafik Acc Y'
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 150
		},
		yAxis: {
			title: {
				text: 'm/s^2'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function () {
				return '<b>' + this.series.name + '</b><br/>' +
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
					Highcharts.numberFormat(this.y, 2);
			}
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: 'Acc data',
			data: (function () {
				// generate an array of random data
				var data = [],
					time = (new Date()).getTime(),
					i;

				for (i = -19; i <= 0; i += 1) {
					data.push({
						x: time + i * 1000,
						y: acc.y
					});
				}
				return data;
			}())
		}]
	});

	/** Gyro z */
	// drawChart(Highcharts, 'grafik-gyro-z', acc.z, 'Grafik Acc z', 'm/s^2', 'Gyro Data');
	// /*
	Highcharts.chart('grafik-acc-z', {
		chart: {
			type: 'spline',
			animation: Highcharts.svg, // don't animate in old IE
			marginRight: 10,
			events: {
				load: function () {
				// set up the updating of the chart each second
					var series = this.series[0];
					setInterval(function () {
							var x = (new Date()).getTime(), // current time
									y = acc.z;
							series.addPoint([x, y], true, true);
					}, 1000);
				}
			}
		},
		title: {
			text: 'Grafik Acc Z'
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 150
		},
		yAxis: {
			title: {
				text: 'm/s^2'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function () {
				return '<b>' + this.series.name + '</b><br/>' +
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
					Highcharts.numberFormat(this.y, 2);
			}
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: 'Acc data',
			data: (function () {
				// generate an array of random data
				var data = [],
					time = (new Date()).getTime(),
					i;

				for (i = -19; i <= 0; i += 1) {
					data.push({
						x: time + i * 1000,
						y: acc.z
					});
				}
				return data;
			}())
		}]
	});
	// */

	/** Altitude */
	Highcharts.chart('grafikAltitude', {
		chart: {
			type: 'spline',
			animation: Highcharts.svg, // don't animate in old IE
			marginRight: 10,
			events: {
				load: function () {
				// set up the updating of the chart each second
					var series = this.series[0];
					setInterval(function () {
							var x = (new Date()).getTime(), // current time
									y = acc.x;
							series.addPoint([x, y], true, true);
					}, 1000);
				}
			}
		},
		title: {
			text: 'Grafik Altitude'
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 150
		},
		yAxis: {
			title: {
				text: 'm/s^2'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function () {
				return '<b>' + this.series.name + '</b><br/>' +
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
					Highcharts.numberFormat(this.y, 2);
			}
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: 'Altitude data',
			data: (function () {
				// generate an array of random data
				var data = [],
					time = (new Date()).getTime(),
					i;

				for (i = -19; i <= 0; i += 1) {
					data.push({
						x: time + i * 1000,
						y: acc.x
					});
				}
				return data;
			}())
		}]
	});
}); // end jquery


function initMap() {
	// Make map
	map = new google.maps.Map(document.getElementById('map'), {
	zoom: 17,
	center: {lat: param.getLintang(), lng : param.getBujur(), alt : 0}
	});

	//make marker
	map_marker = new google.maps.Marker({
		position: {
			lat: param.getLintang(),
			lng: param.getBujur()
		},
		icon: {
			url: "../icon/icon-drone-micro-red.png",
			anchor: new google.maps.Point(24, 24)
		},
		map: map
	});
	map_marker.setMap(map);

}
function redraw(Lintang, Bujur) {
	map.setCenter({lat: Lintang, lng : Bujur, alt: 0}); // biar map ketengah
	map_marker.setPosition({lat: Lintang, lng : Bujur, alt: 0}); // biar map ketengah

	pushCoordToArray(Lintang, Bujur); //masukin nilai lintan dan bujur ke array coordinates

	var lineCoordinatesPath = new google.maps.Polyline({
		path: lineCoordinatesArray,
		geodesic: true,
		strokeColor: '#ffeb3b',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});

	lineCoordinatesPath.setMap(map);
}
function pushCoordToArray(latIn, lngIn) {
	lineCoordinatesArray.push(new google.maps.LatLng(latIn, lngIn));
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

function drawChart(Highcharts, domId, inputData, title, unit, seriesName) {
	Highcharts.chart(domId, {
		chart: {
			type: 'spline',
			animation: Highcharts.svg, // don't animate in old IE
			marginRight: 10,
			events: {
				load: function () {
				// set up the updating of the chart each second
					var series = this.series[0];
					setInterval(function () {
							var x = (new Date()).getTime(), // current time
									y = inputData;
							series.addPoint([x, y], true, true);
					}, 1000);
				}
			}
		},
		title: {
			text: title
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 150
		},
		yAxis: {
			title: {
				text: unit
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function () {
				return '<b>' + this.series.name + '</b><br/>' +
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
					Highcharts.numberFormat(this.y, 2);
			}
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: seriesName,
			data: (function () {
				// generate an array of random data
				var data = [],
					time = (new Date()).getTime(),
					i;

				for (i = -19; i <= 0; i += 1) {
					data.push({
						x: time + i * 1000,
						y: inputData
					});
				}
				return data;
			}())
		}]
	});
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