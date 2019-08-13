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

// Grafik using jQuery onLoad callback
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
				var data = [];
				let time = (new Date()).getTime();

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
