var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernames =  [];
var connections = [];

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   //console.log('A user connected');

   var myInterval = setInterval(function () {
     socket.emit("ping", "ping");
   }, 3000);

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
     var username = connections[socket.request.connection.remoteAddress];
     console.log('User '+ username ? username : "" +'disconnected');
     delete connections[socket.request.connection.remoteAddress];
     delete usernames[username];
     console.log(usernames);
     console.log(connections);
    });
	 socket.on("send_username", (usernamejson) => {
			 console.log(usernamejson);
       var username = JSON.parse(usernamejson).name;
       if (usernames[username]){
         socket.emit("verify_username", "User Name Taken");
       } else {
         var old_username = connections[socket.request.connection.remoteAddress]
         if (old_username){
           delete usernames[old_username];
         }
         usernames[username] = socket.request.connection.remoteAddress;
         connections[socket.request.connection.remoteAddress] = username;
         socket.emit("verify_username", "User Name Added");
       }
       console.log(usernames);
       console.log(connections);
	 });
   socket.on("send_exit", (usernamejson) => {
			 console.log(usernamejson);
       var username = JSON.parse(usernamejson).name;
       delete usernames[username];
       delete connections[socket.request.connection.remoteAddress];
       console.log(usernames);
       console.log(connections);
	 });
});

var port = process.env.PORT || 9000;

http.listen(port, function() {
   console.log('listening on *:'+port);
});
