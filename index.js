var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var UUID = require('node-uuid');

var games = {};

var game = function(name, pid, pname){
    var cards = [
        "Boat", "Dog", "Pickle", "Foot", "Needle", "Washington", "France", "Pizza", "Water",
        "Kitten", "Dirt", "Hill", "Sky", "Train", "Light", "Poster", "Paper", "Pyramid", "Ice",
        "Volcano", "Canary", "House", "Spaghetti", "Ocean", "Banana", "Monarch", "Spindle",
        "Phone", "Clock", "Jacuzzi", "Hair", "Lamp", "Caterpillar", "Avocado", "Stick",
        "Meringue", "Finger", "Bottle", "Granite", "Dust", "Smoke", "Fan", "Air", "Baby",
        "Windwill", "Hacksaw", "Box", "Washing\nMachine", "Island", "Spatula", "Bowl", "Canada",
        "Turkey", "Painting", "Room", "Snowman", "Cup", "Tea", "Ballsack", "Sake", "Kitty",
        "Rope", "Table", "Cell", "Tomato", "Italian", "Doorbell", "Dinosaur", "Planet", "Rock",
        "Amoeba", "Jelly", "Beans", "Fart", "Cake", "Auditorium", "Penis", "Whale", "Forest",
        "Island", "Strip Club", "Gabriel\nIglesias", "San Francisco", "Peter\nDinklage",
        "Key", "Television", "Garbage", "Hurricane", "Sharknado", "Cockroach", "Bedbug",
        "Bed", "Pillow", "Fire", "Campfire", "Log", "Mansion", "Celebrity", "Iceberg", "Ferret",
        "Fairy", "Magic", "Totoro", "The\nTerminator", "Arnold\nSchwarzenegger", "Book", "Idea",
        "Blood", "Chromosome", "Heart", "Liver", "Toe", "Nail", "Cloud", "Space", "Black Hole",
        "Spaceship", "USS\nEnterprise", "Nebula", "Asteroid", "Desktop", "Liquid", "Phone",
        "Paint", "Can", "Pot", "Powder", "Snowflake", "Rain", "Mountain", "River", "Mitten",
        "Couch", "Water Bear", "Canyon", "The\nInternet", "Your Momma", "Your Papa", "Beetle",
        "Greatness", "Shower", "Shower Caddy", "Lots Of\nBreasts", "Raw Meat", "Bullet", "Titan",
        "The Death\nStar", "Electron", "Quark", "Quantum\nField", "Leaves", "Number", "Wrench",
        "Word", "Alphabet", "Infinity", "Lingerie", "Shade"
    ];

    var obj = {
        name: name,
        players: [pid],
        player_names: {},
        player_cards: {},
        status: "lobby",
        "available": cards,
        "mode": "lobby"
    }
    obj.player_names[pid] = pname;
    obj.player_cards[pid] = [];
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
        else if(games[data.gameid].mode !== "lobby"){
            client.emit("gameinprogress");
        }
        client.gameid = data.gameid;
        client.join(client.gameid);
        console.log("\t " + data.userid + " joined " + games[client.gameid].name);
        if(games[client.gameid].players.indexOf(data.userid) === -1){
            games[client.gameid].players.push(data.userid);
            games[client.gameid].player_names[data.userid] = data.name;
            games[client.gameid].player_cards[data.userid] = [];
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

    client.on("getcard", function(data){
        var idx = Math.floor((Math.random() * games[client.gameid].available.length));
        var name = games[client.gameid].available[idx];
        games[client.gameid].player_cards[client.userid].push(name);
        console.log("\t player " + client.userid + " will receive card " + name);
        games[client.gameid].available.splice(idx, 1);
        client.emit("getcard", {"x": data.x, "y": data.y, "name": name});
    });
    
    client.on('disconnect', function (data) {
        console.log('\t ::socket.io:: client disconnected ' + client.userid );
        if(client.gameid in games){
            client.broadcast.to(client.gameid).emit("leavegame", {"id": client.userid, "name": games[client.gameid].player_names[client.userid]})
            games[client.gameid].players.splice(client.userid, 1);
            if(games[client.gameid].players.length === 0){
                console.log("\t game " + client.gameid + " empty, deleting it");
                delete games[client.gameid];
                return;
            }
            delete games[client.gameid].player_names[client.userid];
            for(var i in games[client.gameid].player_cards[client.userid]){
                games[client.gameid].available.push(games[client.gameid].player_cards[client.userid][i]);
            }
            delete games[client.gameid].player_cards[client.userid];
        }
        client.leave(client.gameid);
    });
});

http.listen(55001, function(){
  console.log('listening on *:55001');
});