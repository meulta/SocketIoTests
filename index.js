var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// === Socket IO (could be on a separate process, don't need Express)

io.on('connection', (socket) => {
    //When a new client connect, we setup listeners for disconnection, incomming event, etc).
    console.log('a user connected');

    //Sending to a specific client (the one who just connected in that case)
    //Socket client id is what we need to save to send to the client directly later
    io.to(socket.client.id).emit("chat message", "Welcome!");

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);

        //Broadcasting to all client (including sender)
        io.emit('chat message', msg);
    });
});

// === Express, just to serve the chat page.
app.get('/', (req, res) => {
    //Serving the html file
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    //Web server started
    console.log('listening on *:3000');
});