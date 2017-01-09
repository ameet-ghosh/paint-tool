var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
var users=[];
io.on('connection', function(socket){
  console.log('A user connected');
  socket.on('drawing', function(data){
   console.log(data);
    io.sockets.emit('drawing', data);
  });
//   socket.on('addColor', function(data){
//    console.log(data);
//     io.sockets.emit('addColor', data);
//   })
//   socket.on('user', function(data){
//    console.log(data);
//      if(users.indexOf(data) > -1){
//       users.push(data);
//       socket.emit('userSet', {username: data});
//     }
//     else{
//       socket.emit('userExists', data + ' username is taken! Try some other username.');
//     }

//   })
});
http.listen(3000, function(){
  console.log('listening on localhost:3000');
});