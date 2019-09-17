// Import
const app = require('./app');
const mqtt_client = require("./mqtt-client");
const CommHandler = require('./handler/CommHandler');


// SERVER DAN SOCKET IO
const server = require('http').createServer(app);
const io = require('socket.io').listen(server); // import package socket.io

const SERVERPORT = process.env.PORT || 7000;

// const dh = new DataHandler();
new CommHandler(io);

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