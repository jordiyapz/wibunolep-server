const dh = require('./DataHandler');
const mqtt_client = require('../mqtt-client');

class CommHandler {

    constructor(io, option) {
        this.transport = 'mqtt';
        this.mode = 'realtime'; // 'interval', 'realtime'
        if (option) {
            if (option.transport) this.transport = option.transport;
            if (option.mode) this.mode = option.mode;
        }

        if (this.mode == 'realtime') {
            mqtt_client.on('message', (topic, payload, packet) => {
                if (topic == '/AsCender/payload') {
                    const raw = payload.toString();
                    dh.update(raw);
                    io.emit('server-broadcast', dh.getpack());
                }
            })
        }

        io.on('connection', (socket) => {
            console.log('Client connected!');
        })
    }

}

module.exports = CommHandler;