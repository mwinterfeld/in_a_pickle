var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var UUID = require('node-uuid');

var games = {};

game = function(name, pid, pname){
    var obj = {
        name: name,
        players: [pid],
        player_names: {}
    }
    obj.player_names[pid] = pname;
    return obj;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


app.get( '/game/*', function(req, res, next){
    res.sendFile(__dirname + "/game.html");
});

app.get( '/*' , function( req, res, next ) {
    //This is the current file they have requested
    var file = req.params[0]; 

    //For debugging, we can track what files are requested.
    // console.log('\t ::Express:: file requested : ' + file);

    //Send the requesting client the file.
    res.sendFile( __dirname + '/' + file );

}); //app.get *

io.on('connection', function(client){
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

    client.on("newgame", function(data){
        console.log('\t player ' + data.id + ' requested a new game');
        var newgame = new game(data.name + "'s Game", data.id, data.name);
        var gameid = UUID();
        games[gameid] = newgame;
        client.emit("newgame", {"id": gameid, "name": newgame.name});
    });

    client.on("joingame", function(data){
        if(!(data.gameid in games)){
            console.log("\tInvalid game id: " + data.gameid)
            client.emit("invalidgame");
            return;
        }
        client.gameid = data.gameid;
        client.join(client.gameid);
        console.log("\t" + data.userid + " joined " + games[client.gameid].name);
        if(games[client.gameid].players.indexOf(data.userid) === -1){
            games[client.gameid].players.push(data.userid);
            games[client.gameid].player_names[data.userid] = data.name;
        }
        console.log(games[data.gameid].players);
    });

    client.on("keyup", function(data){
        console.log(data.id);
        console.log(games[client.gameid].player_names)
        console.log(games[client.gameid].player_names[data.id])
        client.broadcast.to(client.gameid).emit("keyup", games[client.gameid].player_names[data.id] + ": " + data.msg);
    });
    
    //When this client disconnects
    client.on('disconnect', function (data) {
        client.leave(client.gameid);
        if(client.gameid in games){
            games[client.gameid].players.splice(client.gameid);
            delete games[client.gameid].player_names[client.gameid];            
        }
        console.log('\t ::socket.io:: client disconnected ' + client.userid );
    }); //client.on disconnect
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});