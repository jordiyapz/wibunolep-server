// EXPRESS DAN SOCKET IO
const express = require('express'); // import package express
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server); // import package socket.io
const path = require('path'); // import package path (sudah default ada)

const SERVERPORT = process.env.PORT || 7000;

// Middleware milik si express.js
const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));

app.get('/', (req, res) => { //route '/'
	res.sendFile(path.resolve(clientPath, 'index.html'));
})

app.post('/data', (req, res) => {
	const dataObj = {
		dataHasil: req.body.data,
		dataMentah: req.body.mentah
	}
	io.emit('server-broadcast', dataObj);
})

io.on('connection' , (socket)=> {
	console.log('Client connected!');
	socket.on('echo', (data) => {
		socket.broadcast.emit('server-broadcast', data);
	})
	socket.on('data-mentah', (data) => {
		const dataHasil = rawdataParserV2(data);
		socket.broadcast.emit('server-broadcast', { dataHasil, dataMentah: data });
	})
	socket.on('disconnect' , ()=> {
		console.log('Client disconnected!');
	});
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