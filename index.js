var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var UUID = require('node-uuid');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get( '/*' , function( req, res, next ) {
    //This is the current file they have requested
    var file = req.params[0]; 

    //For debugging, we can track what files are requested.
    console.log('\t ::Express:: file requested : ' + file);

    //Send the requesting client the file.
    res.sendfile( __dirname + '/' + file );

}); //app.get *

io.on('connection', function(client){
            //Generate a new UUID, looks something like 
            //5b2ca132-64bd-4513-99da-90e838ca47d1
            //and store this on their socket/connection

            //tell the player they connected, giving them their id
        client.on("newuser", function(){
            client.userid = UUID();
            client.emit('newuser', { id: client.userid } );
            console.log('\t new player ' + client.userid + ' connected');
        });

        client.on("returninguser", function(data){
            console.log('\t returning player ' + data.id + ' connected');
            client.userid = data.id;
        });
        
        //When this client disconnects
        client.on('disconnect', function (data) {
            console.log('\t ::socket.io:: client disconnected ' + client.userid );

        }); //client.on disconnect
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});