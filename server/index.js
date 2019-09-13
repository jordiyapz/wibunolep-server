// Import
const app = require('./app');
const mqtt_client = require("./mqtt-client");

// SERVER DAN SOCKET IO
const server = require('http').createServer(app);
const io = require('socket.io').listen(server); // import package socket.io

const SERVERPORT = process.env.PORT || 7000;

class CommHandler {

    constructor(option) {
        this.transport = 'mqtt';
        this.mode = 'realtime'; // 'interval', 'realtime'
        if (option) {
            if (option.transport) this.transport = option.transport;
            if (option.mode) this.mode = option.mode;
        }

        if (this.mode == 'realtime') {
            // mqtt_client.on('message', (topic, payload, packet) => {
            //     console.log('onMessage');
            //     if (topic == '/AsCender/payload') {
            //         const raw = payload.toString();
            //         dh.update(raw);
            //         io.emit('server-broadcast', dh.getpack());
            //     }
            // })
        }

        io.on('connection', (socket) => {
            console.log('Client connected!');
        })
    }

}

class DataHandler {
    constructor() {
        this._dataTable = {
            length: 10,
            lastData: {
                raw: null,
                clean: null
            },
            history: []
        }

        this._chartSeries = {
            length: 10,
            acc_x: [],
            acc_y: [],
            acc_z: []
        }
    }

    get() {
        return this._dataTable;
    }

    getpack() {
        const lastData = this._dataTable.lastData;
        return {
            clean: lastData.clean,
            raw: lastData.raw,
            series: this._chartSeries
        }
    }

    update(new_data) {
        // [<header>, <latitude>, <longitude>, <humidity>, <temperature>, <acc_x>, <acc_x>, <acc_x>, <gyro_x>, <gyro_y>, <gyro_z>]
        const clean = this._parser(new_data);
        const lastData = this._dataTable.lastData;
        lastData = {clean, raw: new_data};
        // Process chart data
        const series = this._chartSeries;
        this.seriesProcess(series.acc_x, clean[5]);
        this.seriesProcess(series.acc_y, clean[6]);
        this.seriesProcess(series.acc_z, clean[7]);
    }

    seriesProcess(table, data) {
        const currentTime = (new Date()).getTime();
        if (table.length >= this._chartSeries.length) {
            table.shift();
            table.push({
                x: currentTime,
                y: data
            })
        }
    }

    /**
     *
     * @param {String} data
     * @returns
     *  [<header>, <latitude>, <longitude>, <humidity>, <temperature>, <acc_x>, <acc_x>, <acc_x>, <gyro_x>, <gyro_y>, <gyro_z>]
     */
    _parser(data) {
        if (typeof(data) == String) {
            const regex = /([0-9|\.|-]*)/g;
            let hasilParsing = [];
            data.match(regex).forEach(element => {
                if (element != '')
                    hasilParsing.push(element);
            });
            return hasilParsing;
        }
        return data;
    }
}

const dh = new DataHandler();
new CommHandler();

/**Communication Mode
 *  Describe the communication method
 *  via HTTP post
 *  via Socket.io
 *  via mqtt
 *
 *  Saves data
*/

server.listen(SERVERPORT, () => {
    console.log('Server started on ', SERVERPORT);
});