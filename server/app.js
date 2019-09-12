const express = require('express'); // import package express
const app = express();

// Middleware milik si express.js
const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));

app.get('/', (req, res) => { //route '/'
	res.sendFile(path.resolve(clientPath, 'index.html'));
})


module.exports = app;