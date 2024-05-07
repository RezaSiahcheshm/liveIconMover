const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/views/index.html');
});
const icons = {};

io.on('connection', (socket) => {
    socket.on('iconData', (iconData) => {
        icons[iconData.id] = iconData;
        // console.log(icons)
        io.emit('iconData', iconData);
    });

    socket.on('addIcon', () => {
        const id = generateUniqueId();
        icons[id] = { id: id };
        io.emit('addIcon', icons[id]);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

server.listen(3000, () => {
    console.log('Server running on port 3000');
});