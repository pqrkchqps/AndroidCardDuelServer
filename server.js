var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
	 socket.on("emittest", (examplestring) => {
			 console.log(examplestring);
	 });
});

var port = process.env.PORT || 9000;

http.listen(port, function() {
   console.log('listening on *:'+port);
});
