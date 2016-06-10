function setupSocket(){
    if(!$.cookie("UUID") || !$.cookie("name")){
        window.location = "/";
    }
    window.socket = io.connect('/');
    window.socket.emit("returninguser", {id: $.cookie("UUID")});
}

function addMessage(msg){
    if($("#chat ul li").length > 500){
        $("#chat ul li:nth-child(1)").remove();
    }
    $("#chat ul").append("<li>" + msg + "</li>");
    $("#chat ul").scrollTop($("#chat ul").prop("scrollHeight"));
}
    
function joinLobby(){
    window.socket.on("invalidgame", function(){
        window.location = "/";
    });
    window.socket.on("gameinprogress", function(data){
        $('html').html("<h3 style='color: darkred;'>Game in progress, redirecting in 3 seconds...</h3>");
        setTimeout(function(){
            window.location = "/";
        }, 3000);
    });
    window.socket.emit("joingame", {"userid": $.cookie("UUID"), "gameid": document.location.pathname.replace("/game/", ""), "name": $.cookie("name")});
    window.socket.on("initialplayers", function(data){
        for(var idx in data){
            $("ul#players").append("<li id='" + idx + "'>" + data[idx] + "</li>");
        }
        runChat();
    });
    window.socket.on("newplayer", function(data){
        console.log(data);
        if($("li#" + data.id).length === 0){
            $("ul#players").append("<li id='" + data.id + "'>" + data.name + "</li>");
        }
    });
    window.socket.on("leavegame", function(data){
        $("ul#players li#" + data.id).remove();
        addMessage(data.name + " has left")
    });

    $("#start").click(function(){
        $('body').load('/game.html', function(){
            runGame();
        });
    });
}

function runChat(){
    window.socket.on("lobbymessage", function(data){
        addMessage(data);
    });

    $("#chat form").submit(function(e){
        addMessage($.cookie("name") + ": " + $("#chat form input").val())
        window.socket.emit("lobbymessage", $("#chat form input").val());
        $("#chat form input").val("");
        return false;
    });
}

function runGame(){
    $.getScript("game.js");
}

$(document).ready(function(){
    setupSocket();
    joinLobby();
});