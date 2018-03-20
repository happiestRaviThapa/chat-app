var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

server.listen(7080, '192.168.56.1');

app.use(express.static("public"));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/view/index.html');
});

var userList = [];

io.on('connection',  (socket) => {
  console.log(socket.handshake.query.name+"  usr name");

  userList.push( {id: socket.id, name: socket.handshake.query.name} );
  socket.emit('success', { success: true });
  
  io.sockets.emit('newUserJoin',   userList );

  socket.on("disconnect", (reason) => {
    console.log('disconnect  '+ socket.id);
    var i = userList.indexOf(socket.id);
    userList.splice(i, 1);
  });

  socket.on('sendMsg', (val) => {
    var bindMsg = socket.handshake.query.name + " : " + val;
    io.sockets.emit('sendMsg',   bindMsg );
  });

});