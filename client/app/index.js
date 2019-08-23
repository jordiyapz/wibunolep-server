const labAPTRG = {
	lintang: -6.976508,
	bujur: 107.630290
}
const Bandung = {
	lintang 	: -6.9147439 , //Bandung
	bujur 		: 107.609809875, //Bandung
}
const dom = {
    latitude: document.getElementById('latitude'),
    longitude: document.getElementById('longitude'),
    humidity: document.getElementById('humidity'),
    temperature: document.getElementById('temperature'),
    acc_x: document.getElementById('acc_x'),
    acc_y: document.getElementById('acc_y'),
    acc_z: document.getElementById('acc_z'),
    gyro_x: document.getElementById('gyro_x'),
    gyro_y: document.getElementById('gyro_y'),
    gyro_z: document.getElementById('gyro_z'),
    raw_data: document.getElementById('raw_data')
}

const coord = { lintang: labAPTRG.lintang, bujur: labAPTRG.bujur };
const acc = { x: 0, y: 0, z: 0 };
const gyro = { x: 0, y: 0, z: 0 };

let chart = {
    ready : false,
    acc : { x: null, y: null, z: null },
    temp : null
}

const socket = io.connect();
const map = new Gmap('map', coord); //pass by ref {coord}
const tride = new Tride('tride-model', acc, gyro); //pass by ref {acc, gyro}

const gaugeTemp = new LinearGauge({
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
const gaugeHumid = new RadialGauge({
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

function update() {
    socket.on('server-broadcast', data => {
        // data terdiri atas dataHasil dan dataMentah
        const {dataHasil, dataMentah} = data;

        let i = 0;
        // untuk setiap kunci-elemen di dom
        for (let key in dom) {
            if (key == 'raw_data')
                // update elemen dom 'raw_data' dengan nilai dataMentah
                dom[key].textContent = dataMentah;
            else {
                // ubah semua dataHasil (tipe string) menjadi tipe float
                dataHasil[i] = parseFloat(dataHasil[i]);
                // update elemen dom di html
                    dom[key].textContent = dataHasil[i];
                i++;
            }
        }

        // dataHasil berupa array
        // [latitude,longitude,humidity,temperature,acc_x,acc_y,acc_z,gyro_x,gyro_y,gyro_z,raw_data]
        coord.x = dataHasil[0];
        coord.y = dataHasil[1];

        gaugeHumid.value = dataHasil[2];
        gaugeTemp.value = dataHasil[3];

        acc.x = dataHasil[4];
        acc.y = dataHasil[5];
        acc.z = dataHasil[6];

        // update chart
        if (chart.ready) {
            chart.temp.update(gaugeTemp.value);
            chart.acc.x.update(acc.x);
            chart.acc.y.update(acc.y);
            chart.acc.z.update(acc.z);
        }

        tride.backupGyroData(); //backup sebelum diupdate

        gyro.x = dataHasil[7];
        gyro.y = dataHasil[8];
        gyro.z = dataHasil[9];

        tride.rotateModel();
        tride.processAccelData();
        tride.processGyroData();

        map.update(coord);
    })
}

$(() => {
    // setting Highchart
    Highcharts.setOptions({ global: { useUTC: false } });
    chart.acc.x = new Hchart ('grafik-acc-x', 'Grafik Acc.x', 'Percepatan (m/s^2)', 'acc.x');
    chart.acc.y = new Hchart ('grafik-acc-y', 'Grafik Acc.y', 'Percepatan (m/s^2)', 'acc.y');
    chart.acc.z = new Hchart ('grafik-acc-z', 'Grafik Acc.z', 'Percepatan (m/s^2)', 'acc.z');
    chart.temp = new Hchart ('grafik-temperatur', 'Grafik Temperatur', 'Suhu (celcius)', 'temp');
    chart.ready = true;
})