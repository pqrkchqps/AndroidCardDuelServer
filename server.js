var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernames =  [];

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
	 socket.on("emittest", (usernamejson) => {
			 console.log(usernamejson);
       var username = JSON.parse(usernamejson).name;
       if (usernames.includes(username)){
         socket.emit("Username Taken");
       } else {
         usernames[username] = true;
         socket.emit("Username Added");
       }
	 });
});

var port = process.env.PORT || 9000;

http.listen(port, function() {
   console.log('listening on *:'+port);
});
