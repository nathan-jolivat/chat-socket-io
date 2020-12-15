const express = require('express')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var Autolinker = require('autolinker');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'basic_msg_app'
});
connection.connect(function(err) {
   if (err) {
       console.error('❌ Connection error with database : ' + err.stack);
   } else {
       console.log('✅ Connected to database');
   }
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/');
            } else {
                response.send("Nom d'utilisateur et/ou mot de passe incorrect(s)");
            }
            response.end();
        });
    } else {
        response.send("Veuillez renseigner un nom d'utilisateur et un mot de passe");
        response.end();
    }
});


app.use(express.static('public'));

app.get('/', function(req, res) {
    if (req.session.loggedin) {
        //res.send('Welcome back, ' + req.session.username + '!');
        res.sendFile(__dirname + '/index.html', { data : req.session.username });
    } else {
        res.sendFile(__dirname + '/not-allowed.html');
    }
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