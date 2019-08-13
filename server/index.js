// EXPRESS DAN SOCKET IO
const express = require('express'); // import package express
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server); // import package socket.io
const path = require('path'); // import package path (sudah default ada)

const SERVERPORT = 7000;

// Middleware milik si express.js
const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));

app.get('/', (req, res) => { //route '/'
	res.sendFile(path.resolve(clientPath, 'index.html'));
})

io.on('connection' , (socket)=> {
	console.log('Client connected!');
	socket.on('disconnect' , ()=> {
		console.log('Client disconnected!');
	});
});

server.listen(SERVERPORT, () => {
    console.log('Server started on ', SERVERPORT);
});