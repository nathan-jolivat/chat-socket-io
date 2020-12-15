const express = require('express')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var path = require('path');
var Autolinker = require('autolinker');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(username, msg, pic){
        if (msg.startsWith("http")) {
            msg = Autolinker.link(msg);
        }
        io.emit('chat message', username, msg, pic);
    });
});

io.on('connection', function(socket){
    socket.broadcast.emit('hi');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});