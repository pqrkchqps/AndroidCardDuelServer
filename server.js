var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernames =  [];

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   //console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
     var username = connections[socket.connection.remoteAddress];
     console.log('User '+ username ? username : "" +'disconnected');
     delete connections[socket.connection.remoteAddress];
     delete usernames[username];
     console.log(usernames);
     console.log(connections)
    });
	 socket.on("send_username", (usernamejson) => {
			 console.log(usernamejson);
       console.log(usernames);
       var username = JSON.parse(usernamejson).name;
       if (usernames[username]){
         socket.emit("verify_username", "User Name Taken");
       } else {
         usernames[username] = socket.connection.remoteAddress;
         connections[socket.connection.remoteAddress] = username;
         socket.emit("verify_username", "User Name Added");
       }
	 });
   socket.on("send_exit", (usernamejson) => {
			 console.log(usernamejson);
       var username = JSON.parse(usernamejson).name;
       delete usernames[username];
       delete connections[socket.connection.remoteAddress];
       console.log(usernames);
       console.log(connections)
	 });
});

var port = process.env.PORT || 9000;

http.listen(port, function() {
   console.log('listening on *:'+port);
});
