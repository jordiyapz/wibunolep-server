// Import
const app = require('./app');
const mqtt_client = require("./mqtt-client");

// EXPRESS DAN SOCKET IO
const server = require('http').createServer(app);
const io = require('socket.io').listen(server); // import package socket.io

const SERVERPORT = process.env.PORT || 7000;

// via HTTP connection
app.post('/data', (req, res) => {
	const dataObj = {
		dataHasil: req.body.data,
		dataMentah: req.body.mentah
	}
	io.emit('server-broadcast', dataObj);
})

io.on('connection' , (socket)=> {
	console.log('Client connected!');
	socket.on('data-mentah', (data) => {
		const dataHasil = rawdataParserV2(data);
		socket.broadcast.emit('server-broadcast', { dataHasil, dataMentah: data });
	})
	socket.on('disconnect' , ()=> {
		console.log('Client disconnected!');
	});
	mqtt_client.on('message', (topic, payload, packet) => {
		if (topic == '/AsCender/payload') {
			const data = payload.toString();
			const dataHasil = rawdataParserV2(data);
			// console.log(data);
			socket.broadcast.emit('server-broadcast', { dataHasil, dataMentah: data });
		}
	})
});

server.listen(SERVERPORT, () => {
    console.log('Server started on ', SERVERPORT);
});

/**
 *
 * @param {String} data
 * @returns
 *  [<latitude>, <longitude>, <humidity>, <temperature>, <acc_x>, <acc_x>, <acc_x>, <gyro_x>, <gyro_y>, <gyro_z>]
 */
function rawdataParserV2 (data) {
	const regex = /([0-9|\.|-]*)/g;
	let hasilParsing = [];
		data.match(regex).forEach(element => {
			if (element != '')
				hasilParsing.push(element);
		});
		return hasilParsing;
}