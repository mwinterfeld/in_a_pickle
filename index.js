var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var UUID = require('node-uuid');

var games = {};

game = function(name, pid, pname){
    var obj = {
        name: name,
        players: [pid],
        player_names: {},
        status: "lobby"
    }
    obj.player_names[pid] = pname;
    return obj;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


app.get('/game/*', function(req, res, next){
    if(req.params[0].indexOf(".js") !== -1){
        res.sendFile(__dirname + "/" + req.params[0])
    }
    else {
        res.sendFile(__dirname + "/game_lobby.html");
    }
});

app.get( '/*' , function( req, res, next ) {
    //This is the current file they have requested
    var file = req.params[0]; 

    //For debugging, we can track what files are requested.
    console.log('\t ::Express:: file requested : ' + file);

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
            console.log("\t Invalid game id: " + data.gameid)
            client.emit("invalidgame");
            return;
        }
        client.gameid = data.gameid;
        client.join(client.gameid);
        console.log("\t " + data.userid + " joined " + games[client.gameid].name);
        if(games[client.gameid].players.indexOf(data.userid) === -1){
            games[client.gameid].players.push(data.userid);
            games[client.gameid].player_names[data.userid] = data.name;
        }
        client.emit("initialplayers", games[client.gameid].player_names);
        var newplayer = {};
        newplayer["id"] = client.userid;
        newplayer["name"] = games[client.gameid].player_names[client.userid]
        client.broadcast.to(client.gameid).emit("newplayer", newplayer);
    });

    client.on("lobbymessage", function(data){
        client.broadcast.to(client.gameid).emit("lobbymessage", games[client.gameid].player_names[client.userid] + ": " + data);
    });

    // client.on("keyup", function(data){
    //     console.log(data.id);
    //     console.log(games[client.gameid].player_names)
    //     console.log(games[client.gameid].player_names[data.id])
    //     client.broadcast.to(client.gameid).emit("keyup", games[client.gameid].player_names[data.id] + ": " + data.msg);
    // });
    
    client.on('disconnect', function (data) {
        if(client.gameid in games){
            client.broadcast.to(client.gameid).emit("leavegame", {"id": client.userid, "name": games[client.gameid].player_names[client.userid]})
            delete games[client.gameid].player_names[client.userid];
            games[client.gameid].players.splice(client.gameid);
            if(games[client.gameid].players.length === 0){
                console.log("\t game " + client.gameid + " empty, deleting it");
                delete games[client.gameid];
            }
        }
        client.leave(client.gameid);
        console.log('\t ::socket.io:: client disconnected ' + client.userid );
    });
});

http.listen(55001, function(){
  console.log('listening on *:55001');
});