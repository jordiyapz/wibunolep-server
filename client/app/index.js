
const dom = {
    // [head, alt, lat, lon, roll, pitch, yaw, heading, airspeed, groundspeed, mode, armed]
    altitude: document.getElementById('altitude'),
    latitude: document.getElementById('latitude'),
    longitude: document.getElementById('longitude'),
    roll: document.getElementById('roll'),
    pitch: document.getElementById('pitch'),
    yaw: document.getElementById('yaw'),
    heading: document.getElementById('heading'),
    airspeed: document.getElementById('airspeed'),
    groundspeed: document.getElementById('groundspeed'),
    mode: document.getElementById('mode'),
    armed: document.getElementById('armed')
}

// const acc = { x: 0, y: 0, z: 0 };
// const gyro = { x: 0, y: 0, z: 0 };

let chart = {
    ready : false,
    alt: null,
    as: null,
    gs: null
}

const socket = io.connect();
const tride = new Tride('tride-model', 470, 280, 25); // {id, width, height, jarak}

const gaugeGround = new RadialGauge({
    renderTo: 'gaugeGround',
    width: 200,
    height: 200,
    units: "m/s",
    minValue: 0,
    maxValue: 100,
    majorTicks: [
        "0",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 90,
            "to": 100,
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

const gaugeAir = new RadialGauge({
    renderTo: 'gaugeAir',
    width: 200,
    height: 200,
    units: "m/s",
    minValue: 0,
    maxValue: 100,
    majorTicks: [
        "0",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 90,
            "to": 100,
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

const gaugeal = new LinearGauge({
    renderTo: 'gaugeal',
    width: 150,
    height: 405,
    units: "m",
    minValue: 0,
    maxValue: 100,
    majorTicks: [
        "0",
        "5",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 90,
            "to": 100,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    animationDuration: 1000,
    animationRule: "linear",
    tickSide: "left",
    numberSide: "left",
    needleSide: "left",
    barStrokeWidth: 7,
    barBeginCircle: false,
}).draw();

var rota = 0;

function onload() {

    // Add EventListener socket.io sehingga setiap ada 'server-broadcast' yang masuk, callback dipanggil

    socket.on('server-broadcast', data => {
        // data terdiri atas clean, raw, series
        const dataHasil = data.clean;
        const dataMentah = data.raw;
        // console.log (data);
        let i = 1;
        // untuk setiap kunci-elemen di dom
        for (let key in dom) {
            if (key == 'mode' || key == 'armed') {
                // update elemen dom 'raw_data' dengan nilai dataMentah
                dom[key].textContent = dataHasil[i];
            } else {
                // ubah semua dataHasil (tipe string) menjadi tipe float
                dataHasil[i] = parseFloat(dataHasil[i]);
            }
            // update elemen dom di html
            dom[key].textContent = dataHasil[i];
            i++;
        }

        /**  dataHasil berupa array:
          *   [head, alt, lat, lon, roll, pitch, yaw, heading, airspeed, groundspeed, mode, armed]
          */
        coord.lintang = dataHasil[2];
        coord.bujur = dataHasil[3];

        gaugeAir.value = dataHasil[8];
        gaugeal.value = dataHasil[1];
        gaugeGround.value = dataHasil[9];

        // update chart
        if (chart.ready) {
            const {series} = data
            // console.log(series.acc_x);
            chart.alt.update(series.alt);
            chart.as.update(series.as);
            chart.gs.update(series.gs);
        }

        // tride.rotateModel(dataHasil[5], dataHasil[4], dataHasil[6]);
        let roll = dataHasil[4];
        let pitch = dataHasil[5];
        let yaw = dataHasil[6];
        tride.rotateModel(pitch, roll, yaw);
        rota += .1;

        if (map)
            map.update(coord);
    })

    // setting Highchart
    Highcharts.setOptions({ global: { useUTC: false } });
    chart.alt = new Hchart ('grafik-alt', 'Grafik Altitude', 'Percepatan (m)', 'Altitude');
    chart.as = new Hchart ('grafik-as', 'Grafik Air Speed', 'Percepatan (m/s)', 'Air Speed');
    chart.gs = new Hchart ('grafik-gs', 'Grafik Ground Speed', 'Percepatan (m/s)', 'Ground Speed');
    chart.ready = true;
}

onload();